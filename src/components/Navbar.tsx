
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    signOut
  } = useAuth();

  const navItems = [{
    name: "Journal Log",
    path: "/"
  }, {
    name: "Conversations",
    path: "/conversations"
  }];

  const handleSignOut = async () => {
    await signOut();
    // AuthContext will handle navigation to login
  };
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
  }, [location.pathname]);
  
  const handleNavigation = (path) => {
    if (location.pathname !== path) {
      navigate(path);
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/home" className="lowercase font-vibur text-2xl hover:text-primary transition-colors mr-8">
            another day
          </Link>
          
          <nav className="flex gap-6">
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === item.path ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <Link to="/profile">
              <Button variant="outline" size="sm">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Log in
              </Link>
              <Link to="/signup">
                <Button size="sm">
                  Get started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>;
};

export default Navbar;
