import { motion } from "framer-motion";
import { ChevronDown, ShieldCheck, CreditCard } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative py-16 sm:py-24 overflow-hidden pattern-islamic">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

      <div className="container mx-auto px-4 relative z-10 text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-4"
        >
          <p className="text-sm font-medium tracking-widest uppercase text-secondary">
            Campagne Communautaire
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            Construisons notre{" "}
            <span className="text-gradient-gold">Centre</span>,<br />
            Bloc par Bloc
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-base sm:text-lg leading-relaxed">
            Chaque bloc représente une partie de notre futur centre communautaire.
            Choisissez un bloc, faites un don et laissez votre empreinte sur ce projet sacré.
          </p>
        </motion.div>

        {/* Tax & Zeffy info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto"
        >
          <div className="flex items-center gap-2 bg-card border border-border/50 rounded-lg px-4 py-2 shadow-soft">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
            <span className="text-xs text-muted-foreground text-left">
              <strong className="text-foreground">Don déductible d'impôts</strong> — 50 % vous sera retourné
            </span>
          </div>
          <div className="flex items-center gap-2 bg-card border border-border/50 rounded-lg px-4 py-2 shadow-soft">
            <CreditCard className="w-5 h-5 text-primary shrink-0" />
            <span className="text-xs text-muted-foreground text-left">
              <strong className="text-foreground">0 % de commission via Zeffy</strong> — 100 % de votre don va au centre, même par carte de crédit
            </span>
          </div>
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
            Découvrir le Centre
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
