#!/bin/bash

# Defining directories to be processed
declare -a arr=("docs/Technical-docs/interfaces" "docs/Technical-docs/modules")

# Loop through each directory
for dir in "${arr[@]}"
do
    for file in "$dir"/*.md
    do
        # Read the title from the third line of the file
        line=$(sed -n '3p' < "$file")
        # Split the line by ':' and get the second part
        title=$(echo $line | cut -d':' -f2-)
        # Remove leading and trailing spaces
        title=$(echo $title | xargs)

        # Only add title if it is not an empty string
        if [[ -n $title ]]
        then
            # Create a temporary file with the correct front matter
            echo -e "---\ntitle: ${title}\n---\n$(cat "$file")" > temp.md
            # Overwrite the original file with the temporary file
            mv temp.md "$file"
        fi
    done
done
