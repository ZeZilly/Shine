import express from 'express';
import { createMemoryStore } from "memorystore";
import session from "express-session";
import { OAuth2Client } from "google-auth-library";
import { calendar } from "@googleapis/calendar";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { pgTable, text, serial, varchar, timestamp } from "drizzle-orm/pg-core";
import { VercelRequest, VercelResponse } from '@vercel/node';
import { registerRoutes } from '../server/routes';

// --- Storage (adapted from server/storage.ts) ---
const MemoryStore = createMemoryStore(session);

class MemStorage {
    messages: Map<number, any>;
    users: Map<number, any>;
    appointments: Map<number, any>;
    newsletterEmails: Map<number, any>;
    currentId: number;
    sessionStore: any;

    constructor() {
        this.messages = new Map();
        this.users = new Map();
        this.appointments = new Map();
        this.newsletterEmails = new Map();
        this.currentId = 1;
        this.sessionStore = new MemoryStore({
            checkPeriod: 864e5, // Prune expired entries every 24h
        });
    }

    async createContactMessage(message: any) {
        const id = this.currentId++;
        const newMessage = { id, ...message };
        this.messages.set(id, newMessage);
        return newMessage;
    }

	async createOrUpdateUser(userData: any) {
		let user = await this.getUserByGoogleId(userData.googleId);
		if (!user) {
		  const id = this.currentId++;
		  user = {
			id,
			name: userData.name || "",
			email: userData.email || "",
			phone: userData.phone || "",
			googleId: userData.googleId,
			gender: userData.gender || null,
			age: userData.age || null,
			createdAt: new Date(),
		  };
		  this.users.set(id, user);
		}
		return user;
	  }

	  async getUser(id: number) {
		return this.users.get(id) || null;
	  }

	  async getUserByGoogleId(googleId: string) {
		return (
		  Array.from(this.users.values()).find((user) => user.googleId === googleId) ||
		  null
		);
	  }

	  async createAppointment(appointment: any) {
		const id = this.currentId++;
		const newAppointment = {
		  id,
		  userId: appointment.userId,
		  serviceType: appointment.serviceType,
		  appointmentDate: appointment.appointmentDate,
		  status: appointment.status,
		  createdAt: new Date(),
		};
		this.appointments.set(id, newAppointment);
		return newAppointment;
	  }

	  async addNewsletterEmail(email: string) {
		const id = this.currentId++;
		const newsletterEntry = {
		  id,
		  email,
		  createdAt: new Date(),
		};
		this.newsletterEmails.set(id, newsletterEntry);
		return newsletterEntry;
	  }
}

const storage = new MemStorage();

// --- Shared Schema (adapted from shared/schema.ts) ---
const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    phone: varchar("phone", { length: 20 }),
    googleId: varchar("google_id", { length: 255 }).unique(),
    gender: varchar("gender", { length: 20 }),
    age: varchar("age", { length: 3 }),
    createdAt: timestamp("created_at").defaultNow(),
});

const appointments = pgTable("appointments", {
    id: serial("id").primaryKey(),
    userId: serial("user_id").references(() => users.id),
    serviceType: varchar("service_type", { length: 100 }).notNull(),
    appointmentDate: timestamp("appointment_date").notNull(),
    status: varchar("status", { length: 20 }).notNull().default("pending"),
    createdAt: timestamp("created_at").defaultNow(),
});

const contactMessages = pgTable("contact_messages", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    message: text("message").notNull(),
});

const newsletterSchema = pgTable("newsletter_emails", {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow(),
});

const insertUserSchema = createInsertSchema(users)
    .pick({
        name: true,
        email: true,
        phone: true,
        gender: true,
        age: true,
    })
    .extend({
        email: z.string().email("Geçerli bir e-posta adresi giriniz"),
        phone: z.string().min(10, "Telefon numarası en az 10 karakter olmalıdır"),
    });

const insertAppointmentSchema = createInsertSchema(appointments).pick({
    serviceType: true,
    appointmentDate: true,
});

const insertContactSchema = createInsertSchema(contactMessages)
    .pick({
        name: true,
        email: true,
        phone: true,
        message: true,
    })
    .extend({
        email: z.string().email("Geçerli bir e-posta adresi giriniz"),
        phone: z.string().min(10, "Telefon numarası en az 10 karakter olmalıdır"),
        message: z.string().min(10, "Mesaj en az 10 karakter olmalıdır"),
    });

const insertNewsletterSchema = createInsertSchema(newsletterSchema)
    .pick({
        email: true,
    })
    .extend({
        email: z.string().email("Geçerli bir e-posta adresi giriniz"),
    });



const newsletterSchema2 = z.object({
    email: z.string().email("Geçerli bir e-posta adresi giriniz"),
});


