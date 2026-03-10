
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useCallback } from "react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Memoize nav items to avoid recreating on each render
  const navItems = useMemo(() => [
    { name: "Journal Log", path: "/" },
    { name: "Insights", path: "/insights" }
  ], []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
  }, [location.pathname]);

  const handleNavigation = useCallback((path: string) => {
    if (location.pathname !== path) {
      navigate(path);
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [location.pathname, navigate]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
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
      </div>
    </header>
  );
};

export default Navbar;
