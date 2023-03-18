import os from "os";
import { Server, Socket } from "socket.io";
// Import the socket.io-client library
import ioClient from "socket.io-client";
import { ClientData, getClientData } from "./clientdata";

const db: { [pcName: string]: ClientData } = {};

// Check flags to see if -server is set
if (process.argv.includes("--server")) {
  console.log("Starting server");
  // If -server is set, start the server
  const io = new Server(3000, {
    cors: {
      origin: "*",
    },
  });

  // Listen for a connection
  io.on("connection", (socket: Socket) => {
    type role = "pc" | "webui";
    const role = socket.handshake.query.role as role;

    if (role === "pc") {
      // Get client's PC name (set by the client)
      const pcName = socket.handshake.query.pcName as string;
      console.log(`Client ${pcName} connected`);

      socket.on("clientData", (clientData: ClientData) => {
        db[pcName] = clientData;
      });

      setInterval(() => {
        // Send to room "webui" all the data in the db
        io.to("webui").emit("clientData", { data: db });
      }, 1000);

      // Listen for a disconnect
      socket.on("disconnect", () => {
        console.log(`Client ${pcName} disconnected`);
        delete db[pcName];
      });
    } else if (role === "webui") {
      console.log("Web UI connected");

      // Listen for systemAction
      socket.on(
        "systemAction",
        ({ action, pc }: { action: string; pc: string }) => {
          console.log(`Received system action: ${action}`);
          switch (action) {
            case "stopVirtualDesktop": {
              console.log("Stopping Virtual Desktop");
              break;
            }
            case "startVirtualDesktop": {
              console.log("Starting Virtual Desktop");
              break;
            }
            case "stopSteamVR": {
              console.log("Stopping SteamVR");
              break;
            }
            case "startSteamVR": {
              console.log("Starting SteamVR");
              break;
            }
            case "stopOculusVR": {
              console.log("Stopping OculusVR");
              break;
            }
            case "startOculusVR": {
              console.log("Starting OculusVR");
              break;
            }
          }
        }
      );

      socket.on("disconnect", () => {
        console.log("Web UI disconnected");
      });

      // Join the webui room
      socket.join("webui");
    }
  });
} else {
  // If -server is not set, start the client
  console.log("Starting client");
  const computerName = os.hostname();
  const socket = ioClient("http://localhost:3000", {
    query: {
      pcName: computerName,
      role: "pc",
    },
  });

  setInterval(() => {
    socket.emit("clientData", getClientData());
  }, 1000);

  // Listen for a disconnect
  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });
}
