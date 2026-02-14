"use client";

import React from "react";
import { compositionRegistry, type CompositionId } from "@motioncut/video-types";
import { Film, Type, Zap, MessageSquare, Share2 } from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  intro: <Film className="w-5 h-5" />,
  outro: <Share2 className="w-5 h-5" />,
  broll: <Type className="w-5 h-5" />,
  motion: <Zap className="w-5 h-5" />,
  social: <MessageSquare className="w-5 h-5" />,
};

const categoryColors: Record<string, string> = {
  intro: "bg-primary/10 text-primary border-primary/20",
  outro: "bg-accent/10 text-accent border-accent/20",
  broll: "bg-success/10 text-success border-success/20",
  motion: "bg-warning/10 text-warning border-warning/20",
  social: "bg-primary/10 text-primary border-primary/20",
};

interface TemplateSelectorProps {
  onSelect: (id: CompositionId) => void;
  selected?: CompositionId | null;
}

export function TemplateSelector({ onSelect, selected }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(compositionRegistry).map(([id, template]) => {
        const isSelected = selected === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id as CompositionId)}
            className={`text-left p-5 rounded-xl border transition-all ${
              isSelected
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-border bg-surface hover:border-primary/30 hover:bg-surface-hover"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  categoryColors[template.category] || "bg-muted/10 text-muted"
                }`}
              >
                {categoryIcons[template.category]}
              </div>
              <div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    categoryColors[template.category] || "bg-muted/10 text-muted"
                  }`}
                >
                  {template.category.toUpperCase()}
                </span>
              </div>
            </div>
            <h3 className="font-semibold text-foreground mb-1">
              {template.displayName}
            </h3>
            <p className="text-sm text-muted">{template.description}</p>
          </button>
        );
      })}
    </div>
  );
}
