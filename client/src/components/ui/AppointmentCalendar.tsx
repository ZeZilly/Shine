import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Loader2 } from "lucide-react";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface AppointmentCalendarProps {
  onSelectDateTime: (date: Date, time: string) => void;
  serviceId: string;
  staffId?: string;
}

/**
 * Renders a calendar interface for selecting an appointment date and time.
 *
 * When a date is chosen, the component fetches available time slots (omitting past dates and Sundays) for the specified service and, optionally, staff member. Selecting an available time slot triggers the provided callback with a Date object (combining the selected date and time) and the time string.
 *
 * @param onSelectDateTime - Callback invoked with the appointment date and time when a time slot is selected.
 * @param serviceId - Identifier used to retrieve available time slots for the service.
 * @param staffId - Optional identifier to filter available time slots by a specific staff member.
 */
export function AppointmentCalendar({ 
  onSelectDateTime, 
  serviceId,
  staffId 
}: AppointmentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Seçilen tarih için müsait saatleri getir
  const { data: timeSlots, isLoading } = useQuery({
    queryKey: ["availableTimeSlots", selectedDate?.toISOString().split("T")[0], serviceId, staffId],
    queryFn: () => 
      apiRequest<TimeSlot[]>("GET", 
        `/api/appointments/available?date=${selectedDate?.toISOString().split("T")[0]}&serviceId=${serviceId}${staffId ? `&staffId=${staffId}` : ""}`
      ),
    enabled: !!selectedDate,
  });

  // Müsait saatleri güncelle
  useEffect(() => {
    if (timeSlots) {
      setAvailableTimeSlots(timeSlots);
      setSelectedTime(null); // Tarih değiştiğinde seçili saati sıfırla
    }
  }, [timeSlots]);

  // Tarih seçildiğinde
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  // Saat seçildiğinde
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      const dateTime = new Date(selectedDate);
      const [hours, minutes] = time.split(":").map(Number);
      dateTime.setHours(hours, minutes, 0, 0);
      onSelectDateTime(dateTime, time);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-3">Tarih Seçin</h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => {
              // Geçmiş tarihleri ve pazar günlerini devre dışı bırak
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date < today || date.getDay() === 0;
            }}
            className="rounded-md border"
          />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-medium mb-3">Saat Seçin</h3>
          {!selectedDate ? (
            <div className="text-center p-6 bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Lütfen önce bir tarih seçin</p>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : availableTimeSlots.length === 0 ? (
            <div className="text-center p-6 bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Seçilen tarihte müsait saat bulunmamaktadır</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {availableTimeSlots.map((slot) => (
                <Button
                  key={slot.time}
                  variant={selectedTime === slot.time ? "default" : "outline"}
                  className={!slot.available ? "opacity-50 cursor-not-allowed" : ""}
                  disabled={!slot.available}
                  onClick={() => handleTimeSelect(slot.time)}
                >
                  {slot.time}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedDate && (
        <div className="bg-muted/20 p-4 rounded-md">
          <p className="font-medium">Seçilen Tarih:</p>
          <p>{format(selectedDate, "d MMMM yyyy, EEEE", { locale: tr })}</p>
          {selectedTime && (
            <>
              <p className="font-medium mt-2">Seçilen Saat:</p>
              <p>{selectedTime}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
} 