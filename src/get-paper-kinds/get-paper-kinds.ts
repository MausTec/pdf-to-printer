import throwIfUnsupportedOperatingSystem from "../utils/throw-if-unsupported-os";
import execFileAsync from "../utils/exec-file-async";
import path from "path";
import fixPathForAsarUnpack from "../utils/electron-util";

export interface PaperKind {
  kind: number;
  rawKind: number;
  paperName: string;
  height: number;
  width: number;
}

export interface GetPaperKindOptions {
  printerInformationPath?: string;
}

export default async function getPaperKinds(
  deviceId: string,
  options: GetPaperKindOptions = {}
): Promise<PaperKind[]> {
  function stdoutHandler(stdout: string) {
    const paperKinds: PaperKind[] = [];

    const parsed = JSON.parse(stdout);

    parsed.forEach((paper: {[key: string]: any}) => {
      paperKinds.push({
        kind: paper["Kind"],
        rawKind: paper["RawKind"],
        paperName: paper["PaperName"],
        height: paper["Height"],
        width: paper["Width"],
      });
    });

    return paperKinds;
  }

  let printerInformation =
    options.printerInformationPath ||
    path.join(__dirname, "PrinterInformation.exe");
  if (!options.printerInformationPath)
    printerInformation = fixPathForAsarUnpack(printerInformation);

  try {
    throwIfUnsupportedOperatingSystem();

    const args: string[] = [
        "--ListPapers",
        deviceId,
        "--json"
    ];

    const { stdout } = await execFileAsync(printerInformation, args);
    return stdoutHandler(stdout);
  } catch (error) {
    throw error;
  }
}
