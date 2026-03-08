import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative py-16 sm:py-24 overflow-hidden pattern-islamic">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

      <div className="container mx-auto px-4 relative z-10 text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-4"
        >
          <p className="text-sm font-medium tracking-widest uppercase text-secondary">
            Community Campaign
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            Build Our <span className="text-gradient-gold">Mosque</span>,<br />
            One Block at a Time
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-base sm:text-lg leading-relaxed">
            Each block represents a piece of our future mosque. Choose a block,
            make a donation, and leave your mark on this sacred project.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <a
            href="#mosque"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Explore the Mosque
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
