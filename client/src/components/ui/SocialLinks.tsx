import { SiInstagram, SiWhatsapp } from "react-icons/si";
import { motion } from "framer-motion";

export function SocialLinks() {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
      <motion.a
        href="https://www.instagram.com/shining.beauty.wellness"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        <SiInstagram className="w-6 h-6 text-pink-600" />
      </motion.a>

      <motion.a
        href="https://wa.me/905050719501"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        <SiWhatsapp className="w-6 h-6 text-green-500" />
      </motion.a>
    </div>
  );
}