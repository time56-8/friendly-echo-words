
import type { Session } from "@/types";

interface PayoutOptions {
  platformFeePercentage?: number;
  gstPercentage?: number;
  additionalCharges?: {
    name: string;
    amount: number;
  }[];
}

export function calculatePayout(
  sessions: Session[], 
  options: PayoutOptions = { 
    platformFeePercentage: 5, 
    gstPercentage: 18 
  }
): number {
  // Calculate base amount
  const baseAmount = sessions.reduce((total, session) => {
    const hourlyRate = session.ratePerHour;
    const hours = session.duration / 60;
    return total + (hourlyRate * hours);
  }, 0);
  
  // Apply platform fee
  const platformFee = options.platformFeePercentage 
    ? (baseAmount * options.platformFeePercentage / 100) 
    : 0;
  
  // Calculate subtotal after platform fee
  const subtotal = baseAmount - platformFee;
  
  // Apply GST
  const gst = options.gstPercentage 
    ? (subtotal * options.gstPercentage / 100) 
    : 0;
  
  // Apply additional charges
  const additionalChargesTotal = options.additionalCharges
    ? options.additionalCharges.reduce((total, charge) => total + charge.amount, 0)
    : 0;
  
  // Calculate final payout amount
  const totalPayout = subtotal - gst - additionalChargesTotal;
  
  return Math.round(totalPayout);
}
