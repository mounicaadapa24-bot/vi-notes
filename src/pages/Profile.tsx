import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Shield,
  User,
  Mail,
  CalendarDays,
  BadgeCheck,
  Save,
  LogOut,
  Camera,
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const email = user?.email ?? "Unknown";
  const initials = useMemo(() => {
    const safeEmail = email?.trim() || "U";
    return safeEmail.slice(0, 2).toUpperCase();
  }, [email]);

  const joinedAt = useMemo(() => {
    if (!user?.created_at) return "Unknown";
    return new Date(user.created_at).toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [user?.created_at]);

  const saveProfile = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 350));
    setLoading(false);
    toast.success("Profile preferences saved");
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border/50 bg-card/60 backdrop-blur-lg">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/editor")}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-muted-foreground transition-all duration-200 hover:bg-secondary/80 hover:text-foreground active:scale-95"
              aria-label="Back to editor"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-4.5 w-4.5 text-primary-foreground" />
              </div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">Profile</h1>
            </div>
          </div>
          <Button variant="secondary" className="rounded-xl" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-3">
        <section className="glass-card rounded-2xl p-6 lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">
                {initials}
              </div>
              <button
                className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Change avatar"
                type="button"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <h2 className="text-xl font-semibold text-foreground">{fullName || "VI Notes User"}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{email}</p>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 p-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-foreground">{email}</p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 p-3">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-foreground">Joined {joinedAt}</p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 p-3">
              <BadgeCheck className="h-4 w-4 text-success" />
              <p className="text-sm text-foreground">Account status: Active</p>
            </div>
          </div>
        </section>

        <section className="glass-card rounded-2xl p-6 lg:col-span-2">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
            <p className="text-sm text-muted-foreground">Manage your account profile details.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" value={email} disabled className="h-11 rounded-xl opacity-80" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us a little about yourself..."
                className="min-h-28 rounded-xl"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-4">
            <div className="flex items-start gap-2">
              <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Profile visibility</p>
                <p className="text-xs text-muted-foreground">Your profile is private to your account.</p>
              </div>
            </div>
            <Button onClick={saveProfile} disabled={loading} className="rounded-xl">
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;
