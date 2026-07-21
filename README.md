# md_bundler Code-to-Markdown Archiver

A lightweight Python utility that concatenates multiple source code files into a single structured Markdown document (archive.md) with syntax highlighting based on MIME type detection.

## Primary Use Case: Providing LLM Context

While this utility can be used for general code archiving, its primary purpose is to **bundle codebase files into a single document to attach to LLMs (Large Language Models)**. 

When working with AI assistants on complex projects, uploading multiple individual files can be tedious or restricted by file-upload limits. By consolidating your relevant source files, configs, and scripts into a single, cleanly formatted `archive.md` file, you can easily provide an LLM with broader, multi-file context for better code reviews, debugging, and feature development.

## Key Features

- Automated Language Detection: Uses the system's native 'file' command to inspect MIME types and automatically determine the appropriate Markdown language tag for syntax highlighting.
- Custom Document Titles: Accepts a custom title as the first command-line argument (defaults to 'Archive' if omitted).
- Safe Code Fencing: Uses 4-backtick blocks so inner code containing 3-backtick Markdown fences will not break formatting.
- Safe UTF-8 Encoding: Reads source files with standard UTF-8 encoding and gracefully replaces decoding errors to ensure non-breaking script execution.

## Requirements

- Python 3.x
- Unix/Linux Environment (or macOS/WSL) with the system utility 'file' installed and accessible in PATH.

## Usage

### Syntax

python md_archiver.py [Title] [file1] [file2] ...

### Examples

#### Preparing Files for LLM Analysis
Combine core source files to attach to an AI prompt:
python md_archiver.py "Project Context for LLM" main.py utils.py config.json

#### Archiving Entire Directory Patterns
Specify a title and use wildcards:
python md_archiver.py "API Refactor Context" src/*.py

## How It Works

1. Title Initialization: Reads first command-line argument as the primary heading. If not supplied, defaults to 'Archive'.
2. File Processing Loop: Iterates through each file path passed in remaining command-line arguments.
3. MIME Type Inspection: Invokes `file -b --mime-type <filename>` via Python's subprocess module to inspect the file format.
4. Language Tag Mapping: Strips `text/x-script.` or `application/` prefixes to isolate language identifiers (e.g., mapping 'c++' to 'cpp').
5. Markdown Writing: Appends a secondary header (## filename), opens a code block, appends file contents, and closes the code block cleanly.

## License

This project is open-source and available under the MIT License.
