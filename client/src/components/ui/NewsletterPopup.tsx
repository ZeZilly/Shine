import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { motion, AnimatePresence } from "framer-motion";

const formSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
});

type FormValues = z.infer<typeof formSchema>;

/**
 * Renders a newsletter subscription popup for email subscriptions.
 *
 * The component displays a popup with an email subscription form after a 3-second delay if it hasn't been dismissed before (as tracked via localStorage). 
 * It leverages React Hook Form with Zod for form validation and React Query to handle the subscription API request. On successful submission, it shows a success toast, closes the popup, and records the dismissal in localStorage; on failure, it displays an error toast. The popup is animated using Framer Motion and can be manually closed via a dedicated close button.
 */
export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Popup'ı 3 saniye sonra göster
    const timer = setTimeout(() => {
      // Daha önce kapatılmadıysa göster
      const hasClosedPopup = localStorage.getItem("hasClosedPopup");
      if (!hasClosedPopup) {
        setIsOpen(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormValues) => 
      apiRequest<{ success: boolean }>("POST", "/api/newsletter", data),
    onSuccess: () => {
      toast({
        title: "Başarılı!",
        description: "Kampanya listemize kaydoldunuz. İndirim kodunuz e-posta adresinize gönderilecektir.",
      });
      setIsOpen(false);
      localStorage.setItem("hasClosedPopup", "true");
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Bir sorun oluştu. Lütfen daha sonra tekrar deneyin.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("hasClosedPopup", "true");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50 max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Kapat"
          >
            <X size={18} />
          </button>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-primary mb-2">Özel Fırsat!</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Kampanyalardan ve fırsatlardan yararlanmak için özel müşteri bilgilendirme listemize şimdi kaydolun ve ilk 3 işleminiz için %25 indirim kazanın.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Ayrıca sizin tavsiyenizle gelecek kişiler de indirim fırsatından yararlanabilir.
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="E-posta adresiniz" 
                        {...field} 
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Kaydediliyor..." : "Kaydol ve İndirim Kazan"}
              </Button>
            </form>
          </Form>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 