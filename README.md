# Markdown Archiver

A local, browser-based utility for bundling selected files into a single Markdown archive for prompts, code reviews, and context sharing. The app runs entirely in the browser.

## What the new UI does

The interface provides a simple workflow for creating an archive from local files:

- Enter an archive title
- Choose one or more files from your machine
- Review the selected files in the list
- Build a downloadable Markdown document
- Clear the selection and start over when needed

## Key Features

- Plain JavaScript implementation with no command-line dependency
- Local in-browser file selection using the File API
- Automatic language-tag inference for common source and config files
- Downloadable Markdown output as archive.md
- Lightweight preview of the generated archive

## How to Use

1. Open index.html in a browser.
2. Enter a title for the archive.
3. Select the files you want to bundle.
4. Click Build Archive.
5. Download the generated archive or review the preview.

## Project Files

- index.html: the main app layout and UI shell
- styles.css: visual styling for the interface
- app.js: file selection, archive generation, and download logic

## Use Case

This tool is especially useful when preparing a compact, structured set of files to attach to an LLM prompt or share with collaborators in one document.

## License

This project is open-source and available under the MIT License.
