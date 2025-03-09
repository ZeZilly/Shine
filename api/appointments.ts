import { NextApiRequest, NextApiResponse } from "next";
import { storage } from "../../server/storage";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const { date, staffId } = req.query;
      
      if (!date || typeof date !== 'string') {
        return res.status(400).json({ error: "Geçersiz tarih parametresi" });
      }
      
      const appointments = await storage.getAppointmentsByDate(
        date,
        typeof staffId === 'string' ? staffId : undefined
      );
      
      return res.json(appointments);
    } catch (error) {
      console.error("Randevu hatası:", error);
      return res.status(500).json({ error: "Sunucu hatası" });
    }
  }
  
  if (req.method === 'POST') {
    try {
      const { name, email, phone, service, notes, appointmentDate, staffId } = req.body;
      
      if (!name || !email || !service || !appointmentDate) {
        return res.status(400).json({ error: "Eksik bilgi" });
      }

      const user = await storage.createOrUpdateUserByEmail({
        name,
        email,
        phone: phone || ""
      });
      
      const appointment = await storage.createAppointment({
        userId: user.id,
        serviceType: service,
        appointmentDate: new Date(appointmentDate),
        staffId: staffId || undefined,
        notes: notes || undefined,
        status: 'pending'
      });
      
      return res.json({ success: true, appointment });
    } catch (error) {
      console.error("Randevu oluşturma hatası:", error);
      return res.status(500).json({ error: "Randevu oluşturulamadı" });
    }
  }
  
  return res.status(405).json({ error: "Desteklenmeyen metod" });
} 