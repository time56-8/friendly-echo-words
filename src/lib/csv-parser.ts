
import type { Session } from "@/types";

export function parseCSV(csvContent: string): Session[] {
  const lines = csvContent.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim());
  
  return lines.slice(1).map((line, index) => {
    const values = line.split(",").map(v => v.trim());
    const rowData: Record<string, string> = {};
    
    headers.forEach((header, i) => {
      rowData[header] = values[i];
    });
    
    return {
      id: crypto.randomUUID(),
      mentorId: rowData.mentorId || "",
      mentorName: rowData.mentorName || "",
      date: rowData.date || new Date().toISOString(),
      type: rowData.type || "Live Session",
      duration: parseInt(rowData.duration) || 60,
      ratePerHour: parseInt(rowData.ratePerHour) || 4000,
    };
  });
}
