import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Staff {
  id: string;
  name: string;
  position: string;
  avatar?: string;
  specialties: string[];
}

interface StaffSelectorProps {
  serviceId: string;
  onSelectStaff: (staffId: string | undefined) => void;
}

/**
 * Renders a staff selection UI for a given service.
 *
 * This component fetches and displays a list of staff members associated with the provided service ID. While fetching, a loading spinner is shown. If no staff are available, an informational message is displayed. Clicking on a staff member toggles the selection and triggers the supplied callback with the selected staff ID or undefined if deselected.
 *
 * @param serviceId - The unique identifier of the service for which staff members are retrieved.
 * @param onSelectStaff - Callback invoked with the staff ID when a selection is made, or undefined if the selection is cleared.
 *
 * @returns A React element rendering the staff selector interface.
 */
export function StaffSelector({ serviceId, onSelectStaff }: StaffSelectorProps) {
  const [selectedStaffId, setSelectedStaffId] = useState<string | undefined>(undefined);

  const { data: staffList, isLoading } = useQuery({
    queryKey: ["staff", serviceId],
    queryFn: () => apiRequest<Staff[]>("GET", `/api/staff?serviceId=${serviceId}`),
    enabled: !!serviceId,
  });

  const handleStaffSelect = (staffId: string) => {
    if (selectedStaffId === staffId) {
      setSelectedStaffId(undefined);
      onSelectStaff(undefined);
    } else {
      setSelectedStaffId(staffId);
      onSelectStaff(staffId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!staffList || staffList.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Bu hizmet için personel bulunamadı</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Personel Seçin (İsteğe Bağlı)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staffList.map((staff) => (
          <Button
            key={staff.id}
            variant={selectedStaffId === staff.id ? "default" : "outline"}
            className="flex items-center gap-3 h-auto p-3 justify-start"
            onClick={() => handleStaffSelect(staff.id)}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={staff.avatar} alt={staff.name} />
              <AvatarFallback>{staff.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="font-medium">{staff.name}</p>
              <p className="text-xs text-muted-foreground">{staff.position}</p>
            </div>
          </Button>
        ))}
      </div>
      {selectedStaffId && (
        <Button 
          variant="ghost" 
          className="text-sm" 
          onClick={() => {
            setSelectedStaffId(undefined);
            onSelectStaff(undefined);
          }}
        >
          Personel seçimini kaldır
        </Button>
      )}
    </div>
  );
} 