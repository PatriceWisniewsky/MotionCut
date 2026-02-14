"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  History,
  Film,
  Plus,
  Wifi,
  WifiOff,
} from "lucide-react";
import { isLocalMode } from "@/lib/local-store";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/blueprints", label: "Blueprints", icon: Layers },
  { href: "/history", label: "Historie", icon: History },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const localMode = isLocalMode();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-border flex flex-col shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Film className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">
              MotionCut
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted hover:text-foreground hover:bg-surface-hover"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Quick Action */}
        <div className="p-4 space-y-3 border-t border-border">
          <Link
            href="/blueprints/new"
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Neuer Blueprint
          </Link>

          {/* Mode Indicator */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background">
            {localMode ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs text-accent font-medium">
                  Lokaler Modus
                </span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-success" />
                <span className="text-xs text-success font-medium">
                  Online
                </span>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Local Mode Banner */}
        {localMode && (
          <div className="bg-accent/10 border-b border-accent/20 px-4 py-2 text-center">
            <span className="text-xs text-accent">
              Lokaler Modus aktiv — Daten werden im Browser gespeichert. Verbinde Supabase für Online-Persistenz.
            </span>
          </div>
        )}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
