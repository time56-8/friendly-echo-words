
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { SessionDialog } from "@/components/SessionDialog";
import { parseCSV } from "@/lib/csv-parser";
import type { Session, Mentor, Receipt } from "@/types";
import { calculatePayout } from "@/lib/payout-calculator";
import { generateReceipt } from "@/lib/receipt-generator";
import { ChatPanel } from "@/components/ChatPanel";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([
    { id: "1", name: "John Doe", email: "john@example.com" },
    { id: "2", name: "Jane Smith", email: "jane@example.com" },
    { id: "3", name: "Alex Johnson", email: "alex@example.com" },
  ]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<string>("30");
  const [auditLogs, setAuditLogs] = useState<any[]>([
    { id: 1, action: "Session Added", user: "Admin", timestamp: new Date().toISOString(), details: "Added session for Jane Smith" },
    { id: 2, action: "Receipt Generated", user: "Admin", timestamp: new Date().toISOString(), details: "Generated receipt for John Doe" },
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvData = event.target?.result as string;
        const parsedSessions = parseCSV(csvData);
        
        setSessions(prev => [...prev, ...parsedSessions]);
        addAuditLog(`Uploaded ${parsedSessions.length} sessions via CSV`);
        
        toast({
          title: "CSV Upload Successful",
          description: `${parsedSessions.length} sessions imported successfully.`,
        });
      } catch (error) {
        toast({
          title: "CSV Upload Failed",
          description: "There was an error processing the CSV file.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const addSession = (sessionData: Session) => {
    setSessions(prev => [...prev, sessionData]);
    addAuditLog(`Added session for ${sessionData.mentorName}`);
    toast({
      title: "Session Added",
      description: `Session for ${sessionData.mentorName} on ${new Date(sessionData.date).toLocaleDateString()} added successfully.`,
    });
  };

  const addAuditLog = (details: string) => {
    const newLog = {
      id: auditLogs.length + 1,
      action: "System Action",
      user: "Admin",
      timestamp: new Date().toISOString(),
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const generatePayoutReceipt = (mentorId: string) => {
    const mentor = mentors.find(m => m.id === mentorId);
    if (!mentor) return;
    
    const mentorSessions = sessions.filter(s => s.mentorId === mentorId);
    if (mentorSessions.length === 0) {
      toast({
        title: "No Sessions Found",
        description: `No sessions found for ${mentor.name}.`,
        variant: "destructive",
      });
      return;
    }
    
    const payoutAmount = calculatePayout(mentorSessions);
    const receipt = generateReceipt(mentor, mentorSessions, payoutAmount);
    
    setReceipts(prev => [...prev, receipt]);
    addAuditLog(`Generated receipt for ${mentor.name}`);
    
    toast({
      title: "Receipt Generated",
      description: `Receipt for ${mentor.name} generated successfully.`,
    });
  };

  const getFilteredSessions = () => {
    if (!selectedDateRange) return sessions;
    
    const now = new Date();
    const daysAgo = parseInt(selectedDateRange);
    const compareDate = new Date();
    compareDate.setDate(now.getDate() - daysAgo);
    
    return sessions.filter(session => new Date(session.date) >= compareDate);
  };

  const filteredSessions = getFilteredSessions();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={() => setIsDialogOpen(true)}>Add Session</Button>
        </div>

        <Tabs defaultValue="sessions">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="payouts">Payouts & Receipts</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sessions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Session Data</CardTitle>
                <CardDescription>Manage mentor session information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <label htmlFor="date-filter" className="text-sm font-medium">Filter by date range:</label>
                    <select
                      id="date-filter"
                      value={selectedDateRange}
                      onChange={(e) => setSelectedDateRange(e.target.value)}
                      className="ml-2 rounded-md border border-input bg-background p-1"
                    >
                      <option value="7">Last 7 days</option>
                      <option value="15">Last 15 days</option>
                      <option value="30">Last 30 days</option>
                      <option value="90">Last 90 days</option>
                      <option value="">All time</option>
                    </select>
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      id="csv-upload"
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="max-w-xs"
                    />
                    <Button variant="outline">Upload CSV</Button>
                  </div>
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mentor</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Session Type</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Rate (₹/hr)</TableHead>
                        <TableHead>Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSessions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center">No sessions found</TableCell>
                        </TableRow>
                      ) : (
                        filteredSessions.map((session) => (
                          <TableRow key={session.id}>
                            <TableCell>{session.mentorName}</TableCell>
                            <TableCell>{new Date(session.date).toLocaleDateString()}</TableCell>
                            <TableCell>{session.type}</TableCell>
                            <TableCell>{session.duration} mins</TableCell>
                            <TableCell>₹{session.ratePerHour}</TableCell>
                            <TableCell>₹{Math.round((session.ratePerHour / 60) * session.duration)}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payouts">
            <Card>
              <CardHeader>
                <CardTitle>Payout Management</CardTitle>
                <CardDescription>Generate and manage mentor payouts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 text-lg font-medium">Generate Receipts</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {mentors.map(mentor => (
                        <Card key={mentor.id} className="transition-all hover:shadow-md">
                          <CardHeader>
                            <CardTitle className="text-base">{mentor.name}</CardTitle>
                            <CardDescription>{mentor.email}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">
                              Sessions: {sessions.filter(s => s.mentorId === mentor.id).length}
                            </p>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setSelectedMentor(mentor)}
                            >
                              Details
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => generatePayoutReceipt(mentor.id)}
                            >
                              Generate Receipt
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="mb-4 text-lg font-medium">Recent Receipts</h3>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Mentor</TableHead>
                            <TableHead>Date Generated</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {receipts.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center">No receipts generated yet</TableCell>
                            </TableRow>
                          ) : (
                            receipts.map(receipt => (
                              <TableRow key={receipt.id}>
                                <TableCell>{receipt.mentorName}</TableCell>
                                <TableCell>{new Date(receipt.generatedDate).toLocaleDateString()}</TableCell>
                                <TableCell>₹{receipt.totalAmount}</TableCell>
                                <TableCell>{receipt.status}</TableCell>
                                <TableCell>
                                  <Button variant="outline" size="sm">View</Button>
                                  <Button variant="outline" size="sm" className="ml-2">Send</Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="communications">
            <Card>
              <CardHeader>
                <CardTitle>Communications</CardTitle>
                <CardDescription>Chat with mentors about their payouts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="col-span-1">
                    <div className="rounded-md border p-4">
                      <h3 className="mb-4 font-medium">Select Mentor</h3>
                      <ul className="space-y-2">
                        {mentors.map((mentor) => (
                          <li 
                            key={mentor.id}
                            onClick={() => setSelectedMentor(mentor)}
                            className={`cursor-pointer rounded-md p-2 hover:bg-gray-100 ${
                              selectedMentor?.id === mentor.id ? 'bg-gray-100' : ''
                            }`}
                          >
                            {mentor.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="col-span-2">
                    {selectedMentor ? (
                      <ChatPanel mentor={selectedMentor} />
                    ) : (
                      <div className="flex h-[400px] items-center justify-center rounded-md border">
                        <p className="text-gray-500">Select a mentor to start chatting</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Audit Logs</CardTitle>
                <CardDescription>Track all system actions and changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.map(log => (
                        <TableRow key={log.id}>
                          <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                          <TableCell>{log.action}</TableCell>
                          <TableCell>{log.user}</TableCell>
                          <TableCell>{log.details}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <SessionDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onAddSession={addSession}
        mentors={mentors}
      />
    </Layout>
  );
};

export default AdminDashboard;
