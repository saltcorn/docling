const Workflow = require("@saltcorn/data/models/workflow");
const Form = require("@saltcorn/data/models/form");
const Trigger = require("@saltcorn/data/models/trigger");
const { check_install } = require("./install");

const blurb = `Installation instructions: please make sure that you have python installed and are able to 
create virtual environments. On Debian/Ubuntu, run <code>sudo apt install python3-venv</code>`;

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

module.exports = {
  sc_plugin_api_version: 1,
  configuration_workflow,

  actions: () => ({
    mqtt_publish: {
      configFields: [{ name: "channel", label: "Channel", type: "String" }],
      run: async ({ row, configuration: { channel } }) => {},
    },
  }),
};
