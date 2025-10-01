import { useState, useEffect, useCallback } from "react";
import type {
  IncomeSource,
  UseIncomeSourcesResult,
} from "../types/incomeSource";
import { incomeSourceService } from "../services/incomeSourceService";

/**
 * React hook for managing income sources
 * Provides a clean interface for components to interact with income source data
 */
export const useIncomeSources = (): UseIncomeSourcesResult => {
  const [sources, setSources] = useState<IncomeSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load sources from the service
   */
  const loadSources = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const sourcesData = await incomeSourceService.getSources();
      setSources(sourcesData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load income sources";
      setError(errorMessage);
      console.error("Error loading income sources:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get source by ID
   */
  const getSourceById = useCallback(
    (id: string): IncomeSource | undefined => {
      return sources.find((source) => source.id === id);
    },
    [sources]
  );

  /**
   * Get enabled sources only
   */
  const getEnabledSources = useCallback((): IncomeSource[] => {
    return sources.filter((source) => source.enabled);
  }, [sources]);

  /**
   * Refresh sources from service
   */
  const refresh = useCallback(async () => {
    await loadSources();
  }, [loadSources]);

  // Load sources on mount
  useEffect(() => {
    loadSources();
  }, [loadSources]);

  return {
    sources,
    loading,
    error,
    getSourceById,
    getEnabledSources,
    refresh,
  };
};

/**
 * Hook for getting a specific income source by ID
 */
export const useIncomeSource = (id: string) => {
  const { sources, loading, error } = useIncomeSources();
  const source = sources.find((s) => s.id === id);

  return {
    source,
    loading,
    error,
    exists: !!source,
  };
};

/**
 * Hook for getting enabled income sources only
 */
export const useEnabledIncomeSources = () => {
  const { sources, loading, error, refresh } = useIncomeSources();
  const enabledSources = sources.filter((source) => source.enabled);

  return {
    sources: enabledSources,
    loading,
    error,
    refresh,
  };
};
