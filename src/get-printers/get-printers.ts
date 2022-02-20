import execFileAsync from "../utils/exec-file-async";
import throwIfUnsupportedOperatingSystem from "../utils/throw-if-unsupported-os";
import { Printer } from "../get-default-printer/get-default-printer";
import path from "path";
import fixPathForAsarUnpack from "../utils/electron-util";

export interface GetPrintersFastOptions {
  printerInformationPath?: string;
}

async function getPrintersFast(
    options: GetPrintersFastOptions = {}
): Promise<Printer[]> {
  function stdoutHandler(stdout: string) {
    const printers: Printer[] = [];
    const parsed = JSON.parse(stdout);

    parsed.forEach((printer: string) => {
      printers.push({
        name: printer,
        deviceId: printer,
      });
    });

    return printers;
  }

  let printerInformation =
      options.printerInformationPath ||
      path.join(__dirname, "PrinterInformation.exe");
  if (!options.printerInformationPath)
    printerInformation = fixPathForAsarUnpack(printerInformation);

  try {
    throwIfUnsupportedOperatingSystem();

    const args: string[] = [
        "--ListPrinters",
        "--json"
    ];

    const { stdout } = await execFileAsync(printerInformation, args);
    return stdoutHandler(stdout);
  } catch (error) {
    throw error;
  }
}

export default getPrintersFast;
