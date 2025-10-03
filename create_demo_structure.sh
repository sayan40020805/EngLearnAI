#!/bin/bash

streams=("cse" "ece" "ee" "ce" "aiml" "ds")
subjects=("Mathematics" "Physics" "Chemistry" "English" "Programming Fundamentals")
pdfs=("notes1.pdf" "notes2.pdf" "complete-notes.pdf" "revision-guide.pdf" "study-schedule.pdf" "assignment-tracker.pdf" "exam-checklist.pdf" "formula-sheet.pdf")

for stream in "${streams[@]}"; do
  for sem in {1..8}; do
    for subject in "${subjects[@]}"; do
      mkdir -p "Learning/public/notes/$stream/$sem/$subject"
      for pdf in "${pdfs[@]}"; do
        touch "Learning/public/notes/$stream/$sem/$subject/$pdf"
      done
    done
  done
done

echo "Demo structure created successfully"
