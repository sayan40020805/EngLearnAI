#!/bin/bash

streams=("cse" "ece" "ee" "ce" "aiml" "ds")
subjects=("Mathematics" "Physics" "Chemistry" "English" "Programming Fundamentals")
pdfs=("notes1.pdf" "notes2.pdf" "complete-notes.pdf" "revision-guide.pdf" "study-schedule.pdf" "assignment-tracker.pdf" "exam-checklist.pdf" "formula-sheet.pdf")

get_stream_name() {
  case $1 in
    cse) echo "Computer Science Engineering" ;;
    ece) echo "Electronics & Communication Engineering" ;;
    ee) echo "Electrical Engineering" ;;
    ce) echo "Civil Engineering" ;;
    aiml) echo "Artificial Intelligence & Machine Learning" ;;
    ds) echo "Data Science" ;;
    *) echo "Unknown Stream" ;;
  esac
}

get_pdf_type() {
  case $1 in
    notes1.pdf|notes2.pdf|complete-notes.pdf|revision-guide.pdf) echo "Notes" ;;
    *) echo "Organizer" ;;
  esac
}

for stream in "${streams[@]}"; do
  stream_name=$(get_stream_name $stream)
  for sem in {1..8}; do
    for subject in "${subjects[@]}"; do
      for pdf in "${pdfs[@]}"; do
        pdf_type=$(get_pdf_type $pdf)
        html_content="<html><head><title>$pdf_type for $subject</title></head><body><h1>$pdf_type for $subject</h1><p>This is a demo $pdf_type PDF for $subject in $stream_name, Semester $sem.</p><p>Stream: $stream_name</p><p>Semester: $sem</p><p>Subject: $subject</p><p>File: $pdf</p></body></html>"
        echo "$html_content" > temp.html
        wkhtmltopdf temp.html "Learning/public/notes/$stream/$sem/$subject/$pdf"
      done
    done
  done
done

rm temp.html
echo "Demo PDFs generated successfully"
