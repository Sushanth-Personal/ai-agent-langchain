import fs from "fs/promises";
import path from "path";

const filePath = path.resolve("user.json");

export const readMemory = async () => {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

export const writeMemory = async (data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Failed to write chat memory:", err);
  }
};
