
# Lesson 1 — Getting Started with Python

**Khodz Academy — Python Fundamentals for Beginners**
**Session:** 1 of 12 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Explain what programming is and why Python is a strong first language.
2. Install Python and set up VS Code for Python development.
3. Write, save, and run a Python program.
4. Use comments to document code.
5. Create variables following Python naming conventions.
6. Identify Python's core data types.
7. Get input from a user and display output.

---

## 2. Skills Students Will Learn

- What programming is, and how a computer executes instructions
- Why Python specifically, and where it's used in the real world
- Installing Python and verifying the installation
- Setting up VS Code with the Python extension
- Running a `.py` file
- Writing comments (`#`)
- Variables and assignment (`=`)
- Python naming conventions (`snake_case`, descriptive names, case sensitivity)
- Core data types: `int`, `float`, `str`, `bool`
- `print()` for output, `input()` for user input

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:15 | Welcome, course overview, what students will build (Slides 1–2) |
| 0:15–0:30 | What is programming? Why Python? (Slides 3–5) |
| 0:30–0:50 | Installing Python + VS Code setup (Slides 6–8) — hands-on |
| 0:50–1:05 | First program, comments (Slides 9–10) — live coding |
| 1:05–1:25 | Variables, naming conventions, data types (Slides 11–14) — live coding |
| 1:25–1:30 | Input/output preview, recap, Q&A (Slide 15) |

*(Full input/output depth continues into the mini project; Lesson 2 goes further into working with data.)*

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Welcome to Python Fundamentals
**Explanation:** Introduce the course: 4 weeks, 12 lessons, building a portfolio of console applications, ending with a self-chosen capstone. Explicitly frame this as the foundation for Khodz Academy's future Machine Learning, AI Engineering, Backend Development, and Automation courses.
**Visual suggestion:** Khodz Academy roadmap graphic showing this course as the entry point into multiple future tracks.
**Instructor notes:** Set a warm, low-pressure tone — many true beginners carry real anxiety about "not being technical." Reassure them explicitly that zero prior experience is assumed and expected.

---

### Slide 2 — What You'll Build This Month
**Explanation:** Preview the 13+ projects across the course, ending with a self-chosen capstone (Student Management System, Expense Tracker, Quiz App, Library Management System, or Inventory Management System).
**Instructor notes:** Motivational framing — a believable, concrete path from "never coded before" to "built a portfolio of working programs."

---

### Slide 3 — What Is Programming?
**Explanation:** Programming is giving a computer precise, step-by-step instructions to solve a problem or perform a task. Computers do exactly what they're told — no more, no less — which is why precision and clear thinking matter more than memorization.
**Real-world example:** A recipe: precise steps, in order, with exact ingredients — a program is very similar, just written in a language a computer understands.
**Instructor notes:** This analogy is worth returning to throughout the course — loops become "repeat this step until done," conditionals become "if this ingredient is missing, do this instead."

---

### Slide 4 — Why Python?
**Explanation:** Python reads almost like plain English, making it one of the most beginner-friendly languages to start with, while still being powerful enough to power real, large-scale software.
**Instructor notes:** Contrast lightly with more syntax-heavy languages (without naming them negatively) — the point is Python minimizes "fighting the syntax" so beginners can focus on learning to think like a programmer.

---

### Slide 5 — Real-World Uses of Python
**Explanation:** Python powers web backends (Instagram, Spotify), data science and analytics, machine learning and AI (most AI research and tooling is built in Python), automation/scripting, and more.
**Real-world example:** Name a few concrete, recognizable examples: Instagram's backend, NASA's data analysis tools, ChatGPT-style AI systems built and trained largely with Python tooling.
**Instructor notes:** This is a deliberate motivation slide — connect directly to Khodz Academy's future ML/AI Engineering courses, so students see today's first line of code as a real first step toward those goals.

---

### Slide 6 — Installing Python
**Explanation:** Download and install Python 3 from the official website. On Windows, check "Add Python to PATH" during installation — this makes Python runnable from any terminal location.
**Instructor notes:** Do this live, step by step, screen-shared. This checkbox is the single most common source of "python is not recognized" errors — call it out explicitly and verify every student's installation before moving on.

---

### Slide 7 — Verifying the Installation
**Code example:**
```bash
python --version
# or, on some systems:
python3 --version
```
**Instructor notes:** Confirm every student sees a version number before proceeding — today's most critical checkpoint.

---

### Slide 8 — Setting Up VS Code
**Explanation:** Install VS Code (if needed) and the official "Python" extension from Microsoft — provides syntax highlighting, autocomplete, and a built-in "Run" button.
**Instructor notes:** Show the green "Run Python File" play button that appears once the extension is installed — a friendly, low-friction way for true beginners to run code without memorizing terminal commands on day one.

---

### Slide 9 — Your First Python Program
**Code example:**
```python
print("Hello, Khodz Academy!")
```
**Instructor notes:** Have every student create `hello.py`, type this line, and run it successfully before moving on. This is the course's "first win" moment — let it land before rushing forward.

---

