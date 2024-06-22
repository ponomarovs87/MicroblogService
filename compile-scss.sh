#!/bin/bash

inputDir="scss"
outputDir="static"

mkdir -p $outputDir

# Обрабатываем каждый файл .scss в директории
for file in $inputDir/*.scss; do
    filename=$(basename -- "$file")
    outputFile="$outputDir/${filename%.scss}.css"

    # Компилируем SCSS в CSS
    sass --no-source-map "$file" "$outputFile"

    echo "Скомпилирован: $file -> $outputFile"
done
