import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Lock } from "lucide-react";

interface UserProfileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserProfile = ({ open, onOpenChange }: UserProfileProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [userType, setUserType] = useState<"student" | "professional">("professional");
  const [language, setLanguage] = useState("en");
  const [monthlyAmount, setMonthlyAmount] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user && open) {
      fetchProfile();
    }
  }, [user, open]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      toast.error("Failed to load profile");
      return;
    }

    if (data) {
      setFullName(data.full_name || "");
      setUserType(data.user_type || "professional");
      setLanguage(data.language || "en");
      setMonthlyAmount(data.monthly_amount?.toString() || "");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        user_type: userType,
        language: language,
        monthly_amount: parseFloat(monthlyAmount) || 0,
      })
      .eq("id", user.id);

    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated successfully!");
    }
    setLoading(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>
            Manage your account settings and preferences
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Full Name</Label>
                <Input
                  id="profile-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-email">Email</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label>Account Type</Label>
                <RadioGroup
                  value={userType}
                  onValueChange={(value: "student" | "professional") => setUserType(value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="profile-student" />
                    <Label htmlFor="profile-student" className="font-normal cursor-pointer">
                      Student
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="professional" id="profile-professional" />
                    <Label htmlFor="profile-professional" className="font-normal cursor-pointer">
                      Working Professional
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-language">Preferred Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="profile-language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-monthly">
                  {userType === "student" ? "Monthly Pocket Money" : "Monthly Income"}
                </Label>
                <Input
                  id="profile-monthly"
                  type="number"
                  value={monthlyAmount}
                  onChange={(e) => setMonthlyAmount(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Changing..." : "Change Password"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfile;
