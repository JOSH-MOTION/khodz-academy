
# Lesson 8 — File Handling

**Khodz Academy — Python Fundamentals for Beginners**
**Session:** 8 of 12 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Explain why programs need to save data permanently.
2. Read from and write to text files.
3. Append data to an existing file without overwriting it.
4. Understand and use basic CSV file handling.
5. Combine file handling with dictionaries to persist structured data.
6. Build a Student Record Storage system that saves data between runs.

---

## 2. Skills Students Will Learn

- The problem of data disappearing when a program ends
- Opening files with `open()` and file modes (`"r"`, `"w"`, `"a"`)
- Reading a file's contents (`.read()`, `.readlines()`)
- Writing and appending to files (`.write()`)
- Using `with open(...)` for safe file handling (automatic closing)
- Introduction to CSV files and the `csv` module
- Saving and loading structured data (e.g., student records) using files

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Lesson 7 + show and tell |
| 0:10–0:20 | The problem: data disappears (Slides 1–2) |
| 0:20–0:45 | Reading and writing files (Slides 3–7) — live coding |
| 0:45–1:00 | Appending data (Slides 8–9) — live coding |
| 1:00–1:15 | CSV introduction (Slides 10–11) — live coding |
| 1:15–1:30 | Building the Student Record Storage system (Slides 12–13) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — The Problem: Data Disappears
**Explanation:** Recall Lesson 7's Student Record System — every time the program stops running, the entire `students` dictionary is lost. To keep data permanently, it needs to be saved to a **file** on disk.
**Instructor notes:** Run yesterday's Student Record System live, add a student, quit, and restart it — let students see the data is gone, making today's motivation concrete and personally felt.

---

### Slide 2 — What Is a File, from a Program's Perspective?
**Explanation:** A file is a named location on disk where a program can write data that persists even after the program stops — the same concept as saving a Word document, just done directly through code.
**Real-world example:** Recall Frontend Foundations/React students' use of `localStorage` for persistence in the browser — files serve the same *purpose* in a standalone Python program: saving data between runs.
**Instructor notes:** If any students have taken Khodz Academy's web development courses, this cross-course connection helps anchor the concept in something already familiar.

---

### Slide 3 — Opening a File
**Explanation:** `open(filename, mode)` opens a file for a specific purpose: `"r"` (read), `"w"` (write, overwrites existing content), `"a"` (append, adds to the end).
**Code example:**
```python
file = open("notes.txt", "w")
file.write("Hello, this is my first file!")
file.close()
```
**Instructor notes:** Run this and then open the actual `notes.txt` file in VS Code's file explorer to show the real file that was created — makes the abstract concept tangible immediately.

---

### Slide 4 — Why Closing Files Matters
**Explanation:** Forgetting `.close()` can cause data not to be saved properly, or the file to remain "locked" by the program — a real, common bug.
**Instructor notes:** Keep this brief — just enough motivation before introducing the safer alternative on the next slide.

---

### Slide 5 — The with Statement: Safer File Handling
**Explanation:** `with open(...) as file:` automatically closes the file when the block finishes, even if an error occurs — the recommended, professional way to handle files in Python.
**Code example:**
```python
with open("notes.txt", "w") as file:
    file.write("Hello, this is my first file!")
# file is automatically closed here, even without calling .close()
```
**Instructor notes:** Present this as the standard practice going forward — all remaining examples today should use `with`, establishing it as the default habit rather than an optional alternative.

---

### Slide 6 — Reading a File's Contents
**Code example:**
```python
with open("notes.txt", "r") as file:
    content = file.read()
    print(content)
```
**Instructor notes:** Trigger a `FileNotFoundError` live by reading a file that doesn't exist — a very common real error students will encounter, worth seeing and reading calmly before it happens to them unexpectedly.

---

### Slide 7 — Reading a File Line by Line
**Explanation:** `.readlines()` returns each line as a separate string in a list — useful when a file contains multiple structured entries (e.g., one student per line).
**Code example:**
```python
with open("notes.txt", "r") as file:
    lines = file.readlines()
    for line in lines:
        print(line.strip())  # .strip() removes the trailing newline character
```
**Instructor notes:** Point out `.strip()` here directly recaps Lesson 2's string methods — explain *why* it's needed (each line includes an invisible `\n` newline character at the end, which `.strip()` removes cleanly).

---

### Slide 8 — Writing Overwrites; Appending Adds
**Explanation:** Opening a file in `"w"` mode erases its existing contents before writing — a common and sometimes costly mistake if unintended. `"a"` mode adds new content to the end without erasing what's already there.
**Code example:**
```python
# ⚠️ This ERASES the file first, then writes:
with open("notes.txt", "w") as file:
    file.write("New content only.\n")

# ✅ This ADDS to the existing file:
with open("notes.txt", "a") as file:
    file.write("Additional line.\n")
```
**Instructor notes:** Demonstrate both live, side by side, opening the resulting file each time — make the destructive nature of `"w"` mode unmistakably clear through direct observation, since this is a genuinely consequential mistake in real use.

---

### Slide 9 — Building a Simple Append-Only Log
**Explanation:** Combine `"a"` mode with a loop-based program to build a running log — e.g., recording every calculation a user performs.
**Code example:**
```python
with open("history.txt", "a") as file:
    file.write(f"{num1} + {num2} = {num1 + num2}\n")
```
**Instructor notes:** Connect this directly to the Lesson 5 Scientific Calculator's optional "history" stretch goal — "this is exactly how you'd make that history persist between runs, instead of disappearing when the program closes."

