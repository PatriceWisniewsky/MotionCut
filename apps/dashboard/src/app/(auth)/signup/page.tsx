"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Film, Mail, Lock, User, Loader2, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-success" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            Fast geschafft!
          </h2>
          <p className="text-muted mb-6">
            Wir haben dir eine Bestätigungsmail gesendet. Klicke auf den Link
            in der E-Mail, um dein Konto zu aktivieren.
          </p>
          <Link
            href="/login"
            className="text-primary hover:text-primary-hover text-sm font-medium"
          >
            Zurück zum Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
            <Film className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">MotionCut</h1>
          <p className="text-muted mt-1">Erstelle dein kostenloses Konto</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSignup}
          className="bg-surface border border-border rounded-xl p-6 space-y-4"
        >
          {error && (
            <div className="bg-error/10 border border-error/20 text-error text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                placeholder="Dein Name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              E-Mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                placeholder="deine@email.de"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Passwort
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                placeholder="Mind. 6 Zeichen"
                minLength={6}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Registrieren...
              </>
            ) : (
              "Konto erstellen"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-4">
          Bereits ein Account?{" "}
          <Link href="/login" className="text-primary hover:text-primary-hover">
            Anmelden
          </Link>
        </p>
      </div>
    </div>
  );
}
