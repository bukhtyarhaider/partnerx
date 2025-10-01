import React from "react";
import { usePerformanceMonitoring } from "../hooks/usePerformanceMonitoring";

export const PerformanceMonitor: React.FC = () => {
  usePerformanceMonitoring();
  return null;
};

export default PerformanceMonitor;
