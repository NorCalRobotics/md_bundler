#!/usr/bin/env python3
import os
import sys
import subprocess


def main():
    # Extract optional document title from first argument; default to "Archive" if omitted
    title = sys.argv[1] if len(sys.argv) > 1 else "Archive"
    
    # Open output Markdown file for writing
    with open("archive.md", "w") as output_file:
        # Write primary title header and separator line
        output_file.write(" # " + title + "\n---\n\n")
        
        # Iterate over each file path passed in command line arguments
        for filename in sys.argv[2:]:

            md_code_type = ""
            # Inspect file MIME type using system 'file' command
            mime_type = subprocess.check_output(['file', '-b', '--mime-type', filename]).decode().strip()
            
            # Extract language tag by stripping known MIME type prefixes
            for prefix in "text/x-script.", "application/":
                if mime_type.startswith(prefix):
                    md_code_type = mime_type[len(prefix):]

            # Normalize C++ language identifier for Markdown syntax highlighting
            if md_code_type == "c++":
                md_code_type = "cpp"

            # Write file header and open four-backtick code fence
            output_file.write(" ## " + filename + "\n````" + md_code_type + "\n")
            line = ''
            
            # Read source file content line by line with UTF-8 encoding (replacing invalid bytes)
            with open(filename, "r", encoding="utf-8", errors="replace") as source_file:
                for line in source_file:
                    output_file.write(line)
            
            # Ensure proper trailing newline before closing code fence
            if not line.endswith("\n"):
                output_file.write("\n")
                
            # Close code fence
            output_file.write("````\n")


if __name__ == "__main__":
    main()
