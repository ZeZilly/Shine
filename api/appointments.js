import { storage } from '../server/storage';

/**
 * Handles HTTP GET and POST requests for managing appointments.
 *
 * For GET requests, the handler retrieves appointments for a specified date and optional staff ID.
 * It returns a 400 error if the "date" query parameter is missing and a 500 error if retrieval fails.
 *
 * For POST requests, it creates or updates a user using the provided details and schedules a new appointment
 * with a "pending" status. If user creation or appointment setup fails, it returns a 500 error.
 *
 * For any other HTTP method, the handler responds with a 405 error indicating the method is not allowed.
 *
 * @example
 * // Example GET request:
 * await handler({ method: 'GET', query: { date: '2025-03-15', staffId: '123' } }, res);
 *
 * @example
 * // Example POST request:
 * await handler({
 *   method: 'POST',
 *   body: {
 *     name: 'Jane Doe',
 *     email: 'jane@example.com',
 *     phone: '555-1234',
 *     service: 'consultation',
 *     notes: 'First appointment',
 *     appointmentDate: '2025-03-15T10:00:00Z',
 *     staffId: '123'
 *   }
 * }, res);
 */
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