import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell
} from "recharts";
import { Calendar, ChevronDown, Download, FileText, Filter, MessageSquare, Plus, Upload, Users } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { parseCSV } from "@/lib/csv-parser";
import { formatCurrency, formatDate, calculateDuration } from "@/lib/utils";
import { calculatePayout } from "@/lib/payout-calculator";
import { generateReceipt } from "@/lib/receipt-generator";
import type { Session, Mentor } from "@/types";

const AdminDashboard = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<string>("last30");
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        const parsedSessions = parseCSV(content);
        setSessions(prevSessions => [...prevSessions, ...parsedSessions]);
        toast({
          title: "Sessions imported",
          description: `Successfully imported ${parsedSessions.length} sessions`,
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Import failed",
          description: "There was an error parsing the CSV file",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleAddSession = () => {
    // This would open a modal to add a session manually
    toast({
      title: "Add session",
      description: "Session creation form will appear here",
    });
  };

  const handleGenerateReceipt = () => {
    if (!selectedMentorId) {
      toast({
        title: "No mentor selected",
        description: "Please select a mentor to generate a receipt",
        variant: "destructive",
      });
      return;
    }

    const mentorSessions = sessions.filter(s => s.mentorId === selectedMentorId);
    if (mentorSessions.length === 0) {
      toast({
        title: "No sessions found",
        description: "This mentor has no sessions to generate a receipt for",
        variant: "destructive",
      });
      return;
    }

    const mentor = {
      id: selectedMentorId,
      name: mentorSessions[0]?.mentorName || "Unknown Mentor",
    };

    const receipt = generateReceipt(mentor, mentorSessions);
    
    toast({
      title: "Receipt generated",
      description: `Receipt #${receipt.id.substring(0, 8)} has been created`,
      variant: "default",
    });
  };

  const addMentor = () => {
    const newMentor: Mentor = {
      id: `mentor-${mentors.length + 1}`,
      name: `New Mentor ${mentors.length + 1}`,
      email: `mentor${mentors.length + 1}@example.com`, // Add email to fix type error
    };
    
    setMentors((prev) => [...prev, newMentor]);
  };

  // Filter sessions based on date range
  const getFilteredSessions = () => {
    const now = new Date();
    const filterDate = new Date();
    
    switch (dateRange) {
      case "last7":
        filterDate.setDate(now.getDate() - 7);
        break;
      case "last15":
        filterDate.setDate(now.getDate() - 15);
        break;
      case "last30":
        filterDate.setDate(now.getDate() - 30);
        break;
      default:
        filterDate.setDate(now.getDate() - 30);
    }

    return sessions.filter(session => new Date(session.date) >= filterDate);
  };

  const filteredSessions = getFilteredSessions();
  
  // Group sessions by mentor
  const mentorGroups = filteredSessions.reduce((groups, session) => {
    if (!groups[session.mentorId]) {
      groups[session.mentorId] = {
        mentorId: session.mentorId,
        mentorName: session.mentorName,
        sessions: [],
        totalAmount: 0,
      };
    }
    
    groups[session.mentorId].sessions.push(session);
    groups[session.mentorId].totalAmount += (session.ratePerHour / 60) * session.duration;
    
    return groups;
  }, {} as Record<string, {
    mentorId: string;
    mentorName: string;
    sessions: Session[];
    totalAmount: number;
  }>);
  
  const mentors = Object.values(mentorGroups);

  // Data for charts
  const mentorChartData = mentors.map(mentor => ({
    name: mentor.mentorName,
    amount: mentor.totalAmount,
  }));
  
  const sessionTypeData = filteredSessions.reduce((types, session) => {
    if (!types[session.type]) {
      types[session.type] = 0;
    }
    types[session.type]++;
    return types;
  }, {} as Record<string, number>);
  
  const sessionTypeChartData = Object.entries(sessionTypeData).map(([name, value]) => ({ name, value }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

  return (
    <Layout>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage mentor sessions and payouts in one place
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleAddSession}>
              <Plus className="mr-2 h-4 w-4" />
              Add Session
            </Button>
            
            <Button variant="outline" asChild>
              <label>
                <Upload className="mr-2 h-4 w-4" />
                Import CSV
                <input 
                  type="file" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept=".csv" 
                />
              </label>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setDateRange("last7")}>
                  Last 7 Days
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange("last15")}>
                  Last 15 Days
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange("last30")}>
                  Last 30 Days
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredSessions.length}</div>
              <p className="text-xs text-muted-foreground">
                For {dateRange === "last7" ? "past week" : dateRange === "last15" ? "past 15 days" : "past month"}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payout</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(mentors.reduce((sum, mentor) => sum + calculatePayout(mentor.sessions), 0))}
              </div>
              <p className="text-xs text-muted-foreground">
                After platform fees and taxes
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Mentors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mentors.length}</div>
              <p className="text-xs text-muted-foreground">
                With recent sessions
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Receipts</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mentors.length}</div>
              <p className="text-xs text-muted-foreground">
                Ready to be generated
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="mentors" className="space-y-4">
          <TabsList>
            <TabsTrigger value="mentors">Mentors</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mentors" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mentors.map(mentor => (
                <Card 
                  key={mentor.mentorId} 
                  className={selectedMentorId === mentor.mentorId ? "border-primary" : ""}
                >
                  <CardHeader>
                    <CardTitle>{mentor.mentorName}</CardTitle>
                    <CardDescription>
                      {mentor.sessions.length} sessions, {calculateDuration(mentor.sessions.reduce((total, s) => total + s.duration, 0))}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Base Amount:</span>
                        <span>{formatCurrency(mentor.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Platform Fee (5%):</span>
                        <span>-{formatCurrency(mentor.totalAmount * 0.05)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">GST (18%):</span>
                        <span>-{formatCurrency(mentor.totalAmount * 0.18)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-bold">
                        <span>Payout Amount:</span>
                        <span>{formatCurrency(calculatePayout(mentor.sessions))}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedMentorId(mentor.mentorId)}
                    >
                      Select
                    </Button>
                    <Button 
                      onClick={handleGenerateReceipt}
                      disabled={selectedMentorId !== mentor.mentorId}
                    >
                      Generate Receipt
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
                <CardDescription>
                  Showing {filteredSessions.length} sessions for the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="border-b [&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Mentor</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Duration</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Rate (₹/hr)</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {filteredSessions.map((session) => (
                          <tr key={session.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className="p-4 align-middle">{formatDate(session.date)}</td>
                            <td className="p-4 align-middle">{session.mentorName}</td>
                            <td className="p-4 align-middle">{session.type}</td>
                            <td className="p-4 align-middle">{calculateDuration(session.duration)}</td>
                            <td className="p-4 align-middle">{formatCurrency(session.ratePerHour)}</td>
                            <td className="p-4 align-middle">
                              {formatCurrency((session.ratePerHour / 60) * session.duration)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="ml-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Payout Distribution by Mentor</CardTitle>
                  <CardDescription>
                    Breakdown of payouts per mentor for the selected period
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={mentorChartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Bar dataKey="amount" fill="#8884d8" name="Payout Amount" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Sessions by Type</CardTitle>
                  <CardDescription>
                    Distribution of sessions by type
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sessionTypeChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {sessionTypeChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
