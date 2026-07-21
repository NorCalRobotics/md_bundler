import os
import sys
import subprocess

def main():
    title = sys.argv[1] if len(sys.argv) > 1 else "Archive"
    with open("archive.md", "w") as output_file:
        output_file.write(" # " + title + "\n---\n\n")
        for filename in sys.argv[2:]:

            md_code_type = ""
            mime_type = subprocess.check_output(['file', '-b', '--mime-type', filename]).decode().strip()
            for prefix in "text/x-script.", "application/":
                if mime_type.startswith(prefix):
                    md_code_type = mime_type[len(prefix):]

            if md_code_type == "c++":
                md_code_type = "cpp"

            output_file.write(" ## " + filename + "\n````" + md_code_type + "\n")
            line = ''
            with open(filename, "r", encoding="utf-8", errors="replace") as source_file:
                for line in source_file:
                    output_file.write(line)
            if not line.endswith("\n"):
                output_file.write("\n")
            output_file.write("````\n")

if __name__ == "__main__":
    main()
