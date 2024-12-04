const { spawn } = require("child_process");
const envPaths = require("env-paths");
const pyEnvPath = envPaths("saltcorn-docling-env", { suffix: "" }).data;
const fs = require("fs");

const asyncSpawn = (cmd, args, opts = { stdio: "inherit" }) => {
  const child = spawn(cmd, args, opts);
  return new Promise((resolve, reject) => {
    child.on("exit", (exitCode, signal) => {
      if (exitCode === 0) resolve();
      else reject();
    });
  });
};

const check_install = async () => {
  if (!fs.existsSync(pyEnvPath)) {
    console.log("installing docling env in", pyEnvPath);

    await asyncSpawn("python", ["-m", "venv", pyEnvPath]);
    await asyncSpawn(`${pyEnvPath}/bin/pip`, ["install", "docling"]);
  }
};

module.exports = {
  check_install,
};
