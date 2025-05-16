
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: 'admin' | 'mentor';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, userRole } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  if (!isAuthenticated) {
    toast({
      title: "Access denied",
      description: "Please sign in to view this page",
      variant: "destructive",
    });
    
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  
  if (userRole !== requiredRole) {
    toast({
      title: "Unauthorized",
      description: `You need ${requiredRole} privileges to access this page`,
      variant: "destructive",
    });
    
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
