from docling.document_converter import DocumentConverter
import sys

converter = DocumentConverter()
result = converter.convert(sys.argv[1])
print("---saltcorn-docling-markdown-below---")
print(result.document.export_to_markdown())  # output: "### Docling Technical Report[...]"

