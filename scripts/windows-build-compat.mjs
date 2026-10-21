// OpenNext traces directory symlinks. Windows junctions do not need Developer Mode
// or elevated symlink privileges; scope this fallback to the adapter build process.
import fs from "node:fs";
import path from "node:path";
import { syncBuiltinESMExports } from "node:module";

const symlinkSync = fs.symlinkSync;
fs.symlinkSync = function (target, destination, type) {
  try {
    return symlinkSync(target, destination, type);
  } catch (error) {
    if (process.platform !== "win32" || error.code !== "EPERM") throw error;
    const absoluteTarget = path.resolve(path.dirname(destination), target);
    if (!fs.statSync(absoluteTarget).isDirectory()) throw error;
    return symlinkSync(absoluteTarget, destination, "junction");
  }
};
syncBuiltinESMExports();
