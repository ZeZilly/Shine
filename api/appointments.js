import { storage } from '../server/storage';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { date, staffId } = req.query;
      
      if (!date) {
        return res.status(400).json({ error: "Tarih parametresi gereklidir" });
      }
      
      const appointments = await storage.getAppointmentsByDate(
        date,
        staffId
      );
      
      return res.json(appointments);
    } catch (error) {
      console.error("Admin appointments error:", error);
      return res.status(500).json({ error: "Randevular alınamadı" });
    }
  }
  
  if (req.method === 'POST') {
    try {
      const { name, email, phone, service, notes, appointmentDate, staffId } = req.body;
      
      // Kullanıcı oluştur veya güncelle
      const user = await storage.createOrUpdateUserByEmail({
        name,
        email,
        phone
      });
      
      // Randevu oluştur
      const appointment = await storage.createAppointment({
        userId: user.id,
        serviceType: service,
        appointmentDate: new Date(appointmentDate),
        staffId,
        notes,
        status: 'pending'
      });
      
      return res.json({ success: true, appointment });
    } catch (error) {
      console.error("Appointment creation error:", error);
      return res.status(500).json({ error: "Randevu oluşturulamadı" });
    }
  }
  
  return res.status(405).json({ error: "Method not allowed" });
} 