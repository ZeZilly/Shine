import { ScrollReveal } from "../ui/ScrollReveal";

export function About() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <ScrollReveal direction="left">
          <img
            src="https://images.unsplash.com/photo-1613963931023-5dc59437c8a6"
            alt="Güzellik merkezi"
            className="rounded-lg shadow-xl"
          />
        </ScrollReveal>

        <ScrollReveal direction="right">
          <div className="space-y-6">
            <h2 className="text-4xl font-serif">Hakkımızda</h2>
            <p className="text-gray-600 leading-relaxed">
              Kübra Canım Bacım Güzellik Merkezi olarak, sizlere en kaliteli ve 
              profesyonel güzellik hizmetlerini sunmaktan gurur duyuyoruz. 
              Deneyimli ekibimiz ve modern ekipmanlarımızla, güzelliğinizi 
              ön plana çıkarıyoruz.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Çalışma Saatlerimiz: 09:00 - 20:00
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}