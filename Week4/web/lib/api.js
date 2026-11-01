"use client";

// Data access for the anonymous resident capture slice. The browser talks
// directly to Supabase (Postgres + Row Level Security) via @supabase/ssr — RLS
// allows anonymous SELECT and INSERT only; UPDATE/DELETE are denied server-side.

import { getSupabaseBrowserClient } from "./supabaseClient.js";
import { PROJECTION, buildInsertRow } from "./contributions.js";

// User-facing error messages never echo server internals (per input-validation).
const LOAD_ERROR = "We couldn't load the record just now. Please try again.";
const SAVE_ERROR = "We couldn't save your note just now. Please try again.";

export async function listContributions() {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("contributions")
    .select(PROJECTION)
    .order("created_at", { ascending: false });

  if (error) throw new Error(LOAD_ERROR);
  return data ?? [];
}

export async function createContribution(input) {
  // Validate + shape at the client boundary (UX). Postgres CHECK + RLS are the
  // authoritative server-side guards. buildInsertRow throws its own clean,
  // specific message for invalid input; let that surface to the user.
  const row = buildInsertRow(input);
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from("contributions")
    .insert(row)
    .select(PROJECTION)
    .single();

  if (error) throw new Error(SAVE_ERROR);
  return data;
}
