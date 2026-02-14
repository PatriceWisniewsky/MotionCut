"use client";

import React, { useEffect, useState } from "react";
import { Download, Film, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { VideoHistoryRecord } from "@motioncut/video-types";

const statusConfig = {
  rendering: {
    icon: Loader2,
    color: "text-warning",
    bg: "bg-warning/10",
    label: "Rendering...",
    animate: true,
  },
  completed: {
    icon: CheckCircle,
    color: "text-success",
    bg: "bg-success/10",
    label: "Fertig",
    animate: false,
  },
  failed: {
    icon: XCircle,
    color: "text-error",
    bg: "bg-error/10",
    label: "Fehlgeschlagen",
    animate: false,
  },
};

export default function HistoryPage() {
  const [videos, setVideos] = useState<VideoHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("video_history")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setVideos(data);
    }
    setLoading(false);
  }

  function formatFileSize(bytes: number | null): string {
    if (!bytes) return "-";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function formatDuration(ms: number | null): string {
    if (!ms) return "-";
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Video-Historie</h1>
        <p className="text-sm text-muted mt-1">
          Alle erstellten Videos einsehen und herunterladen
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-xl p-5 animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-border rounded-lg" />
                <div className="flex-1">
                  <div className="h-4 bg-border rounded w-1/4 mb-2" />
                  <div className="h-3 bg-border rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-12 text-center">
          <Clock className="w-12 h-12 text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Noch keine Videos erstellt
          </h3>
          <p className="text-muted">
            Deine gerenderten Videos erscheinen hier.
          </p>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-border text-xs font-medium text-muted uppercase tracking-wider">
            <div className="col-span-4">Video</div>
            <div className="col-span-2">Template</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1">Größe</div>
            <div className="col-span-1">Dauer</div>
            <div className="col-span-2">Erstellt</div>
          </div>

          {/* Table Body */}
          {videos.map((video) => {
            const status = statusConfig[video.status];
            const StatusIcon = status.icon;

            return (
              <div
                key={video.id}
                className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-border last:border-0 items-center hover:bg-surface-hover transition-colors"
              >
                {/* Name */}
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Film className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {video.composition_type}
                    </p>
                    <p className="text-xs text-muted truncate">
                      {video.id.slice(0, 8)}...
                    </p>
                  </div>
                </div>

                {/* Template */}
                <div className="col-span-2">
                  <span className="text-sm text-foreground">
                    {video.composition_type}
                  </span>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}
                  >
                    <StatusIcon
                      className={`w-3 h-3 ${status.animate ? "animate-spin" : ""}`}
                    />
                    {status.label}
                  </span>
                </div>

                {/* File Size */}
                <div className="col-span-1 text-sm text-muted">
                  {formatFileSize(video.file_size_bytes)}
                </div>

                {/* Render Duration */}
                <div className="col-span-1 text-sm text-muted">
                  {formatDuration(video.duration_ms)}
                </div>

                {/* Created */}
                <div className="col-span-2 flex items-center justify-between">
                  <span className="text-sm text-muted">
                    {new Date(video.created_at).toLocaleDateString("de-DE")}
                  </span>
                  {video.status === "completed" && video.output_url && (
                    <a
                      href={video.output_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                    >
                      <Download className="w-4 h-4 text-primary" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
