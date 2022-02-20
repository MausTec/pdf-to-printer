// Taken from https://github.com/sindresorhus/electron-util/blob/master/node.js

const isElectron = "electron" in process.versions;

const isUsingAsar =
  isElectron &&
  process.mainModule &&
  process.mainModule.filename.includes("app.asar");

function fixPathForAsarUnpack(path: string): string {
  path = isUsingAsar ? path.replace("app.asar", "app.asar.unpacked") : path;

  // TODO This fixes issues with asar and webpack specifically. I don't know how to check for webpack right now.
  path.replace("dist\\main", "node_modules\\pdf-to-printer\\dist");

  return path;
}

export default fixPathForAsarUnpack;
