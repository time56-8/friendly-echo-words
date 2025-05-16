
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ChevronRight, FileText, PieChart, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="relative">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/20 to-accent/20 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center">
              <Badge className="mb-4" variant="secondary">Payout Management Simplified</Badge>
              <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                Streamline EdTech <span className="text-primary">Mentor Payments</span>
              </h1>
              <p className="mb-8 max-w-2xl text-center text-lg text-gray-600 md:text-xl">
                Automate calculations, generate receipts, and improve communication with our secure, flexible, and auditable payout platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button 
                  size="lg"
                  onClick={() => navigate("/admin")}
                  className="w-full sm:w-auto"
                >
                  <Users className="mr-2 h-5 w-5" />
                  For Admins
                </Button>
                <Button 
                  size="lg"
                  variant="outline" 
                  onClick={() => navigate("/mentor")}
                  className="w-full sm:w-auto"
                >
                  <FileText className="mr-2 h-5 w-5" />
                  For Mentors
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features */}
        <section className="container mx-auto py-16 px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="relative overflow-hidden border-primary/20 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 bg-primary/10 w-16 h-16 rounded-bl-full"></div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  Smart Calculations
                </CardTitle>
                <CardDescription>
                  Automatic payout calculations with custom rate breakdowns and tax handling
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Custom hourly rates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Platform fee calculations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Tax deductions (GST)</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full group" onClick={() => navigate("/admin")}>
                  <span className="flex-1 text-left">Learn more</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="relative overflow-hidden border-primary/20 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 bg-primary/10 w-16 h-16 rounded-bl-full"></div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Receipt Generation
                </CardTitle>
                <CardDescription>
                  Create and share professionally structured receipts with mentors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Detailed breakdowns</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>One-click sharing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Downloadable formats</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full group" onClick={() => navigate("/admin")}>
                  <span className="flex-1 text-left">Learn more</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="relative overflow-hidden border-primary/20 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 bg-primary/10 w-16 h-16 rounded-bl-full"></div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Session Management
                </CardTitle>
                <CardDescription>
                  Track and organize all mentor sessions in one centralized system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>CSV importing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Historical data</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Filtering and sorting</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full group" onClick={() => navigate("/admin")}>
                  <span className="flex-1 text-left">Learn more</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-gradient-to-br from-primary/90 to-primary py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Streamline Your Mentor Payments?</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8 text-lg">
              Join hundreds of EdTech companies saving time and improving mentor satisfaction with our payment platform
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate("/admin")}
              >
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent text-white border-white hover:bg-white/10"
                onClick={() => navigate("/mentor")}
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
