
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="flex min-h-[80vh] flex-col items-center justify-center">
        <h1 className="mb-8 text-center text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
          Payout Automation System for EdTech Mentors
        </h1>
        <p className="mb-8 max-w-2xl text-center text-lg text-gray-600">
          Streamline mentor payments with our secure, flexible, and auditable platform. 
          Automate calculations, generate receipts, and improve communication.
        </p>
        
        <div className="mt-8 grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Admin Dashboard</CardTitle>
              <CardDescription>For EdTech Organizations</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span> Manage session data
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span> Automate payout calculations
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span> Generate & share receipts
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span> View audit logs
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => navigate("/admin")}
              >
                Access Admin Portal
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Mentor Dashboard</CardTitle>
              <CardDescription>For Instructors & Evaluators</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span> View session history
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span> Download receipts
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span> Track payment status
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span> Chat with admins
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant="secondary" 
                className="w-full" 
                onClick={() => navigate("/mentor")}
              >
                Access Mentor Portal
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