// --- Auth (adapted from server/auth.ts) ---

const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "https://shining-beauty.repl.co/auth/google/callback" //  Adjust the callback URL if needed
);

const calendarClient = calendar({
    version: "v3",
    auth: oauth2Client,
});

// --- Express App Setup ---
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//VERY IMPORTANT SESSION!
app.use(
    session({
        secret: process.env.SESSION_SECRET || "your-secret-key", // Use a strong secret in production!
        resave: false,
        saveUninitialized: false,
        store: storage.sessionStore,
        cookie: {
            secure: process.env.NODE_ENV === "production", //  HTTPS only in production
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        },
    })
);


// --- Routes (combined from server/routes.ts and server/auth.ts) ---

//google oath routes
app.get("/auth/google", (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/calendar",
        ],
    });
    res.redirect(url);
});

app.get("/auth/google/callback", async (req, res) => {
    try {
        const { code } = req.query;
        if (typeof code !== "string") {
            throw new Error("Invalid authorization code");
        }
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Store tokens in session
        req.session.tokens = {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token, // Store refresh token
        };

        const tokenInfo = await oauth2Client.getTokenInfo(tokens.access_token!);
        const user = await storage.createOrUpdateUser({
            email: tokenInfo.email!,
            googleId: tokenInfo.sub!,
            name: "", // Will be updated later with profile info
            phone: "",
            gender: null,
            age: null,
        });
        req.session.userId = user.id;
        res.redirect("/"); // Redirect to the homepage after successful login
    } catch (error: any) {
        console.error("Auth error:", error);
        res.redirect("/login?error=auth_failed"); // Redirect to a login page with an error
    }
});

app.get("/api/calendar/available-slots", async (req, res) => {
    try {
        if (!req.session.tokens) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        oauth2Client.setCredentials({
            access_token: req.session.tokens.access_token,
            refresh_token: req.session.tokens.refresh_token,
        });
        const timeMin = new Date();
        const timeMax = new Date();
        timeMax.setDate(timeMax.getDate() + 14);

        const response = await calendarClient.events.list({
            calendarId: "primary",
            timeMin: timeMin.toISOString(),
            timeMax: timeMax.toISOString(),
            singleEvents: true,
            orderBy: "startTime",
        });

        const workingHours = {
            start: 9,  // 09:00
            end: 20    // 20:00
        };
        const availableSlots = [];

        const currentDate = new Date(timeMin);
        while (currentDate <= timeMax) {
            const hour = currentDate.getHours();
            if (hour >= workingHours.start && hour < workingHours.end) {
                const slot = currentDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', hour12: false });
                availableSlots.push(slot);
            }
            currentDate.setHours(currentDate.getHours() + 1);
        }

        res.json(availableSlots);

    } catch (error) {
        console.error("Calendar error:", error);
        res.status(500).json({ error: "Failed to fetch calendar slots" });
    }
});

app.post("/api/appointments", async (req, res) => {
    if (!req.session.userId || !req.session.tokens) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
        const { date, service } = req.body;

        oauth2Client.setCredentials({
            access_token: req.session.tokens.access_token,
            refresh_token: req.session.tokens.refresh_token
        });

        const event = await calendarClient.events.insert({
            calendarId: 'primary',
            requestBody: {
                summary: `Beauty Appointment - ${service}`,
                start: {
                    dateTime: date
                },
                end: {
                    dateTime: new Date(new Date(date).getTime() + 60 * 60 * 1000).toISOString()  // 1 hour duration
                }
            }
        });
        const appointment = await storage.createAppointment({
            userId: req.session.userId,
            serviceType: service,
            appointmentDate: new Date(date),
            status: "confirmed",
        });

        res.json({ appointment, calendarEvent: event.data });

    } catch (error) {
        console.error("Appointment creation error:", error);
        res.status(500).json({ error: "Failed to create appointment" });
    }
});

app.post("/api/contact", async (req, res) => {
    try {
        const data = insertContactSchema.parse(req.body);
        const message = await storage.createContactMessage(data);
        res.json(message);
    } catch (error) {
        res.status(400).json({ error: "Invalid contact form data" });
    }
});

app.post("/api/newsletter", async (req, res) => {
    try {
        const data = newsletterSchema2.parse(req.body);
        //  await storage.addNewsletterEmail(data.email); // Save to storage
        res.json({ success: true, email: data.email });
    } catch (error) {
        res.status(400).json({ error: "Geçersiz e-posta adresi" });
    }
});


// --- Error Handling ---
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ message });
});

// Export the app for Vercel
export default async (req: VercelRequest, res: VercelResponse) => {
  // Vercel serverless ortamında sunucu oluştur
  const server = await registerRoutes(app);
  
  // İstekleri Express'e yönlendir
  return server.emit('request', req, res);
};