### Slide 10 — Comments: Notes for Humans
**Explanation:** A comment (`#`) is ignored by Python entirely — it exists purely to explain code to humans reading it later, including your future self.
**Code example:**
```python
# This program greets the user
print("Hello, Khodz Academy!")  # This line prints a greeting
```
**Instructor notes:** Frame comments as a professional habit, not busywork — code you write today will be read by you (or a client, or a teammate) weeks later with no memory of the details.

---

### Slide 11 — Variables: Storing Information
**Explanation:** A variable is a named container for a value. Python uses `=` for assignment — no special keyword needed.
**Code example:**
```python
name = "Amaka"
age = 24
```
**Real-world example:** A labeled box — the label (variable name) lets you find what's inside (the value) later.
**Instructor notes:** Emphasize Python's simplicity here — no type declarations required, part of why Python is considered highly beginner-friendly.

---

### Slide 12 — Naming Conventions
**Explanation:** Python variable names use `snake_case` (lowercase words separated by underscores), must start with a letter or underscore (not a number), are case-sensitive, and should be descriptive.
**Code example:**
```python
# ✅ Good
student_name = "Amaka"
total_score = 85

# ❌ Avoid
x = "Amaka"        # not descriptive
StudentName = "Amaka"  # not Python convention (this is used for classes instead)
2ndPlace = "Tunde"     # ❌ invalid — cannot start with a number
```
**Instructor notes:** Frame good naming as a professional habit that pays off immediately — code becomes self-explanatory, reducing the need for excessive comments.

---

### Slide 13 — Core Data Types
**Explanation:** `int` (whole numbers), `float` (decimal numbers), `str` (text, in quotes), `bool` (`True`/`False`).
**Code example:**
```python
age = 24              # int
price = 19.99          # float
name = "Amaka"          # str
is_student = True       # bool
```
**Instructor notes:** Introduce `type()` here as a quick way to check any value's type — a tool used constantly for the rest of the course.
```python
print(type(age))  # <class 'int'>
```

---

### Slide 14 — Output with print()
**Explanation:** `print()` displays text/values in the terminal — the primary way a console program communicates with its user.
**Code example:**
```python
name = "Amaka"
age = 24
print("Name:", name, "Age:", age)
```
**Instructor notes:** Show that `print()` accepts multiple comma-separated values, automatically adding spaces between them.

---

### Slide 15 — Input with input(), Recap, and What's Next
**Explanation:** `input()` pauses the program and waits for the user to type something, always returning it as a string (`str`) — even if the user types a number. Recap: programming and Python basics, installation, first program, comments, variables, naming conventions, data types, and output. Preview: Lesson 2 covers numbers, strings, booleans, operators, type conversion, and string formatting in depth — building a Student Information System.
**Code example:**
```python
name = input("What is your name? ")
print("Hello, " + name + "!")
```
**Instructor notes:** Run this live and let students type into their own terminal for the first time — a genuinely exciting first-interactivity moment. Flag that `input()` always returns a string as a preview hook for Lesson 2's type conversion lesson.

---

## 5. Practical Exercises During Class

1. **Setup checkpoint:** Every student installs Python and VS Code, and runs `hello.py` successfully.
2. **Comment drill:** Students add a comment above each line of a short script explaining what it does.
3. **Variable and naming drill:** Students create 4 well-named variables (one of each core type) and print them all with labels.
4. **Input drill:** Students write a script that asks for their name and favorite color, then prints a personalized sentence.

---

## 6. Homework Assignment

Build the **Student Bio Program**: a script that asks for a student's name, age, and favorite subject using `input()`, stores them in well-named variables, and prints a short bio paragraph combining all three using `print()`.

---

## 7. Mini Project — Personal Information App

**Brief:** "Build a simple program that collects basic information about a user and displays it back to them in a friendly summary."

**Requirements:**
- Uses `input()` to collect at least 4 pieces of information (e.g., name, age, city, favorite hobby)
- Stores each in a clearly, correctly named variable
- Uses at least one comment explaining what the program does
- Uses `print()` to display a friendly summary combining all the information
- Runs without errors

**Stretch goal:** Use `type()` to print the data type of each piece of information collected, and add a comment noting which type surprised you (hint: think about what `input()` always returns).

---

## 8. Common Beginner Mistakes

- Forgetting to check "Add Python to PATH" during installation, causing "python is not recognized" errors.
- Mismatched quotes (`"text'`) or missing quotes around strings.
- Using non-descriptive variable names (`x`, `a`, `temp`) that make code hard to read later.
- Violating naming conventions (starting a variable with a number, using spaces in names).
- Forgetting that `input()` always returns a string, leading to confusion later when trying to do math with it (fully addressed in Lesson 2).
- Running the wrong file, or saving changes but forgetting to re-run the script before checking results.
- Indentation mistakes (Python uses indentation meaningfully — even a stray space can cause an error; briefly flagged now, covered in depth once conditionals are introduced in Lesson 3).

---

## 9. Extra Resources

- [Python.org — Official Downloads](https://www.python.org/downloads/)
- [VS Code — Python Extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python)
- [Python Official Docs — The Python Tutorial](https://docs.python.org/3/tutorial/)
- [PEP 8 — Python's Official Style Guide (naming conventions)](https://peps.python.org/pep-0008/)
