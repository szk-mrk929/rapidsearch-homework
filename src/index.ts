import crypto from "crypto";
import fs from "fs";
import path from "path";

/**
 * Hash based store system to prevent duplicated content uploads
 */
export class FS {
  map: FileMapper;
  constructor(private readonly baseDir: string) {
    if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });
    this.map = new FileMapper(baseDir);
  }

  get(filename: string): string | null {
    /**
     * Alternative for Linux, Unix only
     */
    // const symlinkPath = path.join(this.baseDir, filename);
    // const hashedFilename = fs.readlinkSync(symlinkPath);
    // const filePath = path.join(this.baseDir, hashedFilename);

    try {
      const hashedFilename = this.map.get(filename);
      const filePath = path.join(this.baseDir, hashedFilename);

      if (!fs.existsSync(filePath))
        throw Error(`File is not found. (${filename} = ${hashedFilename})`);
      return fs.readFileSync(filePath, "utf8");
    } catch (error) {
      // throw error.message;
      return null;
    }
  }
  store(filename: string, data: string) {
    const hashedFilename = this.generateHash(data);
    const filePath = path.join(this.baseDir, hashedFilename);

    // Check if the file already exists
    if (!fs.existsSync(filePath))
      fs.writeFileSync(filePath, data, { flag: "a" });

    //  We're adding the filename and the hash to the map for later
    this.map.add(filename, hashedFilename);

    /**
     * Alternative as map, only for linux, unix filesystem
     * Create or update a symbolic link (symlink) with the provided filename
     */
    // const symlinkPath = path.join(this.baseDir, filename);
    // fs.symlinkSync(hashedFilename, symlinkPath);
  }

  private generateHash(data: string) {
    return crypto.createHash("md5").update(data).digest("hex");
  }
}

/**
 * NOTE: We could use database, or any other method to store this map.
 * it's an ultimate solution for every OS, and the most simple,
 * but is not the best so far.
 */
class FileMapper {
  private mapFilePath: string;
  private list: Record<string, string> = {};

  constructor(private readonly baseDir: string, mapFileName = "map.json") {
    this.mapFilePath = path.join(this.baseDir, mapFileName);

    if (fs.existsSync(this.mapFilePath)) {
      const data = fs.readFileSync(this.mapFilePath, "utf-8");
      this.list = JSON.parse(data);
    } else {
      fs.writeFileSync(this.mapFilePath, "{}", { flag: "a" });
    }
  }

  isExists(filename: string) {
    return Object.keys(this.list).includes(filename);
  }
  get(filename: string) {
    if (!this.isExists(filename))
      throw Error(
        `The filename(${filename}) doesn't exists on the list of hash map.`
      );
    return this.list[filename];
  }
  add(filename: string, hash: string) {
    if (this.isExists(filename))
      throw Error(`The filename(${filename}) is already exist.`);

    this.list = { ...this.list, [filename]: hash };
    try {
      fs.writeFileSync(this.mapFilePath, JSON.stringify(this.list, null, 2));
    } catch (err) {
      throw err;
    }
  }

  /**
   * TODO: rest of the general controls like remove, sync, order, ...etc.
   */
}
