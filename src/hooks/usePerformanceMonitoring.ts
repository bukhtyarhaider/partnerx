import { useEffect } from "react";

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

interface LCPEntry extends PerformanceEntry {
  startTime: number;
}

interface FIDEntry extends PerformanceEntry {
  processingStart: number;
  startTime: number;
}

interface CLSEntry extends PerformanceEntry {
  hadRecentInput: boolean;
  value: number;
}

export const usePerformanceMonitoring = () => {
  useEffect(() => {
    const reportMetrics = (metrics: PerformanceMetrics) => {
      // In production, you would send these to your analytics service
      console.log("Performance Metrics:", metrics);

      // Example: Send to analytics
      // analytics.track('performance_metrics', metrics);
    };

    // Measure performance metrics
    const measurePerformance = () => {
      const metrics: PerformanceMetrics = {};

      // First Contentful Paint
      const paintEntries = performance.getEntriesByType("paint");
      const fcpEntry = paintEntries.find(
        (entry) => entry.name === "first-contentful-paint"
      );
      if (fcpEntry) {
        metrics.fcp = fcpEntry.startTime;
      }

      // Time to First Byte
      const navigationEntry = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        metrics.ttfb =
          navigationEntry.responseStart - navigationEntry.requestStart;
      }

      reportMetrics(metrics);
    };

    // Largest Contentful Paint
    if ("PerformanceObserver" in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as LCPEntry;
          if (lastEntry) {
            console.log("LCP:", lastEntry.startTime);
          }
        });
        lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            const fidEntry = entry as FIDEntry;
            console.log("FID:", fidEntry.processingStart - fidEntry.startTime);
          });
        });
        fidObserver.observe({ entryTypes: ["first-input"] });

        // Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach((entry) => {
            const clsEntry = entry as CLSEntry;
            if (!clsEntry.hadRecentInput) {
              clsValue += clsEntry.value;
            }
          });
          console.log("CLS:", clsValue);
        });
        clsObserver.observe({ entryTypes: ["layout-shift"] });

        return () => {
          lcpObserver.disconnect();
          fidObserver.disconnect();
          clsObserver.disconnect();
        };
      } catch (error) {
        console.warn("Performance Observer not fully supported:", error);
      }
    }

    // Wait for page load to measure initial metrics
    if (document.readyState === "complete") {
      measurePerformance();
    } else {
      window.addEventListener("load", measurePerformance);
      return () => window.removeEventListener("load", measurePerformance);
    }
  }, []);
};

export default usePerformanceMonitoring;
