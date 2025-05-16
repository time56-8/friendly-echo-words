
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Calendar,
  ChevronRight,
  Home,
  MessageSquare,
  FileText,
  User,
  CreditCard,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigationItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/admin", label: "Admin", icon: FileText },
    { path: "/mentor", label: "Mentor", icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = () => {
    toast({
      title: "Signed out successfully",
      description: "You have been signed out of your account",
    });
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="sticky top-0 z-30 border-b bg-white dark:bg-gray-950 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden" 
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 sm:w-80 p-0">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b">
                    <Link to="/" className="text-xl font-bold text-primary">
                      EdPay
                    </Link>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetClose>
                  </div>
                  <nav className="flex-1 p-4 space-y-2">
                    {navigationItems.map((item) => (
                      <SheetClose asChild key={item.path}>
                        <Link
                          to={item.path}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                            isActive(item.path)
                              ? "bg-accent text-foreground font-medium"
                              : "text-muted-foreground"
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                          {isActive(item.path) && (
                            <ChevronRight className="ml-auto h-4 w-4" />
                          )}
                        </Link>
                      </SheetClose>
                    ))}
                    <div className="pt-4 mt-4 border-t">
                      <SheetClose asChild>
                        <Link
                          to="/signin"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent text-muted-foreground"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </Link>
                      </SheetClose>
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <Link to="/" className="text-2xl font-bold text-primary flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-6 w-6 mr-2"
              >
                <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 3 1.8 0 2.5-.8 3-2m0 0c-.4.9-.8 2-2 3-1.5 1.5-2 1-2.5.5m7.5-2.5c3.5 1.5 11 .3 11-5 0-1.8 0-3-2-3-1.8 0-2.5.8-3 2m0 0c.4-.9.8-2 2-3 1.5-1.5 2-1 2.5-.5" />
              </svg>
              EdPay
            </Link>
          </div>

          <NavigationMenu className="hidden md:block">
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.path}>
                  <Link 
                    to={item.path} 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      isActive(item.path) && "bg-accent text-accent-foreground font-medium"
                    )}
                  >
                    {item.label}
                  </Link>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                <Link 
                  to="/signin" 
                  className={cn(
                    navigationMenuTriggerStyle(),
                    isActive("/signin") && "bg-accent text-accent-foreground font-medium"
                  )}
                >
                  Sign In
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="relative h-10 w-10 rounded-full border-2 border-primary/20">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">User</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    user@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Calendar</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Messages</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        {children}
      </main>
      
      <footer className="border-t bg-white dark:bg-gray-950 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} EdPay. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  );
};

export default Layout;
