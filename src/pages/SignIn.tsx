
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { FileCheck, User } from "lucide-react";

const SignIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("admin");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please provide both email and password",
        variant: "destructive",
      });
      return;
    }

    // This is a simplified authentication. In a real app, you would validate credentials against a backend
    if (userType === "admin") {
      // Mock admin authentication
      if (email === "admin@edpay.com" && password === "password") {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in as Admin",
        });
        navigate("/admin");
      } else {
        toast({
          title: "Authentication Failed",
          description: "Invalid admin credentials",
          variant: "destructive",
        });
      }
    } else {
      // Mock mentor authentication
      if (email.includes("mentor") && password === "password") {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in as Mentor",
        });
        navigate("/mentor");
      } else {
        toast({
          title: "Authentication Failed",
          description: "Invalid mentor credentials",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-8 w-8 text-primary"
              >
                <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 3 1.8 0 2.5-.8 3-2m0 0c-.4.9-.8 2-2 3-1.5 1.5-2 1-2.5.5m7.5-2.5c3.5 1.5 11 .3 11-5 0-1.8 0-3-2-3-1.8 0-2.5.8-3 2m0 0c.4-.9.8-2 2-3 1.5-1.5 2-1 2.5-.5" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Sign In to EdPay</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="admin" onValueChange={setUserType}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                Admin
              </TabsTrigger>
              <TabsTrigger value="mentor" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Mentor
              </TabsTrigger>
            </TabsList>
            <TabsContent value="admin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input 
                    id="admin-email" 
                    type="email" 
                    placeholder="admin@edpay.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="admin-password">Password</Label>
                    <a href="#" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <Input 
                    id="admin-password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">Sign In as Admin</Button>
              </form>
            </TabsContent>
            <TabsContent value="mentor">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mentor-email">Mentor Email</Label>
                  <Input 
                    id="mentor-email" 
                    type="email" 
                    placeholder="mentor@edpay.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="mentor-password">Password</Label>
                    <a href="#" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <Input 
                    id="mentor-password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">Sign In as Mentor</Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground mt-2">
            <span>For demo purposes, use:</span>
            <ul className="mt-2 space-y-1">
              <li><strong>Admin:</strong> admin@edpay.com / password</li>
              <li><strong>Mentor:</strong> mentor@edpay.com / password</li>
            </ul>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;
