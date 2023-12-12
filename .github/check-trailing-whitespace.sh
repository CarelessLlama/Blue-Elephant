#!/bin/sh
# This file was adapted from the SE-EDU Brownfield Project: https://github.com/nus-cs2103-AY2324S1/tp
# Checks for trailing whitespace

git grep --cached -I -n --no-color -P '[ \t]+$' -- ':/' |
awk '
    BEGIN {
        FS = ":"
        OFS = ":"
        ret = 0
    }
    {
        # Only warn for markdown files (*.md) to accomodate text editors
        # which do not properly handle trailing whitespace.
        # (e.g. GitHub web editor)
        if ($1 ~ /\.md$/) {
            severity = "WARN"
        } else {
            severity = "ERROR"
            ret = 1
        }
        print severity, $1, $2, " trailing whitespace."
    }
    END {
        exit ret
    }
'