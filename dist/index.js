// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import createMemoryStore from "memorystore";
import session from "express-session";
var MemoryStore = createMemoryStore(session);
var sampleServices = [
  { id: "cilt-bakimi", name: "Cilt Bak\u0131m\u0131", duration: 60, price: 350, description: "Profesyonel cilt bak\u0131m\u0131 ve tedavi hizmetleri" },
  { id: "epilasyon", name: "Epilasyon", duration: 45, price: 250, description: "Modern teknoloji ile kal\u0131c\u0131 epilasyon" },
  { id: "makyaj", name: "Makyaj", duration: 90, price: 400, description: "\xD6zel g\xFCnler i\xE7in profesyonel makyaj hizmetleri" },
  { id: "sac-bakimi", name: "Sa\xE7 Bak\u0131m\u0131", duration: 60, price: 300, description: "Sa\xE7 bak\u0131m\u0131 ve \u015Fekillendirme" },
  { id: "masaj", name: "Masaj", duration: 60, price: 450, description: "Rahatlat\u0131c\u0131 masaj terapileri" }
];
var sampleStaff = [
  {
    id: "staff-1",
    name: "Ay\u015Fe Y\u0131lmaz",
    position: "Cilt Bak\u0131m Uzman\u0131",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    specialties: ["cilt-bakimi", "makyaj"]
  },
  {
    id: "staff-2",
    name: "Mehmet Kaya",
    position: "Masaj Terapisti",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    specialties: ["masaj"]
  },
  {
    id: "staff-3",
    name: "Zeynep Demir",
    position: "Epilasyon Uzman\u0131",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    specialties: ["epilasyon"]
  },
  {
    id: "staff-4",
    name: "Elif \u015Eahin",
    position: "Sa\xE7 Stilisti",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    specialties: ["sac-bakimi"]
  }
];
var MemStorage = class {
  messages;
  users;
  appointments;
  newsletterEmails;
  currentId;
  sessionStore;
  constructor() {
    this.messages = /* @__PURE__ */ new Map();
    this.users = /* @__PURE__ */ new Map();
    this.appointments = /* @__PURE__ */ new Map();
    this.newsletterEmails = /* @__PURE__ */ new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 864e5
      // Prune expired entries every 24h
    });
  }
  async createContactMessage(message) {
    const id = this.currentId++;
    const newMessage = { id, ...message };
    this.messages.set(id, newMessage);
    return newMessage;
  }
  async createOrUpdateUser(userData) {
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
        createdAt: /* @__PURE__ */ new Date()
      };
      this.users.set(id, user);
    }
    return user;
  }
  async createOrUpdateUserByEmail(userData) {
    let user = await this.getUserByEmail(userData.email);
    if (!user) {
      const id = this.currentId++;
      user = {
        id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        googleId: null,
        gender: null,
        age: null,
        createdAt: /* @__PURE__ */ new Date()
      };
      this.users.set(id, user);
    } else {
      user.name = userData.name;
      user.phone = userData.phone;
      this.users.set(user.id, user);
    }
    return user;
  }
  async getUser(id) {
    return this.users.get(id) || null;
  }
  async getUserByGoogleId(googleId) {
    return Array.from(this.users.values()).find((user) => user.googleId === googleId) || null;
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find((user) => user.email === email) || null;
  }
  async createAppointment(appointment) {
    const id = this.currentId++;
    const newAppointment = {
      id,
      userId: appointment.userId,
      serviceType: appointment.serviceType,
      appointmentDate: appointment.appointmentDate,
      staffId: appointment.staffId || null,
      notes: appointment.notes || null,
      status: appointment.status,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.appointments.set(id, newAppointment);
    return newAppointment;
  }
  async addNewsletterEmail(email) {
    const existingEmail = Array.from(this.newsletterEmails.values()).find((entry) => entry.email === email);
    if (existingEmail) {
      return existingEmail;
    }
    const id = this.currentId++;
    const newsletterEntry = {
      id,
      email,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.newsletterEmails.set(id, newsletterEntry);
    return newsletterEntry;
  }
  async getServices() {
    return sampleServices;
  }
  async getStaffByService(serviceId) {
    if (!serviceId) return [];
    return sampleStaff.filter((staff) => staff.specialties.includes(serviceId));
  }
  async getAllStaff() {
    return sampleStaff;
  }
  async getAvailableTimeSlots(date, serviceId, staffId) {
    const workingHours = [
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00"
    ];
    const selectedDate = new Date(date);
    const appointments2 = Array.from(this.appointments.values()).filter((appointment) => {
      const appDate = new Date(appointment.appointmentDate);
      return appDate.toDateString() === selectedDate.toDateString() && (!staffId || appointment.staffId === staffId);
    });
    const bookedTimes = appointments2.map((appointment) => {
      const appDate = new Date(appointment.appointmentDate);
      return `${appDate.getHours().toString().padStart(2, "0")}:00`;
    });
    return workingHours.map((time) => ({
      time,
      available: !bookedTimes.includes(time)
    }));
  }
  async getAppointmentsByDate(date, staffId) {
    const selectedDate = new Date(date);
    const appointments2 = Array.from(this.appointments.values()).filter((appointment) => {
      const appDate = new Date(appointment.appointmentDate);
      return appDate.toDateString() === selectedDate.toDateString() && (!staffId || staffId === "all" || appointment.staffId === staffId);
    }).map(async (appointment) => {
      const user = await this.getUser(appointment.userId);
      const service = sampleServices.find((s) => s.id === appointment.serviceType);
      const staff = appointment.staffId ? sampleStaff.find((s) => s.id === appointment.staffId) : null;
      return {
        id: appointment.id.toString(),
        customerName: user?.name || "Misafir",
        customerEmail: user?.email || "",
        customerPhone: user?.phone || "",
        serviceName: service?.name || appointment.serviceType,
        serviceId: appointment.serviceType,
        staffName: staff?.name || null,
        staffId: appointment.staffId,
        appointmentDate: appointment.appointmentDate.toISOString(),
        status: appointment.status,
        notes: appointment.notes
      };
    });
    return Promise.all(appointments2);
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  googleId: varchar("google_id", { length: 255 }).unique(),
  gender: varchar("gender", { length: 20 }),
  age: varchar("age", { length: 3 }),
  createdAt: timestamp("created_at").defaultNow()
});
var appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  serviceType: varchar("service_type", { length: 100 }).notNull(),
  appointmentDate: timestamp("appointment_date").notNull(),
  staffId: varchar("staff_id", { length: 100 }),
  notes: text("notes"),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow()
});
var contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  message: text("message").notNull()
});
var newsletterSchema = pgTable("newsletter_emails", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  name: true,
  email: true,
  phone: true,
  gender: true,
  age: true
}).extend({
  email: z.string().email("Ge\xE7erli bir e-posta adresi giriniz"),
  phone: z.string().min(10, "Telefon numaras\u0131 en az 10 karakter olmal\u0131d\u0131r")
});
var insertAppointmentSchema = createInsertSchema(appointments).pick({
  serviceType: true,
  appointmentDate: true,
  staffId: true,
  notes: true
});
var insertContactSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  phone: true,
  message: true
}).extend({
  email: z.string().email("Ge\xE7erli bir e-posta adresi giriniz"),
  phone: z.string().min(10, "Telefon numaras\u0131 en az 10 karakter olmal\u0131d\u0131r"),
  message: z.string().min(10, "Mesaj en az 10 karakter olmal\u0131d\u0131r")
});
var insertNewsletterSchema = createInsertSchema(newsletterSchema).pick({
  email: true
}).extend({
  email: z.string().email("Ge\xE7erli bir e-posta adresi giriniz")
});

