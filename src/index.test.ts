import { existsSync, readdirSync, rmSync } from "fs";
import { FS } from "./";

/**
 * Constants
 */
const testDir = ".tmp";
const testContent1 = "a very long string1",
  testContent3 = "a very long string3";

describe("Testing the 'FS' class", () => {
  /** ONLY DEV, TEST: delete the directory if exists */
  if (existsSync(testDir)) rmSync(testDir, { recursive: true, force: true });

  // Init the test store directory
  const fs = new FS(testDir);

  test("Store test files, the first two with the same content.", () => {
    fs.store("filename1", testContent1);
    fs.store("filename2", testContent1);
    fs.store("filename3", testContent3);
  });

  test("Check the stored files to be correctly named by hash, and prevent content duplication", () => {
    expect(readdirSync(testDir, { recursive: true })).toStrictEqual([
      "4b532341b72f4eaf7430bdf2038619f0",
      "8a420416d056c74701f24031db371503",
      "map.json",
    ]);
  });

  test("Get the stored files by their names", () => {
    expect(fs.get("filename1")).toBe(testContent1);
    expect(fs.get("filename2")).toBe(testContent1);
    expect(fs.get("filename3")).toBe(testContent3);
  });
});
