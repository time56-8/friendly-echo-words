
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useRef } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: 'admin' | 'mentor';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, userRole } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const hasShownToast = useRef(false);
  
  useEffect(() => {
    if (!isAuthenticated && !hasShownToast.current) {
      toast({
        title: "Access denied",
        description: "Please sign in to view this page",
        variant: "destructive",
      });
      hasShownToast.current = true;
    } else if (isAuthenticated && userRole !== requiredRole && !hasShownToast.current) {
      toast({
        title: "Unauthorized",
        description: `You need ${requiredRole} privileges to access this page`,
        variant: "destructive",
      });
      hasShownToast.current = true;
    }
  }, [isAuthenticated, userRole, requiredRole, toast]);

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  
  if (userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
