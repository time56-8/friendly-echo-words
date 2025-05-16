
import type { Mentor, Session, Receipt } from "@/types";
import { calculatePayout } from "./payout-calculator";

export function generateReceipt(
  mentor: Mentor,
  sessions: Session[],
  payoutAmount?: number
): Receipt {
  // If payout amount is not provided, calculate it
  const amount = payoutAmount !== undefined 
    ? payoutAmount 
    : calculatePayout(sessions);
  
  return {
    id: crypto.randomUUID(),
    mentorId: mentor.id,
    mentorName: mentor.name,
    generatedDate: new Date().toISOString(),
    totalAmount: amount,
    status: "Pending",
    sessions: sessions.map(s => s.id),
  };
}
