import React, { useState } from "react";
import { useIncomeSources } from "../hooks/useIncomeSources";
import { incomeSourceService } from "../services/incomeSourceService";
import type { IncomeSource } from "../types/incomeSource";

/**
 * Debug component for testing the income source system
 * This can be temporarily added to any page for testing
 */
export const IncomeSourceDebugPanel: React.FC = () => {
  const { sources, loading, error, refresh } = useIncomeSources();
  const [testResult, setTestResult] = useState<string>("");
  const [validationResult, setValidationResult] = useState<string>("");

  const runValidationTests = async () => {
    setTestResult("Running validation tests...\n");
    let results = "";

    try {
      // Test 1: Check source uniqueness
      results += "1. Testing source ID uniqueness:\n";
      const isYouTubeUnique = await incomeSourceService.isSourceIdUnique(
        "youtube"
      );
      const isTikTokUnique = await incomeSourceService.isSourceIdUnique(
        "tiktok"
      );
      const isNewUnique = await incomeSourceService.isSourceIdUnique(
        "new-platform"
      );

      results += `   - YouTube unique: ${
        isYouTubeUnique ? "FAIL (should be false)" : "PASS"
      }\n`;
      results += `   - TikTok unique: ${
        isTikTokUnique ? "FAIL (should be false)" : "PASS"
      }\n`;
      results += `   - New platform unique: ${isNewUnique ? "PASS" : "FAIL"}\n`;

      // Test 2: Validate a good source
      results += "\n2. Testing valid source validation:\n";
      const validSource: Omit<IncomeSource, "createdAt" | "updatedAt"> = {
        id: "test-platform",
        name: "Test Platform",
        enabled: true,
        metadata: {
          fees: { fixedFeeUSD: 2.5, method: "fixed" },
          settings: { defaultTaxRate: 15 },
        },
      };

      const validValidation = incomeSourceService.validateSource(validSource);
      results += `   - Valid source passes: ${
        validValidation.isValid ? "PASS" : "FAIL"
      }\n`;
      results += `   - Errors: ${
        validValidation.errors.length === 0 ? "PASS" : "FAIL"
      }\n`;

      // Test 3: Validate an invalid source
      results += "\n3. Testing invalid source validation:\n";
      const invalidSource = {
        id: "", // Invalid empty ID
        name: "",
        enabled: undefined,
        metadata: {
          fees: { fixedFeeUSD: -5 }, // Invalid negative fee
          settings: { defaultTaxRate: 150 }, // Invalid tax rate
        },
      };

      const invalidValidation =
        incomeSourceService.validateSource(invalidSource);
      results += `   - Invalid source fails: ${
        !invalidValidation.isValid ? "PASS" : "FAIL"
      }\n`;
      results += `   - Has errors: ${
        invalidValidation.errors.length > 0 ? "PASS" : "FAIL"
      }\n`;
      results += `   - Error count: ${invalidValidation.errors.length}\n`;

      // Test 4: Check enabled sources
      results += "\n4. Testing enabled sources filtering:\n";
      const enabledCount = sources.filter((s) => s.enabled).length;
      const totalCount = sources.length;
      results += `   - Total sources: ${totalCount}\n`;
      results += `   - Enabled sources: ${enabledCount}\n`;
      results += `   - Has enabled sources: ${
        enabledCount > 0 ? "PASS" : "FAIL"
      }\n`;

      setValidationResult(results);
    } catch (error) {
      setValidationResult(`Error running tests: ${error}`);
    }
  };

  const testAddSource = async () => {
    try {
      setTestResult("Testing add source functionality...\n");

      const newSource: Omit<IncomeSource, "createdAt" | "updatedAt"> = {
        id: `test-${Date.now()}`,
        name: "Test Source",
        enabled: true,
        metadata: {
          icon: {
            type: "lucide",
            value: "TestTube",
            color: "#10b981",
          },
          fees: {
            fixedFeeUSD: 1.0,
            method: "fixed",
          },
          display: {
            description: "A test income source",
            category: "Testing",
          },
        },
      };

      const added = await incomeSourceService.addSource(newSource);
      setTestResult(`Successfully added source: ${added.name} (${added.id})\n`);

      // Refresh the list
      await refresh();
    } catch (error) {
      setTestResult(`Error adding source: ${error}\n`);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-sm text-slate-600">
        Loading income sources...
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800 text-sm">
      <h3 className="font-bold mb-3 text-slate-900 dark:text-slate-100">
        Income Source Debug Panel
      </h3>

      {error && (
        <div className="mb-3 p-2 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      <div className="mb-3">
        <h4 className="font-semibold mb-2 text-slate-700 dark:text-slate-300">
          Available Sources ({sources.length}):
        </h4>
        <div className="space-y-1">
          {sources.map((source) => (
            <div key={source.id} className="text-xs">
              • {source.name} ({source.id}) -{" "}
              {source.enabled ? "Enabled" : "Disabled"}
              {source.metadata?.fees && (
                <span className="text-slate-500">
                  {" "}
                  [Fee: ${source.metadata.fees.fixedFeeUSD || 0}]
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-x-2 mb-3">
        <button
          onClick={runValidationTests}
          className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
        >
          Run Validation Tests
        </button>
        <button
          onClick={testAddSource}
          className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
        >
          Test Add Source
        </button>
        <button
          onClick={refresh}
          className="px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
        >
          Refresh
        </button>
      </div>

      {testResult && (
        <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
          <h5 className="font-semibold text-blue-700 dark:text-blue-300">
            Test Result:
          </h5>
          <pre className="text-xs text-blue-600 dark:text-blue-400 whitespace-pre-wrap">
            {testResult}
          </pre>
        </div>
      )}

      {validationResult && (
        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
          <h5 className="font-semibold text-green-700 dark:text-green-300">
            Validation Results:
          </h5>
          <pre className="text-xs text-green-600 dark:text-green-400 whitespace-pre-wrap">
            {validationResult}
          </pre>
        </div>
      )}
    </div>
  );
};
