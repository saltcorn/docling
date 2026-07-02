const { div, pre, a } = require("@saltcorn/markup/tags");
const Workflow = require("@saltcorn/data/models/workflow");
const Form = require("@saltcorn/data/models/form");
const Table = require("@saltcorn/data/models/table");
const View = require("@saltcorn/data/models/view");
const Trigger = require("@saltcorn/data/models/trigger");
const FieldRepeat = require("@saltcorn/data/models/fieldrepeat");
const { getState } = require("@saltcorn/data/db/state");
const db = require("@saltcorn/data/db");
const { eval_expression } = require("@saltcorn/data/models/expression");
const { interpolate } = require("@saltcorn/data/utils");
const { features } = require("@saltcorn/data/db/state");
const { run_docling } = require("./cmds");
const path = require("path");
//const { fieldProperties } = require("./helpers");

const formats = [
  "docx",
  "html",
  "pptx",
  "xlsx",
  "epub",
  "odt",
  "ods",
  "odp",
  "csv",
  "pdf",
];

class DoclingFileHandlerSkill {
  static skill_name = "Docling file handler";

  get skill_label() {
    return "Docling file handler";
  }

  constructor(cfg) {
    Object.assign(this, cfg);
  }

  static async configFields() {
    return formats.map((format) => ({
      name: format,
      label: "." + format,
      type: "Bool",
      default: true,
    }));
  }
  async fileHandler({ file }) {
    const ext = path.extname(file.filename.toLowerCase()).slice(1);

    if (formats.includes(ext) && this[ext]) {
      const raw_out = await run_docling(file.location);
      const md = raw_out.split("---saltcorn-docling-markdown-below---\n")[1];
      return md;
    }
    return false;
  }
}

module.exports = DoclingFileHandlerSkill;
