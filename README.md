# Shining Beauty

Profesyonel güzellik ve bakım hizmetleri sunan bir spa merkezi için web uygulaması.

## Özellikler

- Responsive tasarım
- Randevu sistemi
- Google Calendar entegrasyonu
- İletişim formu
- Tema değiştirme (açık/koyu)
- Dil desteği (Türkçe/İngilizce)
- AI sohbet asistanı
- Admin paneli ve randevu yönetimi

## Teknolojiler

- React
- TypeScript
- Express.js
- Drizzle ORM
- PostgreSQL
- Google OAuth
- Framer Motion
- TailwindCSS
- Shadcn UI
- React Query
- React Hook Form
- Zod

## Kurulum

1. Repoyu klonlayın:
   ```
   git clone https://github.com/kullanici/shining-beauty.git
   cd shining-beauty
   ```

2. Bağımlılıkları yükleyin:
   ```
   npm install
   ```

3. `.env.example` dosyasını `.env` olarak kopyalayın ve gerekli değişkenleri doldurun.

4. Veritabanı şemasını oluşturun:
   ```
   npm run db:push
   ```

5. Geliştirme sunucusunu başlatın:
   ```
   npm run dev
   ```

## Dağıtım

Uygulamayı Vercel'e dağıtmak için:

1. Vercel CLI'ı yükleyin:
   ```
   npm i -g vercel
   ```

2. Projeyi dağıtın:
   ```
   vercel
   ```

3. Üretim ortamına dağıtmak için:
   ```
   vercel --prod
   ```

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. 