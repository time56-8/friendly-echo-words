
export interface Mentor {
  id: string;
  name: string;
  email: string;
}

export interface Session {
  id: string;
  mentorId: string;
  mentorName: string;
  date: string;
  type: string;
  duration: number;
  ratePerHour: number;
}

export interface Receipt {
  id: string;
  mentorId: string;
  mentorName: string;
  generatedDate: string;
  totalAmount: number;
  status: "Pending" | "Paid" | "Under Review";
  sessions: string[];
}

export interface ChatMessage {
  id: string;
  mentorId: string;
  senderId: string;
  senderType: "admin" | "mentor";
  content: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  userRole: "admin" | "mentor";
  timestamp: string;
  details: string;
  entityId?: string;
  entityType?: string;
}
