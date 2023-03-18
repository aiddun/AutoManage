import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export interface ClientData {
  timestamp: number;
  virtualDesktopServiceRunning: boolean;
  steamVRRunning: boolean;
  oculusVRRunning: boolean;
}

type TotalClientData = {
  data: {
    [pcName: string]: ClientData;
  };
};

export const useSocketIO = (address: string): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    const s = io(address, {
      query: { name: window.navigator.userAgent, role: "webui" },
    });
    setSocket(s);

    s.on("connect", () => {
      console.log("connected!");
    });

    return () => {
      socket && socket.disconnect();
    };
  }, []);

  return socket;
};

export function useSocketData<Type>(
  listenerName: string,
  socket: Socket | null,
  defaultValue?: Type
): Type | undefined {
  const [data, setData] = useState<Type | undefined>(defaultValue);

  useEffect(() => {
    if (socket != null) {
      socket.on(listenerName, (data: Type) => {
        setData(data);
      });
    }
  }, [socket, listenerName]);

  return data;
}

export function useClientData(
  socket: Socket | null
): TotalClientData | undefined {
  return useSocketData<TotalClientData>("clientData", socket, { data: {} });
}
