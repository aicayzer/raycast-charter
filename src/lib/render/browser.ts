import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const MAC_APPS = ["Google Chrome", "Chromium", "Brave Browser", "Arc", "Microsoft Edge"];

const WINDOWS_APPS = [
  ["Google", "Chrome", "Application", "chrome.exe"],
  ["Chromium", "Application", "chrome.exe"],
  ["BraveSoftware", "Brave-Browser", "Application", "brave.exe"],
  ["Microsoft", "Edge", "Application", "msedge.exe"],
];

/** The binary inside a macOS bundle: the one named after the app, else the first in Contents/MacOS. */
function macExecutable(appPath: string): string | undefined {
  const dir = join(appPath, "Contents", "MacOS");
  if (!existsSync(dir)) return undefined;
  const entries = readdirSync(dir);
  const named = appPath
    .split("/")
    .pop()
    ?.replace(/\.app$/, "");
  const pick = entries.find((entry) => entry === named) ?? entries[0];
  return pick ? join(dir, pick) : undefined;
}

/** Turns an application path from the preference into something the browser can be launched from. */
export function executableFor(appPath: string): string | undefined {
  if (appPath.endsWith(".app")) return macExecutable(appPath);
  return existsSync(appPath) ? appPath : undefined;
}

function candidates(): string[] {
  if (process.platform === "win32") {
    const roots = [process.env.ProgramFiles, process.env["ProgramFiles(x86)"], process.env.LOCALAPPDATA].filter(
      (root): root is string => Boolean(root),
    );
    return roots.flatMap((root) => WINDOWS_APPS.map((parts) => join(root, ...parts)));
  }
  const home = process.env.HOME ?? "";
  return ["/Applications", join(home, "Applications")].flatMap((root) =>
    MAC_APPS.map((app) => join(root, `${app}.app`)),
  );
}

/** The preferred app when it resolves, otherwise the first known browser that is installed. */
export function findBrowser(preferred?: string): string | undefined {
  if (preferred) {
    const executable = executableFor(preferred);
    if (executable) return executable;
  }
  for (const candidate of candidates()) {
    const executable = executableFor(candidate);
    if (executable) return executable;
  }
  return undefined;
}

export const BROWSER_NAMES = MAC_APPS;
