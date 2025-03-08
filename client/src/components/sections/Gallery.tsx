import { ScrollReveal } from "../ui/ScrollReveal";

const images = [
  {
    src: "https://images.unsplash.com/photo-1552511556-9f16dcb6561f",
    alt: "Spa treatment"
  },
  {
    src: "https://images.unsplash.com/photo-1609234656432-603fd648adf8",
    alt: "Wellness service"
  },
  {
    src: "https://images.unsplash.com/photo-1496449903678-68ddcb189a24",
    alt: "Relaxation"
  },
  {
    src: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173",
    alt: "Wellness"
  }
];

/**
 * Renders a responsive gallery section with animated images.
 *
 * The component displays a "Our Gallery" heading wrapped in a scroll reveal for animation, followed by a responsive
 * grid that presents a series of images. Each image appears with a delayed reveal effect and features a scaling
 * transition on hover for enhanced visual interactivity.
 */
export function Gallery() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <h2 className="text-4xl font-serif text-center mb-16">Our Gallery</h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <div className="aspect-square overflow-hidden rounded-lg">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
