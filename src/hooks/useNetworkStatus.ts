import { useState, useEffect } from "react";

interface NetworkConnection {
  downlink?: number;
  effectiveType?: string;
  saveData?: boolean;
  addEventListener: (type: string, listener: () => void) => void;
  removeEventListener: (type: string, listener: () => void) => void;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkConnection;
  mozConnection?: NetworkConnection;
  webkitConnection?: NetworkConnection;
}

interface NetworkState {
  isOnline: boolean;
  isOffline: boolean;
  downlink?: number;
  effectiveType?: string;
  saveData?: boolean;
}

export const useNetworkStatus = (): NetworkState => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [networkInfo, setNetworkInfo] = useState<Partial<NetworkState>>({});

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    const updateNetworkInfo = () => {
      const nav = navigator as NavigatorWithConnection;
      const connection =
        nav.connection || nav.mozConnection || nav.webkitConnection;

      if (connection) {
        setNetworkInfo({
          downlink: connection.downlink,
          effectiveType: connection.effectiveType,
          saveData: connection.saveData,
        });
      }
    };

    // Listen for online/offline events
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    // Listen for network changes
    const nav = navigator as NavigatorWithConnection;
    const connection =
      nav.connection || nav.mozConnection || nav.webkitConnection;

    if (connection) {
      connection.addEventListener("change", updateNetworkInfo);
      updateNetworkInfo(); // Initial call
    }

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);

      if (connection) {
        connection.removeEventListener("change", updateNetworkInfo);
      }
    };
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
    ...networkInfo,
  };
};

export default useNetworkStatus;