---

### Slide 10 — Introduction to CSV Files
**Explanation:** CSV (Comma-Separated Values) is a simple, widely-used format for storing tabular data (rows and columns) as plain text — one row per line, values separated by commas. Python's built-in `csv` module makes reading/writing CSVs easier and more reliable than manual string splitting.
**Code example:**
```
name,age,grade
Amaka,24,A
Tunde,22,B
```
**Instructor notes:** Show a CSV file opened both in VS Code (as plain text) and in a spreadsheet program (if available) — helps students see it's simultaneously a plain text file and structured tabular data, a genuinely useful dual nature.

---

### Slide 11 — Reading and Writing CSV Files
**Code example:**
```python
import csv

# Writing a CSV file
with open("students.csv", "w", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["name", "age", "grade"])
    writer.writerow(["Amaka", 24, "A"])
    writer.writerow(["Tunde", 22, "B"])

# Reading a CSV file
with open("students.csv", "r") as file:
    reader = csv.reader(file)
    for row in reader:
        print(row)
```
**Instructor notes:** Flag `import csv` here as a direct, concrete preview of Lesson 10's modules lesson — "this is what a module actually looks like in practice, a full lesson on this concept is coming very soon."

---

### Slide 12 — Combining Dictionaries with File Storage
**Explanation:** Recall Lesson 7's Student Record System dictionary — combine it with today's file skills to save records to a CSV file, and load them back when the program starts.
**Instructor notes:** This is today's key synthesis moment — explicitly connect back to yesterday's in-memory-only system and today's persistence fix.

---

### Slide 13 — Building the Student Record Storage System
**Code example:**
```python
import csv
import os

FILENAME = "students.csv"

def load_students():
    students = {}
    if os.path.exists(FILENAME):
        with open(FILENAME, "r") as file:
            reader = csv.reader(file)
            for row in reader:
                student_id, name, grade = row
                students[student_id] = {"name": name, "grade": grade}
    return students

def save_students(students):
    with open(FILENAME, "w", newline="") as file:
        writer = csv.writer(file)
        for student_id, details in students.items():
            writer.writerow([student_id, details["name"], details["grade"]])

students = load_students()

while True:
    print("\n1. Add student  2. View all  3. Save & Quit")
    choice = input("Choose an option: ")

    if choice == "1":
        student_id = input("Enter student ID: ")
        name = input("Enter name: ")
        grade = input("Enter grade: ")
        students[student_id] = {"name": name, "grade": grade}
    elif choice == "2":
        for student_id, details in students.items():
            print(f"{student_id}: {details['name']}, Grade {details['grade']}")
    elif choice == "3":
        save_students(students)
        print("Saved. Goodbye!")
        break
```
**Instructor notes:** Flag `import os` and `os.path.exists()` as another direct preview of Lesson 10 — "checking whether a file already exists before trying to read it." Build incrementally: get `save_students` working and verified first (check the actual CSV file), then build `load_students`, then wire up the menu. Test the full cycle by adding a student, quitting, and restarting the program to prove data now genuinely persists — the emotional payoff of the whole lesson.

---

## 5. Practical Exercises During Class

1. **Write/read drill:** Students write 3 lines to a text file, then read and print them back.
2. **Append drill:** Students demonstrate the difference between `"w"` and `"a"` mode by running the same write operation twice with each mode and comparing results.
3. **CSV drill:** Students write a small CSV file with 3 rows of data and read it back, printing each row.
4. **Full build-along:** Every student builds the Student Record Storage system with the instructor, verifying persistence by restarting their program.

---

## 6. Homework Assignment

Build a **Daily Journal App**: a program that lets the user write a journal entry, which gets appended (with today's date, using a simple hardcoded date or the `datetime` module previewed briefly) to a `journal.txt` file, and offers an option to read back all past entries.

---

## 7. Mini Project — Student Record Storage

**Brief:** "Upgrade your Student Record System so records persist between runs, saved to a CSV file."

**Requirements:**
- Uses `csv` module to read and write student records
- `load_students()` function that reads existing data on startup (handling the case where the file doesn't exist yet)
- `save_students()` function that writes current data to the file
- Menu loop offering add, view all, and save & quit options
- Verified working: data added in one run is still present after restarting the program

**Stretch goal:** Add a "delete student" option that removes a record and re-saves the file correctly.

---

## 8. Common Beginner Mistakes

- Opening a file in `"w"` mode when `"a"` (append) was intended, accidentally erasing existing data.
- Forgetting `.close()` when not using `with`, or forgetting `with` altogether.
- Trying to read a file that doesn't exist, causing a `FileNotFoundError` (fixed with `os.path.exists()` checks, as shown in Slide 13).
- Forgetting `newline=""` when writing CSV files (can cause extra blank lines on some systems).
- Forgetting `.strip()` when reading lines, leaving stray `\n` characters in the data.
- Mismatched row structure when reading CSV data back into a dictionary (e.g., assuming a fixed number of columns that doesn't match what was actually written).

---

## 9. Extra Resources

- [Python Docs — Reading and Writing Files](https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files)
- [Python Docs — csv Module](https://docs.python.org/3/library/csv.html)
- [Python Docs — os.path Module](https://docs.python.org/3/library/os.path.html)
- [W3Schools — Python File Handling](https://www.w3schools.com/python/python_file_handling.asp)
