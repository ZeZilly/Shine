import { ParallaxImage } from "../ui/ParallaxImage";
import { motion } from "framer-motion";
import { Link } from "wouter";

export function Hero() {
  return (
    <section className="relative h-screen overflow-hidden">
      <ParallaxImage
        src="https://images.unsplash.com/photo-1714075853573-0bbf3c6f1d79"
        alt="Spa ambiance"
        className="absolute inset-0 z-0"
      />
      <div className="absolute inset-0 bg-black/40 z-10" />

      <div className="relative z-20 h-full flex items-center justify-center text-center text-white px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl md:text-7xl font-serif mb-6">
            Shining Beauty Wellness
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8">
            Premium güzellik ve bakım hizmetleri
          </p>
          <Link href="/randevu">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-white text-gray-900 px-8 py-3 rounded-full text-lg font-medium cursor-pointer"
            >
              Randevu Al
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}