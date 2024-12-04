const { spawn } = require("child_process");
const envPaths = require("env-paths");
const pyEnvPath = envPaths("saltcorn-docling-env", { suffix: "" }).data;
const fs = require("fs");
const path = require("path");
const asyncSpawn = (cmd, args, opts = { stdio: "inherit" }) => {
  const child = spawn(cmd, args, opts);
  const outs = [];
  return new Promise((resolve, reject) => {
    if (child.stdout) {
      child.stdout.on("data", (data) => {
        outs.push(data);
      });
      child.stderr.on("data", (data) => {
        console.error(data.toString());
      });
    }
    child.on("exit", (exitCode, signal) => {
      if (exitCode === 0) resolve(outs.join(""));
      else reject();
    });
    child.on("error", (msg) => {
      reject(msg);
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

const run_docling = async (src_file) => {
  return await asyncSpawn(
    `${pyEnvPath}/bin/python`,
    [path.join(__dirname, "run_docling.py"), src_file],
    { stdio: "pipe" }
  );
};

module.exports = {
  check_install,
  run_docling,
};
