import { useState } from "react";
import { Socket } from "socket.io-client";

import { useClientData, ClientData, useSocketIO } from "./hooks/useClientData";
/*
export interface ClientData {
  timestamp: number;
  virtualDesktopServiceRunning: boolean;
  steamVRRunning: boolean;
  oculusVRRunning: boolean;
}
*/

function emitSystemAction(
  socket: Socket | null,
  action: string,
  pcName: string
) {
  socket?.emit("systemAction", { action, pcName });
}

function App() {
  const socket = useSocketIO("http://localhost:3000");
  const clientData = useClientData(socket);

  console.log(clientData);

  return (
    <div className="App">
      {/* Tailwind table with each element in ClientData */}
      <div className="flex justify-center align-middle">
        <table className="table ">
          <thead>
            <tr>
              <th className="">PC Name</th>
              <th className="">Virtual Desktop Service Running</th>
              <th className="">Steam VR Running</th>
              <th className="">Oculus VR Running</th>
              <th className="">Virtual Desktop</th>
              <th className="">Steam VR</th>
              <th className="">Oculus VR</th>
            </tr>
          </thead>
          <tbody>
            {/* Use timestamp as key */}
            {Object.entries(clientData?.data || {}).map(([pcName, data]) => (
              <tr key={data.timestamp}>
                <td className="">{pcName}</td>
                <td className="">
                  {data.virtualDesktopServiceRunning ? "Yes" : "No"}
                </td>
                <td className="">{data.steamVRRunning ? "Yes" : "No"}</td>
                <td className="">{data.oculusVRRunning ? "Yes" : "No"}</td>
                <td>
                  <button
                    className="btn no-animation	"
                    onClick={() => {
                      emitSystemAction(
                        socket,
                        data.virtualDesktopServiceRunning
                          ? "stopVirtualDesktop"
                          : "startVirtualDesktop",
                        pcName
                      );
                    }}
                  >
                    {data.virtualDesktopServiceRunning ? "Stop" : "Start"}
                  </button>
                </td>
                <td>
                  <button
                    className="btn no-animation	"
                    onClick={() => {
                      emitSystemAction(
                        socket,
                        data.steamVRRunning ? "stopSteamVR" : "startSteamVR",
                        pcName
                      );
                    }}
                  >
                    {data.steamVRRunning ? "Stop" : "Start"}
                  </button>
                </td>
                <td>
                  <button
                    className="btn no-animation	"
                    onClick={() => {
                      emitSystemAction(
                        socket,
                        data.oculusVRRunning ? "stopOculusVR" : "startOculusVR",
                        pcName
                      );
                    }}
                  >
                    {data.oculusVRRunning ? "Stop" : "Start"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
