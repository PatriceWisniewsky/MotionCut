"use client";

import React, { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  compositionRegistry,
  type CompositionId,
} from "@motioncut/video-types";
import { ParameterEditor } from "@/components/parameter-editor";
import { VideoPreview } from "@/components/video-preview";
import { createClient } from "@/lib/supabase/client";

export default function EditBlueprintPage({
  params: routeParams,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(routeParams);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [blueprintName, setBlueprintName] = useState("");
  const [compositionId, setCompositionId] = useState<CompositionId | null>(
    null
  );
  const [params, setParams] = useState<Record<string, unknown>>({});

  useEffect(() => {
    loadBlueprint();
  }, [id]);

  async function loadBlueprint() {
    const supabase = createClient();

    const { data: blueprint, error } = await supabase
      .from("blueprints")
      .select("*, composition_types(name)")
      .eq("id", id)
      .single();

    if (error || !blueprint) {
      router.push("/blueprints");
      return;
    }

    setBlueprintName(blueprint.name);
    const typeName = (blueprint.composition_types as any)?.name as CompositionId;
    setCompositionId(typeName);
    setParams(blueprint.params as Record<string, unknown>);
    setLoading(false);
  }

  const handleParamChange = useCallback((key: string, value: unknown) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("blueprints")
        .update({
          name: blueprintName,
          params,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
      router.push("/blueprints");
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
      alert("Fehler beim Aktualisieren des Blueprints.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Blueprint wirklich löschen?")) return;
    const supabase = createClient();
    await supabase.from("blueprints").delete().eq("id", id);
    router.push("/blueprints");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto animate-pulse">
        <div className="h-8 bg-border rounded w-1/4 mb-4" />
        <div className="h-4 bg-border rounded w-1/3 mb-8" />
        <div className="grid grid-cols-2 gap-8">
          <div className="h-96 bg-border rounded-xl" />
          <div className="h-96 bg-border rounded-xl" />
        </div>
      </div>
    );
  }

  if (!compositionId) return null;

  const currentTemplate = compositionRegistry[compositionId];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/blueprints"
            className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center hover:bg-surface-hover transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-muted" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Blueprint bearbeiten
            </h1>
            <p className="text-sm text-muted">
              {currentTemplate.displayName} · {currentTemplate.category}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          className="flex items-center gap-2 px-3 py-2 text-error hover:bg-error/10 rounded-lg text-sm transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Löschen
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Parameters */}
        <div>
          <div className="bg-surface border border-border rounded-xl p-6">
            {/* Blueprint Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Blueprint Name
              </label>
              <input
                type="text"
                value={blueprintName}
                onChange={(e) => setBlueprintName(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>

            {/* Dynamic Parameter Form */}
            <ParameterEditor
              schema={currentTemplate.schema}
              values={params}
              onChange={handleParamChange}
            />

            {/* Save Button */}
            <div className="mt-8">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !blueprintName.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                {saving ? "Speichern..." : "Änderungen speichern"}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div>
          <div className="sticky top-8">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-4 h-4 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Live-Vorschau
              </h2>
            </div>
            <VideoPreview
              compositionId={compositionId}
              inputProps={params}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
