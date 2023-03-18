import cp from "child_process";
import os from "os";

function stopAndRunEXE(exeName: string): void {
  // Kill all instances of the exeName
  const process = cp.spawnSync("taskkill", ["/f", "/im", exeName]);
  // Start the exeName
  const process2 = cp.spawnSync(exeName);
}

function stopAndRunOSService(serviceName: string): void {
  const process = cp.spawnSync("sc", ["stop", serviceName]);
  const process2 = cp.spawnSync("sc", ["start", serviceName]);
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function restartVirtualDesktop(): void {
  stopAndRunOSService("VirtualDesktop.Service.exe");
  stopAndRunEXE("C:\\Program Files\\Virtual Desktop Streamer\\VirtualDesktop.Streamer.exe");
}

export function restartSteamVR(): void {
  stopAndRunEXE("vrserver.exe");
  stopAndRunEXE("vrmonitor.exe");
  stopAndRunEXE("vrcompositor.exe");
}