
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Download, FileCheck, FileText, MessageSquare, PieChart, Check, X } from "lucide-react";
import { formatCurrency, formatDate, calculateDuration } from "@/lib/utils";
import { calculatePayout } from "@/lib/payout-calculator";
import type { Session, Receipt } from "@/types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Session status type
type SessionStatus = 'upcoming' | 'completed' | 'cancelled';

// Extended Session type with status
interface MentorSession extends Session {
  status?: SessionStatus;
  notes?: string;
}

const MentorDashboard = () => {
  const { toast } = useToast();
  
  // In a real application, this would come from an API
  const [mentor, setMentor] = useState({
    id: "mentor-1",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    profileImage: "",
    sessions: [
      {
        id: "session-1",
        mentorId: "mentor-1",
        mentorName: "Jane Doe",
        date: new Date(2025, 4, 10).toISOString(),
        type: "Live Session",
        duration: 60,
        ratePerHour: 4000,
        status: "upcoming",
        notes: "",
      },
      {
        id: "session-2",
        mentorId: "mentor-1",
        mentorName: "Jane Doe",
        date: new Date(2025, 4, 12).toISOString(),
        type: "Evaluation",
        duration: 30,
        ratePerHour: 4000,
        status: "upcoming",
        notes: "",
      },
      {
        id: "session-3",
        mentorId: "mentor-1",
        mentorName: "Jane Doe",
        date: new Date(2025, 4, 15).toISOString(),
        type: "Live Session",
        duration: 90,
        ratePerHour: 4000,
        status: "completed",
        notes: "Student performed well. Ready for advanced topics.",
      },
    ] as MentorSession[],
    receipts: [
      {
        id: "receipt-1",
        mentorId: "mentor-1",
        mentorName: "Jane Doe",
        generatedDate: new Date(2025, 4, 16).toISOString(),
        totalAmount: 10000,
        status: "Paid",
        sessions: ["session-1", "session-2", "session-3"],
      },
    ] as Receipt[],
  });

  const [sessionNotes, setSessionNotes] = useState("");
  const [activeSession, setActiveSession] = useState<string | null>(null);

  // Calculate total earnings and sessions stats
  const totalEarnings = calculatePayout(mentor.sessions);
  const pendingAmount = mentor.receipts
    .filter((r) => r.status === "Pending")
    .reduce((sum, r) => sum + r.totalAmount, 0);
  const paidAmount = mentor.receipts
    .filter((r) => r.status === "Paid")
    .reduce((sum, r) => sum + r.totalAmount, 0);
  
  const upcomingSessions = mentor.sessions.filter(s => s.status === 'upcoming').length;
  const completedSessions = mentor.sessions.filter(s => s.status === 'completed').length;
  const cancelledSessions = mentor.sessions.filter(s => s.status === 'cancelled').length;

  // Update session status
  const updateSessionStatus = (sessionId: string, status: SessionStatus) => {
    const updatedSessions = mentor.sessions.map(session =>
      session.id === sessionId ? { ...session, status } : session
    );
    
    setMentor({
      ...mentor,
      sessions: updatedSessions,
    });
    
    toast({
      title: "Session updated",
      description: `Session marked as ${status}`,
    });
  };

  // Save session notes
  const saveSessionNotes = (sessionId: string) => {
    if (!sessionNotes.trim()) return;
    
    const updatedSessions = mentor.sessions.map(session =>
      session.id === sessionId ? { ...session, notes: sessionNotes } : session
    );
    
    setMentor({
      ...mentor,
      sessions: updatedSessions,
    });
    
    setSessionNotes("");
    setActiveSession(null);
    
    toast({
      title: "Notes saved",
      description: "Session notes have been updated",
    });
  };

  // Chart data
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - i);
    
    return {
      name: month.toLocaleDateString('en-US', { month: 'short' }),
      earnings: 5000 + Math.floor(Math.random() * 5000), // Dummy data
      sessions: 5 + Math.floor(Math.random() * 10), // Dummy data
    };
  }).reverse();

  // Function to get badge color based on status
  const getStatusBadgeClass = (status?: SessionStatus) => {
    switch (status) {
      case 'completed':
        return "bg-green-500";
      case 'upcoming':
        return "bg-blue-500";
      case 'cancelled':
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Layout>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={mentor.profileImage} alt={mentor.name} />
              <AvatarFallback>{mentor.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{mentor.name}</h1>
              <p className="text-muted-foreground">{mentor.email}</p>
            </div>
          </div>
          <Button>
            <MessageSquare className="mr-2 h-4 w-4" />
            Contact Admin
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mentor.sessions.length}</div>
              <p className="text-xs text-muted-foreground">
                {calculateDuration(mentor.sessions.reduce((sum, s) => sum + s.duration, 0))} total
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalEarnings)}</div>
              <p className="text-xs text-muted-foreground">
                After platform fees and taxes
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(pendingAmount)}</div>
              <p className="text-xs text-muted-foreground">
                From {mentor.receipts.filter(r => r.status === "Pending").length} receipts
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(paidAmount)}</div>
              <p className="text-xs text-muted-foreground">
                From {mentor.receipts.filter(r => r.status === "Paid").length} receipts
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Earnings Overview</CardTitle>
            <CardDescription>Your earnings and sessions over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value, name) => 
                  name === "earnings" ? formatCurrency(value as number) : value
                } />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="earnings" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                  name="Earnings"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="sessions" 
                  stroke="#82ca9d"
                  name="Sessions" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Tabs defaultValue="sessions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="sessions">Upcoming Sessions</TabsTrigger>
            <TabsTrigger value="completed">Completed Sessions</TabsTrigger>
            <TabsTrigger value="receipts">Receipts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>Your Upcoming Sessions</CardTitle>
                <CardDescription>
                  View and manage your upcoming mentoring sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="border-b [&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Duration</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Rate</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Amount</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {mentor.sessions
                          .filter(session => session.status === 'upcoming')
                          .map((session) => (
                            <tr key={session.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                              <td className="p-4 align-middle">{formatDate(session.date)}</td>
                              <td className="p-4 align-middle">{session.type}</td>
                              <td className="p-4 align-middle">{calculateDuration(session.duration)}</td>
                              <td className="p-4 align-middle">{formatCurrency(session.ratePerHour)}/hr</td>
                              <td className="p-4 align-middle">
                                {formatCurrency((session.ratePerHour / 60) * session.duration)}
                              </td>
                              <td className="p-4 align-middle">
                                <Badge className={getStatusBadgeClass(session.status)}>{session.status}</Badge>
                              </td>
                              <td className="p-4 align-middle">
                                <div className="flex items-center gap-2">
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        <Check className="h-4 w-4 mr-1" />
                                        Complete
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Mark session as completed?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This will mark the session as completed and allow you to add notes about the session.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <div className="mb-4">
                                        <textarea 
                                          className="w-full h-24 p-2 border rounded"
                                          placeholder="Add session notes (optional)"
                                          value={sessionNotes}
                                          onChange={(e) => setSessionNotes(e.target.value)}
                                        />
                                      </div>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel onClick={() => setSessionNotes("")}>Cancel</AlertDialogCancel>
                                        <AlertDialogAction 
                                          onClick={() => {
                                            updateSessionStatus(session.id, 'completed');
                                            if (sessionNotes) {
                                              saveSessionNotes(session.id);
                                            }
                                          }}
                                        >
                                          Complete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                  
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="outline" size="sm" className="bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600">
                                        <X className="h-4 w-4 mr-1" />
                                        Cancel
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Cancel this session?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This action cannot be undone. The session will be marked as cancelled.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Keep Session</AlertDialogCancel>
                                        <AlertDialogAction 
                                          className="bg-red-500 hover:bg-red-600"
                                          onClick={() => updateSessionStatus(session.id, 'cancelled')}
                                        >
                                          Cancel Session
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Sessions</CardTitle>
                <CardDescription>
                  Review your completed and cancelled sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="border-b [&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Duration</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Amount</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {mentor.sessions
                          .filter(session => session.status === 'completed' || session.status === 'cancelled')
                          .map((session) => (
                            <tr key={session.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                              <td className="p-4 align-middle">{formatDate(session.date)}</td>
                              <td className="p-4 align-middle">{session.type}</td>
                              <td className="p-4 align-middle">{calculateDuration(session.duration)}</td>
                              <td className="p-4 align-middle">
                                {formatCurrency((session.ratePerHour / 60) * session.duration)}
                              </td>
                              <td className="p-4 align-middle">
                                <Badge className={getStatusBadgeClass(session.status)}>
                                  {session.status}
                                </Badge>
                              </td>
                              <td className="p-4 align-middle">
                                {session.notes ? (
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button variant="outline" size="sm">View Notes</Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                      <div className="space-y-2">
                                        <h4 className="font-medium">Session Notes</h4>
                                        <p className="text-sm">{session.notes}</p>
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                ) : (
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      setActiveSession(session.id);
                                      setSessionNotes(session.notes || "");
                                    }}
                                  >
                                    Add Notes
                                  </Button>
                                )}
                                
                                {activeSession === session.id && (
                                  <AlertDialog open={true} onOpenChange={() => setActiveSession(null)}>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Add Session Notes</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Add notes about this completed session.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <div className="mb-4">
                                        <textarea 
                                          className="w-full h-24 p-2 border rounded"
                                          placeholder="Session notes"
                                          value={sessionNotes}
                                          onChange={(e) => setSessionNotes(e.target.value)}
                                        />
                                      </div>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel onClick={() => {
                                          setActiveSession(null);
                                          setSessionNotes("");
                                        }}>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction onClick={() => saveSessionNotes(session.id)}>
                                          Save Notes
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="receipts">
            <Card>
              <CardHeader>
                <CardTitle>Your Receipts</CardTitle>
                <CardDescription>
                  All payment receipts for your sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mentor.receipts.map((receipt) => (
                    <Card key={receipt.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Receipt #{receipt.id.substring(0, 8)}</CardTitle>
                          <Badge className={
                            receipt.status === "Paid" 
                              ? "bg-green-500" 
                              : receipt.status === "Pending" 
                                ? "bg-yellow-500" 
                                : "bg-red-500"
                          }>
                            {receipt.status}
                          </Badge>
                        </div>
                        <CardDescription>
                          Generated on {formatDate(receipt.generatedDate)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {receipt.sessions.length} sessions included
                            </p>
                            <p className="font-semibold text-xl mt-1">
                              {formatCurrency(receipt.totalAmount)}
                            </p>
                          </div>
                          <Button variant="outline" className="flex items-center gap-2">
                            <Download className="h-4 w-4" /> Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MentorDashboard;
