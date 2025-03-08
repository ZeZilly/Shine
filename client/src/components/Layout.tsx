import { Navigation } from "./ui/Navigation";
import { ScrollReveal } from "./ui/ScrollReveal";
import { SocialLinks } from "./ui/SocialLinks";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <Navigation />
      <SocialLinks />
      {children}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-serif mb-4">Shining Beauty</h3>
                <p className="text-gray-400">
                  Profesyonel spa ve güzellik merkezi
                </p>
              </div>
              <div>
                <h4 className="text-lg mb-4">İletişim</h4>
                <address className="text-gray-400 not-italic">
                  Adana, Türkiye<br />
                  Tel: +90 505 071 95 01<br />
                  Email: kubraoguz59@icloud.com
                </address>
              </div>
              <div>
                <h4 className="text-lg mb-4">Yasal</h4>
                <ul className="text-gray-400 space-y-2">
                  <li>
                    <a href="/gizlilik" className="hover:text-white transition-colors">
                      Gizlilik Politikası
                    </a>
                  </li>
                  <li>
                    <a href="/kosullar" className="hover:text-white transition-colors">
                      Kullanım Koşulları
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
              <p>© 2024 Shining Beauty. Tüm hakları saklıdır.</p>
            </div>
          </ScrollReveal>
        </div>
      </footer>
    </div>
  );
}