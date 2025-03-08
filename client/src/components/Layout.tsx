import { Navigation } from "./ui/Navigation";
import { ScrollReveal } from "./ui/ScrollReveal";
import { SocialLinks } from "./ui/SocialLinks";

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Renders a full-page layout with navigation, social links, content area, and footer.
 *
 * The Layout component provides a consistent page structure. It displays a navigation bar,
 * social links, and any nested content passed via the children prop. The footer includes
 * a business description, contact information, and legal links, along with a copyright notice.
 * Tailwind CSS classes ensure responsive styling, and the ScrollReveal component adds an animated
 * reveal effect to the footer.
 *
 * @param children - The content to be displayed within the layout.
 */
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