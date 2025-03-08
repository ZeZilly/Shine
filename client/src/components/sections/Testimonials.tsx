import { ScrollReveal } from "../ui/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Johnson",
    text: "The most relaxing spa experience I've ever had. The therapists are truly skilled.",
    image: "https://images.unsplash.com/photo-1705705470605-4cece35b3a16"
  },
  {
    name: "Michael Chen",
    text: "Outstanding service and amazing facilities. I leave feeling renewed every time.",
    image: "https://images.unsplash.com/photo-1455849318743-b2233052fcff"
  }
];

/**
 * Renders a testimonials section with animated testimonial cards.
 *
 * This component displays a section with a heading and a responsive grid layout of testimonial cards. Each card presents a client's avatar (with an initials fallback), name, and testimonial text. The ScrollReveal component is used to animate the section title and each testimonial card with a staggered delay.
 *
 * @returns A JSX element representing the testimonials section.
 */
export function Testimonials() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <h2 className="text-4xl font-serif text-center mb-16">
            What Our Clients Say
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={index} delay={index * 0.2}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar>
                      <AvatarImage src={testimonial.image} />
                      <AvatarFallback>
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{testimonial.name}</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">{testimonial.text}</p>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
