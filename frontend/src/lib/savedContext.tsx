"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "./supabase";
import { useUser } from "./auth";

interface SavedCtx {
  savedIds: Set<string>;
  toggle: (listingId: string) => Promise<void>;
  loading: boolean;
}

const Ctx = createContext<SavedCtx>({ savedIds: new Set(), toggle: async () => {}, loading: false });

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) { setSavedIds(new Set()); return; }
    setLoading(true);
    supabase
      .from("saved_listings")
      .select("listing_id")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data) setSavedIds(new Set(data.map((r: { listing_id: string }) => r.listing_id)));
        setLoading(false);
      });
  }, [user]);

  const toggle = useCallback(async (listingId: string) => {
    if (!user) {
      window.location.href = "/dang-nhap?redirect=" + window.location.pathname;
      return;
    }
    if (!/^[0-9a-f-]{36}$/i.test(listingId)) return;

    const isSaved = savedIds.has(listingId);
    // Optimistic update
    setSavedIds(prev => {
      const next = new Set(prev);
      if (isSaved) next.delete(listingId); else next.add(listingId);
      return next;
    });

    if (isSaved) {
      await supabase.from("saved_listings").delete().eq("user_id", user.id).eq("listing_id", listingId);
    } else {
      const { error } = await supabase.from("saved_listings").insert({ user_id: user.id, listing_id: listingId });
      if (error) {
        // Rollback on failure
        setSavedIds(prev => { const next = new Set(prev); next.delete(listingId); return next; });
      }
    }
  }, [user, savedIds]);

  return <Ctx.Provider value={{ savedIds, toggle, loading }}>{children}</Ctx.Provider>;
}

export function useSaved() { return useContext(Ctx); }