// server/auth.ts
import { OAuth2Client } from "google-auth-library";
import { calendar } from "@googleapis/calendar";
import session2 from "express-session";
var oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/auth/google/callback` : "http://localhost:3000/auth/google/callback"
);
var calendarClient = calendar({
  version: "v3",
  auth: oauth2Client
});
function setupAuth(app2) {
  app2.use(
    session2({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: storage.sessionStore,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1e3
      }
    })
  );
  app2.get("/auth/google", (req, res) => {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/calendar"
      ]
    });
    res.redirect(url);
  });
  app2.get("/auth/google/callback", async (req, res) => {
    try {
      const { code } = req.query;
      if (typeof code !== "string") {
        throw new Error("Invalid authorization code");
      }
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
      req.session.tokens = {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token
      };
      const tokenInfo = await oauth2Client.getTokenInfo(tokens.access_token);
      const user = await storage.createOrUpdateUser({
        email: tokenInfo.email,
        googleId: tokenInfo.sub,
        name: "",
        // Will be updated later with profile info
        phone: "",
        gender: null,
        age: null
      });
      req.session.userId = user.id;
      res.redirect("/");
    } catch (error) {
      console.error("Auth error:", error);
      res.redirect("/login?error=auth_failed");
    }
  });
  app2.get("/api/calendar/available-slots", async (req, res) => {
    try {
      if (!req.session.tokens) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      oauth2Client.setCredentials({
        access_token: req.session.tokens.access_token,
        refresh_token: req.session.tokens.refresh_token
      });
      const timeMin = /* @__PURE__ */ new Date();
      const timeMax = /* @__PURE__ */ new Date();
      timeMax.setDate(timeMax.getDate() + 14);
      const response = await calendarClient.events.list({
        calendarId: "primary",
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        singleEvents: true,
        orderBy: "startTime"
      });
      const workingHours = {
        start: 9,
        // 09:00
        end: 20
        // 20:00
      };
      const availableSlots = [];
      const currentDate = new Date(timeMin);
      while (currentDate <= timeMax) {
        const hour = currentDate.getHours();
        if (hour >= workingHours.start && hour < workingHours.end) {
          const slot = currentDate.toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
          });
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
  app2.post("/api/appointments", async (req, res) => {
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
        calendarId: "primary",
        requestBody: {
          summary: `Beauty Appointment - ${service}`,
          start: {
            dateTime: date
          },
          end: {
            dateTime: new Date(new Date(date).getTime() + 60 * 60 * 1e3).toISOString()
            // 1 hour duration
          }
        }
      });
      const appointment = await storage.createAppointment({
        userId: req.session.userId,
        serviceType: service,
        appointmentDate: new Date(date),
        status: "confirmed"
      });
      res.json({ appointment, calendarEvent: event.data });
    } catch (error) {
      console.error("Appointment creation error:", error);
      res.status(500).json({ error: "Failed to create appointment" });
    }
  });
}

// server/routes.ts
import { z as z2 } from "zod";
var newsletterSchema2 = z2.object({
  email: z2.string().email("Ge\xE7erli bir e-posta adresi giriniz")
});
async function registerRoutes(app2) {
  setupAuth(app2);
  app2.post("/api/contact", async (req, res) => {
    try {
      const data = insertContactSchema.parse(req.body);
      const message = await storage.createContactMessage(data);
      res.json(message);
    } catch (error) {
      res.status(400).json({ error: "Invalid contact form data" });
    }
  });
  app2.post("/api/newsletter", async (req, res) => {
    try {
      const data = newsletterSchema2.parse(req.body);
      const newsletterEntry = await storage.addNewsletterEmail(data.email);
      res.json({ success: true, email: data.email });
    } catch (error) {
      res.status(400).json({ error: "Ge\xE7ersiz e-posta adresi" });
    }
  });
  app2.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Ge\xE7erli bir mesaj g\xF6nderilmedi" });
      }
      let response = "";
      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes("merhaba") || lowerMessage.includes("selam")) {
        response = "Merhaba! Size nas\u0131l yard\u0131mc\u0131 olabilirim?";
      } else if (lowerMessage.includes("randevu") || lowerMessage.includes("rezervasyon")) {
        response = "Randevu almak i\xE7in 'Randevu Al' butonunu kullanabilir veya +90 505 071 95 01 numaral\u0131 telefondan bize ula\u015Fabilirsiniz.";
      } else if (lowerMessage.includes("fiyat") || lowerMessage.includes("\xFCcret")) {
        response = "Hizmetlerimizin fiyatlar\u0131 hakk\u0131nda bilgi almak i\xE7in l\xFCtfen bizimle ileti\u015Fime ge\xE7in. Her hizmet i\xE7in farkl\u0131 fiyatland\u0131rmalar\u0131m\u0131z bulunmaktad\u0131r.";
      } else if (lowerMessage.includes("adres") || lowerMessage.includes("konum") || lowerMessage.includes("nerede")) {
        response = "Salonumuz Adana'da bulunmaktad\u0131r. Detayl\u0131 adres bilgisi i\xE7in l\xFCtfen ileti\u015Fim sayfam\u0131z\u0131 ziyaret edin.";
      } else if (lowerMessage.includes("saat") || lowerMessage.includes("\xE7al\u0131\u015Fma")) {
        response = "\xC7al\u0131\u015Fma saatlerimiz: Pazartesi-Cumartesi 09:00-20:00 aras\u0131ndad\u0131r. Pazar g\xFCnleri kapal\u0131y\u0131z.";
      } else {
        response = "Sorunuz i\xE7in te\u015Fekk\xFCrler. Size daha iyi yard\u0131mc\u0131 olabilmek i\xE7in l\xFCtfen +90 505 071 95 01 numaral\u0131 telefondan bize ula\u015F\u0131n veya web sitemizden randevu al\u0131n.";
      }
      res.json({ response });
    } catch (error) {
      console.error("AI Chat error:", error);
      res.status(500).json({ error: "AI yan\u0131t\u0131 al\u0131namad\u0131" });
    }
  });
  app2.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      console.error("Services error:", error);
      res.status(500).json({ error: "Hizmetler al\u0131namad\u0131" });
    }
  });
  app2.get("/api/staff", async (req, res) => {
    try {
      const { serviceId } = req.query;
      const staff = await storage.getStaffByService(serviceId);
      res.json(staff);
    } catch (error) {
      console.error("Staff error:", error);
      res.status(500).json({ error: "Personel bilgileri al\u0131namad\u0131" });
    }
  });
  app2.get("/api/appointments/available", async (req, res) => {
    try {
      const { date, serviceId, staffId } = req.query;
      if (!date || !serviceId) {
        return res.status(400).json({ error: "Tarih ve hizmet ID'si gereklidir" });
      }
      const timeSlots = await storage.getAvailableTimeSlots(
        date,
        serviceId,
        staffId
      );
      res.json(timeSlots);
    } catch (error) {
      console.error("Available slots error:", error);
      res.status(500).json({ error: "M\xFCsait saatler al\u0131namad\u0131" });
    }
  });
  app2.post("/api/appointments", async (req, res) => {
    try {
      const { name, email, phone, service, notes, appointmentDate, staffId } = req.body;
      const user = await storage.createOrUpdateUserByEmail({
        name,
        email,
        phone
      });
      const appointment = await storage.createAppointment({
        userId: user.id,
        serviceType: service,
        appointmentDate: new Date(appointmentDate),
        staffId,
        notes,
        status: "pending"
      });
      res.json({ success: true, appointment });
    } catch (error) {
      console.error("Appointment creation error:", error);
      res.status(500).json({ error: "Randevu olu\u015Fturulamad\u0131" });
    }
  });
  app2.get("/api/admin/appointments", async (req, res) => {
    try {
      const { date, staffId } = req.query;
      if (!date) {
        return res.status(400).json({ error: "Tarih parametresi gereklidir" });
      }
      const appointments2 = await storage.getAppointmentsByDate(
        date,
        staffId
      );
      res.json(appointments2);
    } catch (error) {
      console.error("Admin appointments error:", error);
      res.status(500).json({ error: "Randevular al\u0131namad\u0131" });
    }
  });
  app2.get("/api/admin/staff", async (req, res) => {
    try {
      const staff = await storage.getAllStaff();
      res.json(staff);
    } catch (error) {
      console.error("Admin staff error:", error);
      res.status(500).json({ error: "Personel bilgileri al\u0131namad\u0131" });
    }
  });
  return createServer(app2);
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    port: 5e3,
    strictPort: true,
    host: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
