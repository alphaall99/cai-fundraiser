import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import logo from "@/assets/logo_ccai.png";

export default function SiteHeader() {
  return (
    <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <img src={logo} alt="Logo CCAI" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="font-display text-lg font-bold text-foreground leading-tight">
              Zad Al-Imane
            </h1>
            <p className="text-[11px] text-muted-foreground">Centre Communautaire</p>
          </div>
        </motion.div>

        <motion.a
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          href="#mosque"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity shadow-soft"
        >
          <Heart className="w-4 h-4" />
          Faire un don
        </motion.a>
      </div>
    </header>
  );
}
