import { useCallback, useEffect, useState } from "react";
import { storageUtils } from "../lib/storage";
import { Entry, EntryCreate, EntryUpdate } from "../types/entry";

const ENTRIES_KEY = "thoughtly-entries";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function useEntries() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load entries on mount
  useEffect(() => {
    const loadEntries = () => {
      const saved = storageUtils.getObject<Entry[]>(ENTRIES_KEY);
      setEntries(saved || []);
      setIsLoading(false);
    };
    loadEntries();
  }, []);

  // Save entries whenever they change
  const saveEntries = useCallback((newEntries: Entry[]) => {
    setEntries(newEntries);
    storageUtils.setObject(ENTRIES_KEY, newEntries);
  }, []);

  // Create a new entry
  const createEntry = useCallback(
    (data: EntryCreate): Entry => {
      const now = Date.now();
      const newEntry: Entry = {
        id: generateId(),
        content: data.content,
        tags: data.tags || [],
        createdAt: now,
        updatedAt: now,
        isPinned: false,
      };
      saveEntries([newEntry, ...entries]);
      return newEntry;
    },
    [entries, saveEntries]
  );

  // Update an entry
  const updateEntry = useCallback(
    (id: string, data: EntryUpdate): Entry | null => {
      const index = entries.findIndex((e) => e.id === id);
      if (index === -1) return null;

      const updatedEntry: Entry = {
        ...entries[index],
        ...data,
        updatedAt: Date.now(),
      };

      const newEntries = [...entries];
      newEntries[index] = updatedEntry;
      saveEntries(newEntries);
      return updatedEntry;
    },
    [entries, saveEntries]
  );

  // Delete an entry
  const deleteEntry = useCallback(
    (id: string): boolean => {
      const newEntries = entries.filter((e) => e.id !== id);
      if (newEntries.length === entries.length) return false;
      saveEntries(newEntries);
      return true;
    },
    [entries, saveEntries]
  );

  // Toggle pin status
  const togglePin = useCallback(
    (id: string): void => {
      updateEntry(id, { isPinned: !entries.find((e) => e.id === id)?.isPinned });
    },
    [entries, updateEntry]
  );

  // Search entries
  const searchEntries = useCallback(
    (query: string): Entry[] => {
      if (!query.trim()) return entries;
      const lowerQuery = query.toLowerCase();
      return entries.filter(
        (e) =>
          e.content.toLowerCase().includes(lowerQuery) ||
          e.tags.some((t) => t.toLowerCase().includes(lowerQuery))
      );
    },
    [entries]
  );

  // Filter by tag
  const filterByTag = useCallback(
    (tag: string): Entry[] => {
      return entries.filter((e) => e.tags.includes(tag));
    },
    [entries]
  );

  // Get all unique tags
  const getAllTags = useCallback((): string[] => {
    const tagSet = new Set<string>();
    entries.forEach((e) => e.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [entries]);

  // Sort entries (pinned first, then by date)
  const sortedEntries = [...entries].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.updatedAt - a.updatedAt;
  });

  return {
    entries: sortedEntries,
    isLoading,
    createEntry,
    updateEntry,
    deleteEntry,
    togglePin,
    searchEntries,
    filterByTag,
    getAllTags,
  };
}
