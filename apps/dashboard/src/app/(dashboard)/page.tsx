import Link from "next/link";
import { Layers, History, Plus, Film, Sparkles } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted mt-1">
          Erstelle professionelle Videos mit wenigen Klicks.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">0</p>
              <p className="text-sm text-muted">Blueprints</p>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Film className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">0</p>
              <p className="text-sm text-muted">Videos erstellt</p>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">5</p>
              <p className="text-sm text-muted">Templates verfügbar</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Schnellstart
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/blueprints/new"
            className="group bg-surface border border-border rounded-xl p-6 hover:border-primary/50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Neuen Blueprint erstellen
                </h3>
                <p className="text-sm text-muted">
                  Wähle ein Template und konfiguriere dein Video
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/history"
            className="group bg-surface border border-border rounded-xl p-6 hover:border-accent/50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center transition-colors">
                <History className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Video-Historie
                </h3>
                <p className="text-sm text-muted">
                  Alle erstellten Videos einsehen und herunterladen
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Available Templates */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Verfügbare Templates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              name: "Text Reveal",
              category: "B-Roll",
              description: "Animierter Text-Einflug mit Blitzeffekt",
              color: "primary",
            },
            {
              name: "Word Slam",
              category: "B-Roll",
              description: "Ein Wort knallt bold rein",
              color: "accent",
            },
            {
              name: "Intro Sequence",
              category: "Intro",
              description: "Titel + Untertitel mit Übergängen",
              color: "primary",
            },
            {
              name: "Outro Sequence",
              category: "Outro",
              description: "CTA + Branding mit Fade-Out",
              color: "accent",
            },
            {
              name: "Social Hook",
              category: "Social",
              description: "Kurzer Clip für Social Media",
              color: "primary",
            },
          ].map((template) => (
            <div
              key={template.name}
              className="bg-surface border border-border rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    template.color === "primary"
                      ? "bg-primary/10 text-primary"
                      : "bg-accent/10 text-accent"
                  }`}
                >
                  {template.category}
                </span>
              </div>
              <h3 className="font-semibold text-foreground mb-1">
                {template.name}
              </h3>
              <p className="text-sm text-muted">{template.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
