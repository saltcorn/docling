# docling
Convert document files (PDF, DOCX, PPTX) to Markdown

This module provides an Saltcorn action that uses docling to convert files (PDF, .docx word documents and more) to markdown. 

### Installation

Before the actions can run the module needs to install docling in a new python virtual environment. Please make sure your server is able to create virtual environments. On Debian/Ubuntu this can be done by installing the python3-venv systems package. 

In order to install the virtual environment, configure the Saltcorn docling module. You will see a short message about this installation requirement and then click finish to perform the actual installation. 

### Manual installation

This module will look for a working python venv with docling installed in the saltcorn-docling-env direcotry inside the XDG data directory.
On Debain/Ubuntu this resolves to `$HOME/.local/share/saltcorn-docling-env` where `$HOME` is the home directory of the 
user running Saltcorn. You can check by running `systemd-path user-shared`. To create this manually (i.e. without configuring the module through the 
Saltcorn UI), run these commands:

```
python -m venv $HOME/.local/share/saltcorn-docling-env
$HOME/.local/share/saltcorn-docling-env/bin/pip install docling
```

### Action Usage

To use this module, create a table that has a file field (which will contain the source documents) and a string or markdown field (which will be set to the output of the source documents in markdown format). The link the action `docling_to_markdown` to a button or to a table trigger on this table. In the configuration for this action you should choose the appropriate fields. Running the action will then perform the conversion and set the contents of the string or markdown field.

### Functions usage

The module also provides two functions `docling_file_to_markdown` and `docling_html_to_markdown` which each take a single argument and return a markdown string.

docling_file_to_markdown takes a string containing a file path in your file store and produces markdown

docling_html_to_markdown takes a string containing HTML (this should be a full document with DOCTYPE) and produces markdown.

This module also export two other functions to generate text from HTML:

The function `htmlToText` which is the `htmlToText`
(alias for `convert`) from the [html-to-text module](https://www.npmjs.com/package/html-to-text). This generates text (not markdown) froma single argument which is an html string.

The function `turndown_html_to_markdown` uses the [turndown](https://www.npmjs.com/package/turndown) module to generate markdown from HTML. It takes two arguments, the first is an HTML string, and the second is optional, an object with the [turndown options](https://github.com/mixmark-io/turndown?tab=readme-ov-file#options)

Example for run_js_code action:
```
const md = turndown_html_to_markdown(`<h1>Hello</h1>world`)
console.log(md)
```