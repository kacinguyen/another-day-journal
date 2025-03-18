
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    // AuthContext will handle navigation to login
  };

  return (
    <div className="container py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            Manage your account information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
            <p className="text-lg font-medium">{user.email}</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Account ID</h3>
            <p className="text-sm font-mono text-muted-foreground break-all">{user.id}</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Account Created</h3>
            <p className="text-sm">
              {user.created_at ? new Date(user.created_at).toLocaleDateString() : "Not available"}
            </p>
          </div>
          
          <Button variant="destructive" onClick={handleSignOut} className="w-full">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
