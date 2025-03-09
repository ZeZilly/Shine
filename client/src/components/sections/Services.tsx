import { ScrollReveal } from "../ui/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    title: "Cilt Bakımı",
    description: "Profesyonel cilt bakımı ve tedavi hizmetleri",
    image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2"
  },
  {
    title: "Epilasyon",
    description: "Modern teknoloji ile kalıcı epilasyon",
    image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35"
  },
  {
    title: "Makyaj",
    description: "Özel günler için profesyonel makyaj hizmetleri",
    image: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8"
  }
];

export function Services() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <h2 className="text-4xl font-serif text-center mb-16">Hizmetlerimiz</h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ScrollReveal key={index} delay={index * 0.2}>
              <Card className="overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-64 object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="text-2xl font-serif mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}