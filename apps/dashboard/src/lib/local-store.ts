/**
 * Lokaler Storage-Layer der die Supabase-API nachahmt.
 * Nutzt localStorage als Datenspeicher - kein Backend nötig.
 * Wird automatisch verwendet wenn NEXT_PUBLIC_SUPABASE_URL nicht gesetzt ist.
 */

import { compositionRegistry, type CompositionId } from "@motioncut/video-types";

// ---------- Types ----------
interface LocalUser {
  id: string;
  email: string;
  user_metadata: { display_name: string };
}

type Row = Record<string, unknown>;

// ---------- Helpers ----------
function getStore<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(`motioncut_${key}`) || "[]");
  } catch {
    return [];
  }
}

function setStore<T>(key: string, data: T[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`motioncut_${key}`, JSON.stringify(data));
}

function uuid() {
  return crypto.randomUUID();
}

// ---------- Seed composition_types on first load ----------
function ensureCompositionTypes() {
  const existing = getStore<Row>("composition_types");
  if (existing.length > 0) return;

  const seed = Object.entries(compositionRegistry).map(([name, t]) => ({
    id: uuid(),
    name,
    display_name: t.displayName,
    description: t.description,
    category: t.category,
    default_props: t.defaults,
    schema_version: 1,
    created_at: new Date().toISOString(),
  }));
  setStore("composition_types", seed);
}

// ---------- Fake Auth ----------
const LOCAL_USER: LocalUser = {
  id: "local-user-00000000",
  email: "local@motioncut.dev",
  user_metadata: { display_name: "Local User" },
};

// ---------- Query Builder (mini Supabase-API) ----------
// Supabase-Ketten: .from().select().eq().single()
//                   .from().insert({}).select().single()
//                   .from().update({}).eq()
//                   .from().delete().eq()
// .single() und await/then sind terminale Aufrufe.

class QueryBuilder {
  private table: string;
  private _filters: Array<{ col: string; op: string; val: unknown }> = [];
  private _order: { col: string; asc: boolean } | null = null;
  private _selectCols: string = "*";
  private _isSingle = false;
  private _insertData: Row | Row[] | null = null;
  private _updateData: Row | null = null;
  private _deleteMode = false;

  constructor(table: string) {
    this.table = table;
    ensureCompositionTypes();
  }

  select(cols: string = "*") {
    this._selectCols = cols;
    return this;
  }

  eq(col: string, val: unknown) {
    this._filters.push({ col, op: "eq", val });
    return this;
  }

  order(col: string, opts?: { ascending?: boolean }) {
    this._order = { col, asc: opts?.ascending ?? true };
    return this;
  }

  single() {
    this._isSingle = true;
    // Return a thenable so await works
    const promise = this._execute();
    // Also make it chainable-ish: attach .data/.error via then
    return promise;
  }

  insert(data: Row | Row[]) {
    this._insertData = data;
    return this;
  }

  update(data: Row) {
    this._updateData = data;
    return this;
  }

  delete() {
    this._deleteMode = true;
    return this;
  }

  // Make awaitable: `const { data } = await supabase.from("x").select()`
  then(
    resolve: (val: { data: any; error: any }) => void,
    reject?: (err: any) => void
  ) {
    return this._execute().then(resolve, reject);
  }

  private async _execute(): Promise<{ data: any; error: any }> {
    let rows = getStore<Row>(this.table);

    // INSERT
    if (this._insertData) {
      const items = Array.isArray(this._insertData)
        ? this._insertData
        : [this._insertData];
      const newRows = items.map((item) => ({
        id: uuid(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...item,
      }));
      rows = [...rows, ...newRows];
      setStore(this.table, rows);

      const result = this._isSingle ? newRows[0] : newRows;
      return { data: result, error: null };
    }

    // DELETE
    if (this._deleteMode) {
      const before = rows.length;
      rows = rows.filter((r) => !this._matchesFilters(r));
      setStore(this.table, rows);
      return {
        data: null,
        error: before === rows.length ? { message: "Not found" } : null,
      };
    }

    // UPDATE
    if (this._updateData) {
      rows = rows.map((r) =>
        this._matchesFilters(r) ? { ...r, ...this._updateData } : r
      );
      setStore(this.table, rows);
      return { data: null, error: null };
    }

    // SELECT
    let result = rows.filter((r) => this._matchesFilters(r));

    // Handle joins (e.g. "*, composition_types(name)")
    if (this._selectCols.includes("composition_types(")) {
      const types = getStore<Row>("composition_types");
      result = result.map((r) => {
        const type = types.find((t) => t.id === r.composition_type_id);
        return { ...r, composition_types: type || null };
      });
    }

    if (this._order) {
      const { col, asc } = this._order;
      result.sort((a, b) => {
        const aVal = String(a[col] ?? "");
        const bVal = String(b[col] ?? "");
        return asc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
    }

    if (this._isSingle) {
      return {
        data: result[0] || null,
        error: result[0] ? null : { message: "Not found" },
      };
    }

    return { data: result, error: null };
  }

  private _matchesFilters(row: Row): boolean {
    if (this._filters.length === 0) return true;
    return this._filters.every((f) => {
      if (f.op === "eq") return row[f.col] === f.val;
      return true;
    });
  }
}

// ---------- Public API (mimics createClient()) ----------
export function createLocalClient() {
  return {
    auth: {
      getUser: async () => ({
        data: { user: LOCAL_USER },
        error: null,
      }),
      signInWithPassword: async (_creds: {
        email: string;
        password: string;
      }) => ({
        data: { user: LOCAL_USER },
        error: null,
      }),
      signUp: async (_creds: {
        email: string;
        password: string;
        options?: any;
      }) => ({
        data: { user: LOCAL_USER },
        error: null,
      }),
      signOut: async () => ({ error: null }),
      exchangeCodeForSession: async (_code: string) => ({ error: null }),
    },
    from: (table: string) => new QueryBuilder(table),
  };
}

// ---------- Check ob wir lokal laufen ----------
export function isLocalMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !url || url.includes("YOUR_PROJECT_ID") || url === "";
}
