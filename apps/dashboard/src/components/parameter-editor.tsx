"use client";

import React from "react";
import { z } from "zod";

interface ParameterEditorProps {
  schema: z.ZodObject<any>;
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}

/**
 * Dynamically generates form fields based on a Zod schema.
 * Maps Zod types to appropriate UI controls:
 * - string → text input (or color picker for hex colors)
 * - number → range slider + number input
 * - boolean → toggle switch
 * - enum → select dropdown
 */
export function ParameterEditor({
  schema,
  values,
  onChange,
}: ParameterEditorProps) {
  const shape = schema.shape;

  return (
    <div className="space-y-5">
      {Object.entries(shape).map(([key, fieldSchema]) => {
        const zodField = fieldSchema as z.ZodTypeAny;
        const description = zodField.description || key;
        const value = values[key];

        return (
          <div key={key}>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {description}
            </label>
            {renderField(key, zodField, value, onChange)}
          </div>
        );
      })}
    </div>
  );
}

function renderField(
  key: string,
  schema: z.ZodTypeAny,
  value: unknown,
  onChange: (key: string, value: unknown) => void
) {
  // Unwrap optional/default
  let inner = schema;
  if (inner instanceof z.ZodDefault) inner = inner._def.innerType;
  if (inner instanceof z.ZodOptional) inner = inner._def.innerType;

  // Enum
  if (inner instanceof z.ZodEnum) {
    const options = inner._def.values as string[];
    return (
      <select
        value={String(value ?? "")}
        onChange={(e) => onChange(key, e.target.value)}
        className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
      >
        {options.map((opt: string) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  // Boolean
  if (inner instanceof z.ZodBoolean) {
    return (
      <button
        type="button"
        onClick={() => onChange(key, !value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          value ? "bg-primary" : "bg-border"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            value ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    );
  }

  // Number
  if (inner instanceof z.ZodNumber) {
    const checks = inner._def.checks;
    let min = 0;
    let max = 300;
    let step = 1;

    for (const check of checks) {
      if (check.kind === "min") min = check.value;
      if (check.kind === "max") max = check.value;
    }

    // Smaller step for decimal ranges
    if (max - min <= 5) step = 0.1;

    return (
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={Number(value ?? min)}
          onChange={(e) => onChange(key, Number(e.target.value))}
          className="flex-1 h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={Number(value ?? min)}
          onChange={(e) => onChange(key, Number(e.target.value))}
          className="w-20 px-2 py-1.5 bg-surface border border-border rounded-lg text-foreground text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>
    );
  }

  // String - check if it's a color (hex pattern in description or regex check)
  if (inner instanceof z.ZodString) {
    const isColor =
      key.toLowerCase().includes("color") ||
      (inner._def.checks?.some(
        (c: any) => c.kind === "regex" && c.regex?.source?.includes("[0-9A-Fa-f]")
      ) ?? false);

    if (isColor) {
      return (
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={String(value ?? "#000000")}
            onChange={(e) => onChange(key, e.target.value)}
            className="w-10 h-10 rounded-lg border border-border cursor-pointer bg-transparent"
          />
          <input
            type="text"
            value={String(value ?? "")}
            onChange={(e) => onChange(key, e.target.value)}
            className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="#000000"
          />
        </div>
      );
    }

    // Regular text input
    return (
      <input
        type="text"
        value={String(value ?? "")}
        onChange={(e) => onChange(key, e.target.value)}
        className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        placeholder={key}
      />
    );
  }

  // Fallback: JSON editor
  return (
    <textarea
      value={JSON.stringify(value, null, 2)}
      onChange={(e) => {
        try {
          onChange(key, JSON.parse(e.target.value));
        } catch {
          // Invalid JSON, ignore
        }
      }}
      className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 h-24"
    />
  );
}
