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

//const { fieldProperties } = require("./helpers");

class DoclingFileHandlerSkill {
  static skill_name = "Docling file handler";

  get skill_label() {
    return "Docling file handler";
  }

  constructor(cfg) {
    Object.assign(this, cfg);
  }

  static async configFields() {
    return [
      {
        name: "mode",
        label: "Mode",
        type: "String",
        required: true,
        attributes: {
          options: features.nested_fieldrepeats
            ? ["Preload into system prompt", "Tool"]
            : ["Preload into system prompt"],
        },
      },
      {
        name: "tool_name",
        label: "Tool name",
        type: "String",
        showIf: { mode: "Tool" },
        class: "validate-identifier",
      },
      {
        name: "tool_description",
        label: "Tool description",
        type: "String",
        showIf: { mode: "Tool" },
      },

      {
        name: "sql",
        label: "SQL",
        input_type: "code",
        attributes: { mode: "text/x-sql" },
        sublabel:
          "Refer to query parameters with <code>$1</code>, <code>$2</code> etc",
      },
    ];
  }
  async fileHandler(file) {
    const fnm_lc = file.filename.toLowerCase();
    if (fnm_lc.endsWith("docx")) {
      const raw_out = await run_docling(file.location);
      const md = raw_out.split("---saltcorn-docling-markdown-below---\n")[1];
      return md;
    }
    return false;
  }
}

module.exports = DoclingFileHandlerSkill;
