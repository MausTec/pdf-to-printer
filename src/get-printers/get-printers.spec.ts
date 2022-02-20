import { mocked } from "jest-mock";
import { Printer } from "../get-default-printer/get-default-printer";
import execAsync from "../utils/exec-file-async";
import getPrinters from "./get-printers";

jest.mock("../utils/throw-if-unsupported-os");
jest.mock("../utils/exec-file-async");
const mockedExecAsync = mocked(execAsync);

afterEach(() => {
  // restore the original implementation
  mockedExecAsync.mockRestore();
});

const mockPrinterListStdout = `
["OneNote","Microsoft XPS Document Writer","Microsoft Print to PDF","Fax","\\\\\\\\DESKTOP-FN61MF\\\\DYMO LabelWriter 4XL"]
`;

it("returns list of available printers", async () => {
  mockedExecAsync.mockResolvedValue({
    stdout: mockPrinterListStdout,
    stderr: "",
  });

  const result: Printer[] = await getPrinters();

  expect(result).toStrictEqual([
    { deviceId: "OneNote", name: "OneNote" },
    {
      deviceId: "Microsoft XPS Document Writer",
      name: "Microsoft XPS Document Writer",
    },
    {
      deviceId: "Microsoft Print to PDF",
      name: "Microsoft Print to PDF",
    },
    {
      deviceId: "Fax",
      name: "Fax",
    },
    {
      deviceId: "\\\\DESKTOP-FN61MF\\DYMO LabelWriter 4XL",
      name: "\\\\DESKTOP-FN61MF\\DYMO LabelWriter 4XL",
    }
  ]);
});

it("when did not find any printer info", async () => {
  const stdout = `
  []`;
  mockedExecAsync.mockResolvedValue({ stdout, stderr: "" });

  const result = await getPrinters();

  return expect(result).toEqual([]);
});

it("fails with an error", () => {
  mockedExecAsync.mockRejectedValue("error");
  return expect(getPrinters()).rejects.toBe("error");
});
