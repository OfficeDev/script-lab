const fs = require("fs");
const path = require("path");

const manifestDirectory = "./manifests";
const shareDirectory = "C:/manifests";

const manifests = fs
  .readdirSync(manifestDirectory)
  .filter(
    (file) =>
      file.endsWith(".xml") &&
      ["localhost", "internal", "production"].reduce(
        (acc, name) => acc || file.startsWith(name),
        false,
      ),
  );

function getManifestPrefix(data) {
  const displayName = data.split(`<DisplayName DefaultValue="`)[1].split(`"`)[0];
  let prefix = displayName.toLowerCase();

  prefix = ["local", "internal"].reduce((acc, name) => {
    return acc.replace(`(${name})`, "").replace(`[${name}]`, "");
  }, prefix);

  prefix = prefix
    .trim()
    .split(" ")
    .join("-");
  return prefix;
}

manifests.forEach((file) => {
  const source = path.join(manifestDirectory, file);

  const data = fs.readFileSync(source, { encoding: "utf-8" });

  const uniquePrefix = getManifestPrefix(data);
  const name = `${uniquePrefix}.${file}`;
  const destination = path.join(shareDirectory, name);
  console.log(`${name}\n\t${source} -> ${destination}`);

  fs.writeFileSync(destination, data);
});
