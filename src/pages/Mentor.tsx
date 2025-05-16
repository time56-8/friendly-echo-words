
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
import { ChatPanel } from "@/components/ChatPanel";
import type { Session, Receipt } from "@/types";

// Mock data for the mentor view
const mentorData = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
};

const mockSessions: Session[] = [
  {
    id: "1",
    mentorId: "1",
    mentorName: "John Doe",
    date: "2023-05-15T10:00:00",
    type: "Live Session",
    duration: 60,
    ratePerHour: 4000,
  },
  {
    id: "2",
    mentorId: "1",
    mentorName: "John Doe",
    date: "2023-05-16T14:00:00",
    type: "Evaluation",
    duration: 30,
    ratePerHour: 3500,
  },
  {
    id: "3",
    mentorId: "1",
    mentorName: "John Doe",
    date: "2023-05-18T11:00:00",
    type: "Recording Review",
    duration: 45,
    ratePerHour: 3000,
  },
];

const mockReceipts: Receipt[] = [
  {
    id: "1",
    mentorId: "1",
    mentorName: "John Doe",
    generatedDate: "2023-05-20T15:30:00",
    totalAmount: 8750,
    status: "Paid",
    sessions: ["1", "2"],
  },
  {
    id: "2",
    mentorId: "1",
    mentorName: "John Doe",
    generatedDate: "2023-05-25T16:45:00",
    totalAmount: 2250,
    status: "Pending",
    sessions: ["3"],
  },
];

const MentorDashboard = () => {
  const [selectedDateRange, setSelectedDateRange] = useState<string>("30");

  const getFilteredSessions = () => {
    if (!selectedDateRange) return mockSessions;
    
    const now = new Date();
    const daysAgo = parseInt(selectedDateRange);
    const compareDate = new Date();
    compareDate.setDate(now.getDate() - daysAgo);
    
    return mockSessions.filter(session => new Date(session.date) >= compareDate);
  };

  const filteredSessions = getFilteredSessions();
  
  // Calculate total earnings
  const totalEarnings = mockReceipts.reduce((sum, receipt) => sum + receipt.totalAmount, 0);
  const pendingEarnings = mockReceipts
    .filter(r => r.status === "Pending")
    .reduce((sum, receipt) => sum + receipt.totalAmount, 0);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mentor Dashboard</h1>
            <p className="text-gray-500">Welcome back, {mentorData.name}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalEarnings.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Pending Payouts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{pendingEarnings.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockSessions.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sessions">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="receipts">Receipts</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
          </TabsList>

          <TabsContent value="sessions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Session History</CardTitle>
                <CardDescription>View all your past and upcoming sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <label htmlFor="mentor-date-filter" className="text-sm font-medium">Filter by date range:</label>
                  <select
                    id="mentor-date-filter"
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
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Session Type</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Rate (₹/hr)</TableHead>
                        <TableHead>Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell>{new Date(session.date).toLocaleDateString()}</TableCell>
                          <TableCell>{session.type}</TableCell>
                          <TableCell>{session.duration} mins</TableCell>
                          <TableCell>₹{session.ratePerHour}</TableCell>
                          <TableCell>₹{Math.round((session.ratePerHour / 60) * session.duration)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="receipts">
            <Card>
              <CardHeader>
                <CardTitle>Receipts & Payments</CardTitle>
                <CardDescription>View and download your payment receipts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockReceipts.map((receipt) => (
                        <TableRow key={receipt.id}>
                          <TableCell>{new Date(receipt.generatedDate).toLocaleDateString()}</TableCell>
                          <TableCell>₹{receipt.totalAmount}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                receipt.status === "Paid"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {receipt.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="outline" size="sm" className="ml-2">Download</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communication">
            <Card>
              <CardHeader>
                <CardTitle>Communication</CardTitle>
                <CardDescription>Chat with administrators about your payouts</CardDescription>
              </CardHeader>
              <CardContent>
                <ChatPanel mentor={mentorData} mentorView={true} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MentorDashboard;
