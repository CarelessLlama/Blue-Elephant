#!/bin/sh
# This file was adapted from the SE-EDU Brownfield Project: https://github.com/nus-cs2103-AY2324S1/tp
# Checks for prohibited line endings.
# Prohibited line endings: \r\n

git grep --cached -I -n --no-color -P '\r$' -- ':/' |
awk '
    BEGIN {
        FS = ":"
        OFS = ":"
        ret = 0
    }
    {
        ret = 1
        print "ERROR", $1, $2, " prohibited \\r\\n line ending, use \\n instead."
    }
    END {
        exit ret
    }
'