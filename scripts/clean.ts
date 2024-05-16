import path from "path";
import fs from "fs";

// remove build directories

const root = path.resolve(__dirname, "../");
const packages = path.join(root, "packages");
fs.readdirSync(packages).forEach((name) => {
  const target = path.join(packages, name, "build");
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true });
  }
});
