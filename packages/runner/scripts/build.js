var shell = require("shelljs");

//var { COMMIT_MESSAGE } = process.env; // from azure-pipelines

// Make any unhandled rejections terminate Node (rather than having it quit with a mere warning)
process.on("unhandledRejection", (error) => {
  throw error;
});

var isWin = process.platform === "win32";
const setName = isWin ? "set" : "export";

var commands = [
  //`${setName} REACT_APP_COMMIT='${COMMIT_MESSAGE}'`,
  `${setName} REACT_APP_LAST_UPDATED='${new Date().toUTCString()}'`,
  "npm run react-scripts-build",
].join(" && ");

shell.exec(commands);
