const cp = require("child_process");

export interface ClientData {
    timestamp: number;
    virtualDesktopServiceRunning: boolean;
    steamVRRunning: boolean;
    oculusVRRunning: boolean;
}

function isEXERunning(exeName: string): boolean {
    const process = cp.spawnSync("tasklist", [
        "/fi",
        `imagename eq ${exeName}`,
    ]);
    return process.stdout.toString().includes(exeName);
}

function isOSServiceRunning(serviceName: string): boolean {
    const process = cp.spawnSync("sc", ["query", serviceName]);
    return process.stdout.toString().includes("RUNNING");
}

function isVirtualDesktopServiceRunning(): boolean {
    // Check if VirtualDesktop.Service.exe is running
    return isOSServiceRunning("VirtualDesktop.Service.exe");
}

function isSteamVRRunning(): boolean {
    // Check if vrserver.exe is running
    return isEXERunning("vrserver.exe");
}

function isOculusVRRunning(): boolean {
    // Check if OculusClient.exe is running
    return isEXERunning("OculusClient.exe");
}

export function getClientData(): ClientData {
    return {
        timestamp: Date.now(),
        virtualDesktopServiceRunning: isVirtualDesktopServiceRunning(),
        steamVRRunning: isSteamVRRunning(),
        oculusVRRunning: isOculusVRRunning(),
    };
}