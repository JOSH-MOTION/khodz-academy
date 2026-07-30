
# Lesson 10 — Modules & Packages

**Khodz Academy — Python Fundamentals for Beginners**
**Session:** 10 of 12 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Explain what a module is and why Python's standard library is valuable.
2. Import and use modules in different ways.
3. Use the `random` module for randomness.
4. Use the `math` module for mathematical operations.
5. Use the `datetime` module for working with dates and times.
6. Use the `os` module for basic file/system interaction.
7. Build a Random Password Generator.

---

## 2. Skills Students Will Learn

- What a module is, and the difference between the standard library and third-party packages
- `import module_name`
- `from module_name import specific_thing`
- Import aliases (`import module_name as alias`)
- The `random` module: `randint()`, `choice()`, `shuffle()`
- The `math` module: `sqrt()`, `floor()`, `ceil()`, `pi`
- The `datetime` module: getting the current date/time, basic formatting
- The `os` module: checking file existence, listing directory contents (recap Lesson 8's brief preview, now formalized)

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Lesson 9 + show and tell |
| 0:10–0:20 | What is a module? (Slides 1–3) |
| 0:20–0:35 | The random module (Slides 4–6) — live coding |
| 0:35–0:50 | The math module (Slides 7–8) — live coding |
| 0:50–1:05 | The datetime module (Slides 9–10) — live coding |
| 1:05–1:15 | The os module (Slide 11) — live coding |
| 1:15–1:30 | Building the Password Generator (Slides 12–13) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — What Is a Module?
**Explanation:** A module is a file containing pre-written Python code (functions, values) that can be reused in your own programs via `import` — instead of writing everything from scratch, you borrow well-tested tools other developers (including Python's own creators) have already built.
**Real-world example:** Recall Lesson 4's `import random` (used to generate the Number Guessing Game's secret number) and Lesson 8's `import csv`/`import os` — both previews of today's proper, in-depth treatment.
**Instructor notes:** Point out explicitly that students have already been using modules for two lessons without a full explanation — today closes that loop, which tends to feel satisfying rather than redundant.

---

### Slide 2 — The Standard Library vs. Third-Party Packages
**Explanation:** The **standard library** ships with Python itself (`random`, `math`, `datetime`, `os`, `csv`) — no installation needed. **Third-party packages** (like `requests`, used next lesson) must be installed separately using `pip`.
**Code example:**
```bash
pip install requests
```
**Instructor notes:** Keep this distinction crisp — students will need it immediately in Lesson 11 when installing `requests` for the first time.

---

### Slide 3 — Different Ways to Import
**Explanation:** `import module` gives access to everything via `module.thing`. `from module import thing` imports just one specific piece directly. `import module as alias` gives it a shorter name.
**Code example:**
```python
import random
print(random.randint(1, 10))

from random import randint
print(randint(1, 10))  # no "random." prefix needed

import datetime as dt
print(dt.date.today())
```
**Instructor notes:** Show all three side by side — clarify there's no single "correct" style; the choice depends on readability preference and how much of a module is actually used.

---

### Slide 4 — The random Module: randint and choice
**Explanation:** `random.randint(a, b)` picks a random whole number between `a` and `b` (recap Lesson 4). `random.choice(sequence)` picks one random item from a list.
**Code example:**
```python
import random

print(random.randint(1, 100))
colors = ["red", "green", "blue", "yellow"]
print(random.choice(colors))
```
**Instructor notes:** Directly formalize Lesson 4's `random.randint()` "recipe ingredient" preview — now given full, proper explanation.

---

### Slide 5 — The random Module: shuffle and sample
**Code example:**
```python
import random

cards = ["Ace", "King", "Queen", "Jack"]
random.shuffle(cards)
print(cards)

lottery_numbers = random.sample(range(1, 50), 6)
print(lottery_numbers)
```
**Instructor notes:** `random.sample()` is directly useful for today's Password Generator (picking several unique random characters) — flag this connection explicitly.

---

### Slide 6 — Generating Random Characters for Passwords
**Explanation:** Combine `random.choice()` with Python's string constants (`string.ascii_letters`, `string.digits`, `string.punctuation` from the `string` module) to build blocks of possible password characters.
**Code example:**
```python
import random
import string

characters = string.ascii_letters + string.digits + string.punctuation
print(random.choice(characters))
```
**Instructor notes:** Introduce the `string` module's constants here as a small, practical addition — directly sets up today's mini project's core mechanism.

---

### Slide 7 — The math Module
**Explanation:** `math` provides mathematical functions and constants beyond basic arithmetic operators.
**Code example:**
```python
import math

print(math.sqrt(16))    # 4.0
print(math.floor(4.7))   # 4 — rounds down
print(math.ceil(4.2))    # 5 — rounds up
print(math.pi)            # 3.14159...
```
**Instructor notes:** Recap Lesson 5's Scientific Calculator stretch goal (`a ** 0.5` for square root) — "math.sqrt() is the more standard, readable way to do exactly that."

---

### Slide 8 — Practical math Usage
**Code example:**
```python
import math

radius = 5
area = math.pi * radius ** 2
print(f"Circle area: {area:.2f}")
```
**Instructor notes:** Keep this brief and practical — a single clear example is enough; the goal is recognizing `math` as a resource to reach for, not memorizing every function today.

---

### Slide 9 — The datetime Module: Getting the Current Date/Time
**Code example:**
```python
import datetime

today = datetime.date.today()
print(today)  # e.g., 2026-07-30

now = datetime.datetime.now()
print(now)  # e.g., 2026-07-30 14:32:10.123456
```
**Instructor notes:** Recap Lesson 8's Daily Journal App homework preview ("a simple hardcoded date or the datetime module") — this fully resolves that earlier forward-reference.

---

### Slide 10 — Formatting Dates
**Explanation:** `.strftime()` formats a date/time object into a readable string using format codes.
**Code example:**
```python
import datetime

now = datetime.datetime.now()
print(now.strftime("%B %d, %Y"))   # July 30, 2026
print(now.strftime("%Y-%m-%d %H:%M"))  # 2026-07-30 14:32
```
**Instructor notes:** Keep the format code list light — provide a small reference table (`%Y`, `%m`, `%d`, `%B`, `%H`, `%M`) rather than requiring memorization; point students to the extra resources for the full reference.

---

### Slide 11 — The os Module
**Explanation:** `os` provides tools for interacting with the operating system — checking if files/folders exist, listing directory contents, and more. Recap Lesson 8's brief `os.path.exists()` preview.
**Code example:**
```python
import os

print(os.path.exists("students.csv"))   # True or False
print(os.listdir("."))                    # lists files in the current folder
```
**Instructor notes:** Fully resolve the Lesson 8 forward-reference here — students already used `os.path.exists()` without full explanation; today completes that understanding.

---

### Slide 12 — Planning the Random Password Generator
**Explanation:** Plan the program: ask the user for desired password length, build a character pool (letters, digits, symbols — recap Slide 6), randomly select that many characters, and join them into a final password string.
**Instructor notes:** Introduce `"".join(list)` here as a small but essential new tool — converts a list of characters back into a single string, needed to assemble the final password.

---

### Slide 13 — Building the Random Password Generator
**Code example:**
```python
import random
import string

def generate_password(length):
    characters = string.ascii_letters + string.digits + string.punctuation
    password = "".join(random.choice(characters) for _ in range(length))
    return password

while True:
    print("\n1. Generate password  2. Quit")
    choice = input("Choose an option: ")

    if choice == "1":
        try:
            length = int(input("Enter desired password length: "))
            if length < 4:
                print("Please choose a length of at least 4.")
                continue
            password = generate_password(length)
            print(f"Your generated password: {password}")
        except ValueError:
            print("Please enter a valid number.")
    elif choice == "2":
        print("Goodbye!")
        break
    else:
        print("Invalid option, please try again.")
```
**Instructor notes:** Point out the list comprehension-style generator expression (`"".join(random.choice(characters) for _ in range(length))`) is new syntax — explain it plainly as "a compact way to repeat `random.choice(characters)` `length` times and join the results," rather than requiring full list comprehension mastery today (a topic for more advanced courses). Recap Lesson 9's `try`/`except ValueError` directly, applied here to protect against non-numeric length input.

---

## 5. Practical Exercises During Class

1. **Import style drill:** Students rewrite a `random.randint()` call using `from random import randint` instead.
2. **math drill:** Students calculate the area and circumference of a circle using `math.pi`.
3. **datetime drill:** Students print today's date formatted as "Day, Month Date, Year" (e.g., "Thursday, July 30, 2026") using `.strftime()`.
4. **Full build-along:** Every student builds the Random Password Generator with the instructor.

---

## 6. Homework Assignment

Build a **Dice Simulator**: a program that simulates rolling one or more dice (using `random.randint(1, 6)`), lets the user choose how many dice to roll and how many times, and reports the results along with basic statistics (e.g., total, average) using functions and error handling (recap Lessons 5 and 9).

---

## 7. Mini Project — Random Password Generator

**Brief:** "Build a tool that generates strong, random passwords of a user-specified length."

**Requirements:**
- Uses the `random` and `string` modules to build a character pool of letters, digits, and symbols
- Asks the user for desired password length, with error handling for invalid (non-numeric or too-short) input
- Generates and displays a random password using the chosen length
- Menu loop allowing repeated password generation until the user quits
- Runs without errors for valid and invalid input alike

**Stretch goal:** Add options to include/exclude symbols or digits based on user preference (yes/no prompts), and save generated passwords to a file (recap Lesson 8) for later reference.

---

## 8. Common Beginner Mistakes

- Forgetting to `import` a module before using it, causing a `NameError`.
- Confusing `random.randint(a, b)` (inclusive of both `a` and `b`) with `range(a, b)`'s exclusive-stop behavior (recap Lesson 4) — a subtle but real distinction worth calling out.
- Using `math.sqrt()` on a negative number, causing a `ValueError` (a good, low-stakes opportunity to recap Lesson 9's error handling).
- Forgetting `datetime.datetime.now()` vs. `datetime.date.today()` return slightly different objects (one includes time, one doesn't).
- Misremembering `strftime()` format codes (case matters: `%m` is month, `%M` is minutes).
- Forgetting the character pool needs `string.ascii_letters` (not just `string.ascii_lowercase`) for a genuinely strong password.

---

## 9. Extra Resources

- [Python Docs — The Python Standard Library](https://docs.python.org/3/library/index.html)
- [Python Docs — random Module](https://docs.python.org/3/library/random.html)
- [Python Docs — math Module](https://docs.python.org/3/library/math.html)
- [Python Docs — datetime Module (strftime reference)](https://docs.python.org/3/library/datetime.html#strftime-and-strptime-format-codes)
- [Python Docs — os Module](https://docs.python.org/3/library/os.html)
