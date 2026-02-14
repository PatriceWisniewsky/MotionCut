"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye } from "lucide-react";
import Link from "next/link";
import {
  compositionRegistry,
  type CompositionId,
} from "@motioncut/video-types";
import { TemplateSelector } from "@/components/template-selector";
import { ParameterEditor } from "@/components/parameter-editor";
import { VideoPreview } from "@/components/video-preview";
import { createClient } from "@/lib/supabase/client";

export default function NewBlueprintPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedTemplate, setSelectedTemplate] =
    useState<CompositionId | null>(null);
  const [blueprintName, setBlueprintName] = useState("");
  const [params, setParams] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);

  const handleTemplateSelect = useCallback((id: CompositionId) => {
    setSelectedTemplate(id);
    const template = compositionRegistry[id];
    setParams({ ...template.defaults });
    setBlueprintName(`${template.displayName} - Neu`);
    setStep(2);
  }, []);

  const handleParamChange = useCallback((key: string, value: unknown) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = async () => {
    if (!selectedTemplate) return;
    setSaving(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Bitte melde dich an, um Blueprints zu speichern.");
        return;
      }

      // Get or create composition type
      const template = compositionRegistry[selectedTemplate];

      const { data: existingType } = await supabase
        .from("composition_types")
        .select("id")
        .eq("name", selectedTemplate)
        .single();

      let compositionTypeId = existingType?.id;

      if (!compositionTypeId) {
        const { data: newType } = await supabase
          .from("composition_types")
          .insert({
            name: selectedTemplate,
            display_name: template.displayName,
            description: template.description,
            category: template.category,
            default_props: template.defaults,
            schema_version: 1,
          })
          .select("id")
          .single();
        compositionTypeId = newType?.id;
      }

      // Save blueprint
      const { error } = await supabase.from("blueprints").insert({
        user_id: user.id,
        composition_type_id: compositionTypeId,
        name: blueprintName,
        params,
        is_public: false,
      });

      if (error) throw error;

      router.push("/blueprints");
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
      alert("Fehler beim Speichern des Blueprints.");
    } finally {
      setSaving(false);
    }
  };

  const currentTemplate = selectedTemplate
    ? compositionRegistry[selectedTemplate]
    : null;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/blueprints"
          className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center hover:bg-surface-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-muted" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Neuer Blueprint
          </h1>
          <p className="text-sm text-muted">
            {step === 1
              ? "Schritt 1: Template auswählen"
              : "Schritt 2: Parameter konfigurieren"}
          </p>
        </div>
      </div>

      {/* Step 1: Template Selection */}
      {step === 1 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Wähle ein Template
          </h2>
          <TemplateSelector
            onSelect={handleTemplateSelect}
            selected={selectedTemplate}
          />
        </div>
      )}

      {/* Step 2: Configure + Preview */}
      {step === 2 && selectedTemplate && currentTemplate && (
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
                  placeholder="Mein Video Blueprint"
                />
              </div>

              {/* Template Badge */}
              <div className="flex items-center gap-2 mb-6">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {currentTemplate.category.toUpperCase()}
                </span>
                <span className="text-sm text-muted">
                  {currentTemplate.displayName}
                </span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="ml-auto text-xs text-primary hover:text-primary-hover"
                >
                  Template ändern
                </button>
              </div>

              {/* Dynamic Parameter Form */}
              <ParameterEditor
                schema={currentTemplate.schema}
                values={params}
                onChange={handleParamChange}
              />

              {/* Save Button */}
              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || !blueprintName.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Speichern..." : "Blueprint speichern"}
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
                compositionId={selectedTemplate}
                inputProps={params}
              />
              <p className="text-xs text-muted mt-3 text-center">
                Parameter-Änderungen werden sofort in der Vorschau sichtbar.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
