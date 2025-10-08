import { useState, useEffect } from "react";

interface BiometricResult {
  success: boolean;
  error?: string;
}

const BIOMETRIC_ENABLED_KEY = "biometric_enabled";
const BIOMETRIC_CREDENTIAL_KEY = "biometric_credential_id";

export const useBiometric = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkBiometricAvailability();
    loadBiometricPreference();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      // Check if WebAuthn is available
      if (window.PublicKeyCredential) {
        const available =
          await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        setIsAvailable(available);
      } else {
        setIsAvailable(false);
      }
    } catch (error) {
      console.error("Error checking biometric availability:", error);
      setIsAvailable(false);
    } finally {
      setIsChecking(false);
    }
  };

  const loadBiometricPreference = () => {
    const enabled = localStorage.getItem(BIOMETRIC_ENABLED_KEY) === "true";
    setIsEnabled(enabled);
  };

  const enableBiometric = async (): Promise<BiometricResult> => {
    try {
      if (!isAvailable) {
        return {
          success: false,
          error: "Biometric authentication is not available on this device",
        };
      }

      // Create credential for biometric authentication
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions =
        {
          challenge,
          rp: {
            name: "PartnerWise",
            id: window.location.hostname,
          },
          user: {
            id: new Uint8Array(16),
            name: "user@partnerwise.com",
            displayName: "PartnerWise User",
          },
          pubKeyCredParams: [
            { alg: -7, type: "public-key" },
            { alg: -257, type: "public-key" },
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
          },
          timeout: 60000,
          attestation: "none",
        };

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      });

      if (credential) {
        // Store credential ID
        const pkCredential = credential as PublicKeyCredential;
        const credentialId = btoa(
          String.fromCharCode(...new Uint8Array(pkCredential.rawId))
        );
        localStorage.setItem(BIOMETRIC_CREDENTIAL_KEY, credentialId);
        localStorage.setItem(BIOMETRIC_ENABLED_KEY, "true");
        setIsEnabled(true);
        return { success: true };
      }

      return {
        success: false,
        error: "Failed to create biometric credential",
      };
    } catch (error: unknown) {
      console.error("Error enabling biometric:", error);

      // Handle specific error types
      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          return {
            success: false,
            error: "Biometric authentication was cancelled or not allowed",
          };
        }

        return {
          success: false,
          error: error.message || "Failed to enable biometric authentication",
        };
      }

      return {
        success: false,
        error: "Failed to enable biometric authentication",
      };
    }
  };

  const disableBiometric = () => {
    localStorage.removeItem(BIOMETRIC_CREDENTIAL_KEY);
    localStorage.removeItem(BIOMETRIC_ENABLED_KEY);
    setIsEnabled(false);
  };

  const authenticateWithBiometric = async (): Promise<BiometricResult> => {
    try {
      if (!isAvailable || !isEnabled) {
        return {
          success: false,
          error: "Biometric authentication is not enabled",
        };
      }

      const credentialId = localStorage.getItem(BIOMETRIC_CREDENTIAL_KEY);
      if (!credentialId) {
        return {
          success: false,
          error:
            "No biometric credential found. Please set up biometric authentication again.",
        };
      }

      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions =
        {
          challenge,
          allowCredentials: [
            {
              id: Uint8Array.from(atob(credentialId), (c) => c.charCodeAt(0)),
              type: "public-key",
              transports: ["internal"],
            },
          ],
          timeout: 60000,
          userVerification: "required",
        };

      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      });

      if (assertion) {
        return { success: true };
      }

      return {
        success: false,
        error: "Biometric authentication failed",
      };
    } catch (error: unknown) {
      console.error("Error authenticating with biometric:", error);

      // Handle specific error cases
      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          return {
            success: false,
            error: "Biometric authentication was cancelled",
          };
        }

        if (error.name === "InvalidStateError") {
          return {
            success: false,
            error: "Biometric credential not found. Please set up again.",
          };
        }

        return {
          success: false,
          error: error.message || "Biometric authentication failed",
        };
      }

      return {
        success: false,
        error: "Biometric authentication failed",
      };
    }
  };

  return {
    isAvailable,
    isEnabled,
    isChecking,
    enableBiometric,
    disableBiometric,
    authenticateWithBiometric,
  };
};
