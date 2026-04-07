import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Zap, Eye, BarChart3, Lock, Sparkles, CheckCircle2, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Eye,
    title: "Real-Time Monitoring",
    description: "Tracks typing speed, rhythm, and patterns as you write to build a behavioral fingerprint.",
  },
  {
    icon: Zap,
    title: "Instant Analysis",
    description: "Get immediate feedback on writing authenticity with a live-updating score gauge.",
  },
  {
    icon: BarChart3,
    title: "Deep Analytics",
    description: "Detailed breakdowns of WPM, pause patterns, and paste detection.",
  },
  {
    icon: Lock,
    title: "Paste Detection",
    description: "Identifies and highlights pasted content with exact timestamps and character counts.",
  },
  {
    icon: Sparkles,
    title: "Smart Scoring",
    description: "Rule-based scoring engine evaluates multiple behavioral signals for accurate results.",
  },
  {
    icon: Shield,
    title: "Export Reports",
    description: "Download professional PDF reports with complete session analytics and findings.",
  },
];

const Landing = () => {
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">Vi Notes</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDark(!dark)}
              className="flex items-center justify-center w-9 h-9 text-muted-foreground hover:text-foreground bg-secondary hover:bg-secondary/80 rounded-xl transition-all duration-200 active:scale-95"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Button variant="ghost" onClick={() => navigate("/editor")}>
              Open Editor
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI Writing Detection Made Simple
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Know if it's{" "}
            <span className="text-primary">human</span>
            <br />
            or machine-written
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Vi Notes analyzes typing behavior, rhythm patterns, and text characteristics in real time to determine content authenticity — no AI models required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate("/editor")} className="rounded-xl text-base px-8 h-12">
              Start Writing
            </Button>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="py-10 border-y border-border/50 bg-muted/30">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-muted-foreground">
          {["No AI models used", "100% client-side", "Real-time analysis", "PDF reports", "Dark mode"].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Powerful writing analysis
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Everything you need to verify content authenticity with confidence.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-6 rounded-2xl border border-border/50 bg-card/60 hover:bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center p-12 rounded-3xl bg-primary/5 border border-primary/10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Ready to detect AI writing?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">Open the editor and start analyzing content authenticity in seconds.</p>
          <Button size="lg" onClick={() => navigate("/editor")} className="rounded-xl text-base px-8 h-12">Go to Editor</Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span>Vi Notes</span>
          </div>
          <p>© {new Date().getFullYear()} Vi Notes. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
