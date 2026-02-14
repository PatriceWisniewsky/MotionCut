"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Copy, Trash2, Film } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { compositionRegistry, type CompositionId } from "@motioncut/video-types";

interface BlueprintWithType {
  id: string;
  user_id: string;
  composition_type_id: string;
  name: string;
  params: Record<string, unknown>;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  composition_types: {
    name: string;
    display_name: string;
    category: string;
  } | null;
}

const categoryColors: Record<string, string> = {
  intro: "bg-primary/10 text-primary",
  outro: "bg-accent/10 text-accent",
  broll: "bg-success/10 text-success",
  motion: "bg-warning/10 text-warning",
  social: "bg-primary/10 text-primary",
};

export default function BlueprintsPage() {
  const [blueprints, setBlueprints] = useState<BlueprintWithType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlueprints();
  }, []);

  async function loadBlueprints() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blueprints")
      .select("*, composition_types(name, display_name, category)")
      .order("updated_at", { ascending: false });

    if (!error && data) {
      setBlueprints(data);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Blueprint wirklich löschen?")) return;
    const supabase = createClient();
    await supabase.from("blueprints").delete().eq("id", id);
    setBlueprints((prev) => prev.filter((b) => b.id !== id));
  }

  async function handleDuplicate(blueprint: BlueprintWithType) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blueprints")
      .insert({
        user_id: blueprint.user_id,
        composition_type_id: blueprint.composition_type_id,
        name: `${blueprint.name} (Kopie)`,
        params: blueprint.params,
        is_public: false,
      })
      .select("*, composition_types(name, display_name, category)")
      .single();

    if (!error && data) {
      setBlueprints((prev) => [data, ...prev]);
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blueprints</h1>
          <p className="text-sm text-muted mt-1">
            Deine gespeicherten Video-Konfigurationen
          </p>
        </div>
        <Link
          href="/blueprints/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Neuer Blueprint
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-xl p-6 animate-pulse"
            >
              <div className="h-4 bg-border rounded w-1/3 mb-4" />
              <div className="h-6 bg-border rounded w-2/3 mb-2" />
              <div className="h-4 bg-border rounded w-full" />
            </div>
          ))}
        </div>
      ) : blueprints.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-12 text-center">
          <Film className="w-12 h-12 text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Keine Blueprints vorhanden
          </h3>
          <p className="text-muted mb-6">
            Erstelle deinen ersten Blueprint, um Videos zu generieren.
          </p>
          <Link
            href="/blueprints/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ersten Blueprint erstellen
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {blueprints.map((blueprint) => {
            const category = blueprint.composition_types?.category || "broll";
            const templateName =
              blueprint.composition_types?.display_name || "Template";

            return (
              <div
                key={blueprint.id}
                className="bg-surface border border-border rounded-xl p-5 group hover:border-primary/30 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      categoryColors[category] || "bg-muted/10 text-muted"
                    }`}
                  >
                    {category.toUpperCase()}
                  </span>
                  <span className="text-xs text-muted">
                    {new Date(blueprint.updated_at).toLocaleDateString("de-DE")}
                  </span>
                </div>

                <h3 className="font-semibold text-foreground mb-1 truncate">
                  {blueprint.name}
                </h3>
                <p className="text-xs text-muted mb-4">{templateName}</p>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/blueprints/${blueprint.id}`}
                    className="flex items-center gap-1 px-3 py-1.5 bg-surface-hover border border-border rounded-lg text-xs text-foreground hover:border-primary/30 transition-colors"
                  >
                    <Pencil className="w-3 h-3" />
                    Bearbeiten
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDuplicate(blueprint)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-surface-hover border border-border rounded-lg text-xs text-foreground hover:border-accent/30 transition-colors"
                    title="Duplizieren"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(blueprint.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-surface-hover border border-border rounded-lg text-xs text-error hover:border-error/30 transition-colors"
                    title="Löschen"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
