import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BlockData, TIERS } from "@/lib/mosqueData";
import { Heart, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface DonationModalProps {
  block: BlockData | null;
  open: boolean;
  onClose: () => void;
  onDonate: (blockId: string, amount: number, name: string, label: string) => void;
}

const tierGradients: Record<number, string> = {
  1: "from-tier-1 to-emerald-light",
  2: "from-tier-2 to-gold-light",
  3: "from-tier-3 to-purple-400",
  4: "from-tier-4 to-pink-400",
};

export default function DonationModal({ block, open, onClose, onDonate }: DonationModalProps) {
  const [name, setName] = useState("");
  const [label, setLabel] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [step, setStep] = useState<"info" | "payment">("info");

  if (!block) return null;

  const tier = TIERS[block.tier];
  const remaining = tier.price - block.donated;
  const progress = block.donated / tier.price;

  const handleProceed = () => {
    const amount = Number(donationAmount);
    if (!amount || amount <= 0 || amount > remaining) {
      toast.error(`Please enter an amount between $1 and $${remaining.toLocaleString()}`);
      return;
    }
    setStep("payment");
  };

  const handleDonate = () => {
    const amount = Number(donationAmount);
    onDonate(block.id, amount, name, label || name);
    toast.success("Thank you for your generous donation! 🤲", {
      description: `$${amount.toLocaleString()} donated to ${tier.label} block`,
    });
    resetAndClose();
  };

  const resetAndClose = () => {
    setName("");
    setLabel("");
    setDonationAmount("");
    setStep("info");
    onClose();
  };

  const quickAmounts = [
    Math.round(remaining * 0.25),
    Math.round(remaining * 0.5),
    remaining,
  ].filter((a) => a > 0);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && resetAndClose()}>
      <DialogContent className="sm:max-w-md border-border/50 shadow-card">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <div className={`w-5 h-5 rounded bg-gradient-to-br ${tierGradients[block.tier]}`} />
            {tier.label} Block — ${tier.price.toLocaleString()}
          </DialogTitle>
          <DialogDescription>
            {block.donated > 0
              ? `$${block.donated.toLocaleString()} already funded. $${remaining.toLocaleString()} remaining.`
              : "Be the first to contribute to this block!"}
          </DialogDescription>
        </DialogHeader>

        {/* Progress bar */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${tierGradients[block.tier]} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>

        <AnimatePresence mode="wait">
          {step === "info" ? (
            <motion.div
              key="info"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="donor-name">Your Name</Label>
                <Input
                  id="donor-name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="donor-label">Display Label (optional)</Label>
                <Input
                  id="donor-label"
                  placeholder="e.g. Ali Family"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Donation Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder={`Up to $${remaining.toLocaleString()}`}
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  max={remaining}
                  min={1}
                />
                <div className="flex gap-2">
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setDonationAmount(String(amount))}
                      className="px-3 py-1 text-xs rounded-full border border-border hover:bg-muted transition-colors"
                    >
                      ${amount.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={handleProceed} className="w-full" size="lg" disabled={!name.trim()}>
                <Heart className="w-4 h-4 mr-2" />
                Continue to Payment
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Block</span>
                  <span className="font-medium">{tier.label}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Donor</span>
                  <span className="font-medium">{label || name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-semibold text-primary">${Number(donationAmount).toLocaleString()}</span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground text-center space-y-1">
                <p>🧾 Your donation is tax deductible — 50% will be returned to you.</p>
                <p>💯 Processed by Zeffy — 0% commission, 100% goes to the community center.</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("info")} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleDonate} className="flex-1" size="lg">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Donate ${Number(donationAmount).toLocaleString()}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
