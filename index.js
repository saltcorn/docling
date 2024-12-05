const Workflow = require("@saltcorn/data/models/workflow");
const Form = require("@saltcorn/data/models/form");
const File = require("@saltcorn/data/models/file");
const Trigger = require("@saltcorn/data/models/trigger");
const { check_install, run_docling } = require("./cmds");
const tmp = require("tmp-promise");
const fsp = require("fs").promises;
const { htmlToText } = require("html-to-text");
const TurndownService = require("turndown");

const blurb = `Installation instructions: please make sure that you have python installed and are able to 
create virtual environments. On Debian/Ubuntu, run <code>sudo apt install python3-venv</code>. <br>Click "Finish" below to start installation if it is not already installed `;

const configuration_workflow = () =>
  new Workflow({
    onDone: async (cfg) => {
      await check_install();
      return cfg;
    },
    steps: [
      {
        name: "Docling installation",
        form: () =>
          new Form({
            blurb,
            formStyle: "vert",
            fields: [],
          }),
      },
    ],
  });

const docling_file_to_markdown = {
  run: async (file) => {
    const file1 = await File.findOne(file);
    const raw_out = await run_docling(file1.location);
    const md = raw_out.split("---saltcorn-docling-markdown-below---\n")[1];
    return md;
  },
  isAsync: true,
  description: "return markdown from HTML",
  arguments: [{ name: "html", type: "HTML" }],
};

const docling_html_to_markdown = {
  run: async (html) => {
    const { path, cleanup } = await tmp.file({ postfix: ".html" });
    await fsp.writeFile(path, html);

    const raw_out = await run_docling(path);

    const md = raw_out.split("---saltcorn-docling-markdown-below---\n")[1];

    await cleanup();
    return md;
  },
  isAsync: true,
  description: "return markdown from HTML",
  arguments: [{ name: "html", type: "HTML" }],
};

const turndown_html_to_markdown = {
  run: (html, opts) => {
    const turndownService = new TurndownService(opts || {});
    return turndownService.turndown(html);
  },
  isAsync: false,
  description: "return markdown from HTML",
  arguments: [{ name: "html", type: "HTML" }],
};

module.exports = {
  sc_plugin_api_version: 1,
  configuration_workflow,
  functions: () => ({
    docling_file_to_markdown,
    docling_html_to_markdown,
    htmlToText,
    turndown_html_to_markdown
  }),
  actions: () => ({
    docling_to_markdown: {
      requireRow: true,
      configFields: ({ table }) => {
        if (table) {
          const fileFields = table.fields
            .filter((f) => f.type === "File")
            .map((f) => f.name);
          const mdFields = table.fields
            .filter(
              (f) => f.type?.name === "String" || f.type?.name === "Markdown"
            )
            .map((f) => f.name);

          return [
            {
              name: "file_field",
              label: "File field",
              sublabel: "Field with the source document",
              type: "String",
              required: true,
              attributes: { options: fileFields },
            },
            {
              name: "md_field",
              label: "Markdown field",
              sublabel: "Output field will be set to markdown content",
              type: "String",
              required: true,
              attributes: { options: mdFields },
            },
          ];
        }
      },
      run: async ({ row, table, configuration: { file_field, md_field } }) => {
        const file = await File.findOne(row[file_field]);
        const raw_out = await run_docling(file.location);
        const md = raw_out.split("---saltcorn-docling-markdown-below---\n")[1];
        await table.updateRow({ [md_field]: md }, row[table.pk_name]);
      },
    },
  }),
};
