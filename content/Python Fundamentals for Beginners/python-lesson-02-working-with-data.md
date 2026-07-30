
# Lesson 2 — Working with Data

**Khodz Academy — Python Fundamentals for Beginners**
**Session:** 2 of 12 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Work confidently with numbers, strings, and booleans.
2. Use arithmetic, comparison, and logical operators.
3. Convert between data types deliberately and correctly.
4. Format strings cleanly using f-strings.
5. Collect and process user input to perform calculations.
6. Build a complete Student Information System.

---

## 2. Skills Students Will Learn

- Numbers: `int` and `float` behavior, arithmetic operators (`+ - * / // % **`)
- Strings: creation, concatenation, common operations
- Booleans: `True`/`False`, how they arise from comparisons
- Type conversion: `int()`, `float()`, `str()`, and why it's needed
- String formatting with f-strings (`f"..."`)
- Reading numeric input safely (`input()` + conversion)
- Performing simple calculations from user input

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Lesson 1 + show and tell |
| 0:10–0:25 | Numbers and arithmetic operators (Slides 1–3) — live coding |
| 0:25–0:40 | Strings and booleans (Slides 4–6) — live coding |
| 0:40–1:00 | Type conversion (Slides 7–9) — live coding |
| 1:00–1:15 | String formatting with f-strings (Slides 10–11) — live coding |
| 1:15–1:30 | Building the Student Information System, recap (Slides 12–13) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Recap: Data Types from Lesson 1
**Explanation:** Recall `int`, `float`, `str`, `bool` from Lesson 1. Today goes deeper into how these types actually behave — what you can *do* with them, not just what they're called.
**Instructor notes:** A 2-minute refresher — confirm the room remembers `type()` before moving on.

---

### Slide 2 — Arithmetic Operators
**Explanation:** `+` (add), `-` (subtract), `*` (multiply), `/` (divide, always returns a float), `//` (floor division, drops the decimal), `%` (modulo, the remainder), `**` (exponent/power).
**Code example:**
```python
print(10 / 3)   # 3.3333333333333335
print(10 // 3)  # 3
print(10 % 3)   # 1
print(2 ** 3)   # 8
```
**Instructor notes:** Spend real time on `//` and `%` — both are new symbols for beginners and both reappear constantly (e.g., checking even/odd with `%`, pagination logic later in more advanced courses).

---

### Slide 3 — Operator Precedence
**Explanation:** Python follows standard math order of operations (parentheses, exponents, multiplication/division, addition/subtraction) — use parentheses to make intent clear even when not strictly required.
**Code example:**
```python
result = 2 + 3 * 4       # 14, not 20
result = (2 + 3) * 4     # 20 — parentheses control order
```
**Instructor notes:** Encourage the habit of adding parentheses for clarity even when precedence would technically produce the correct result anyway — readability over cleverness.

---

### Slide 4 — Strings in Depth
**Explanation:** Strings can be combined with `+` (concatenation), repeated with `*`, and measured with `len()`.
**Code example:**
```python
first_name = "Amaka"
last_name = "Okoye"
full_name = first_name + " " + last_name
print(full_name)          # Amaka Okoye
print(len(full_name))      # 11
print("ha" * 3)            # hahaha
```
**Instructor notes:** The `"ha" * 3` example tends to delight beginners — a good moment to show Python's flexibility without over-explaining why it works.

---

### Slide 5 — Useful String Methods
**Explanation:** Strings have built-in methods for common transformations: `.upper()`, `.lower()`, `.strip()`, `.replace()`.
**Code example:**
```python
name = "  Amaka  "
print(name.strip())          # "Amaka" — removes extra whitespace
print(name.upper())          # "  AMAKA  "
print(name.strip().lower())   # "amaka"
```
**Instructor notes:** Point out methods can be chained (`.strip().lower()`) — a small but powerful idea worth naming explicitly, since it reappears throughout the course.

---

### Slide 6 — Booleans and Comparisons
**Explanation:** Booleans (`True`/`False`) often arise from comparisons rather than being typed directly — comparison operators (`==`, `!=`, `>`, `<`, `>=`, `<=`) always produce a boolean.
**Code example:**
```python
age = 20
print(age >= 18)   # True
print(age == 21)   # False
```
**Instructor notes:** Foreshadow Lesson 3 explicitly: "these comparisons become the backbone of decision-making in your programs starting next lesson."

---

### Slide 7 — The Type Conversion Problem
**Explanation:** Recall Lesson 1: `input()` always returns a string, even for numbers. Attempting math directly on that string causes an error.
**Code example:**
```python
age = input("Enter your age: ")
print(age + 1)  # ❌ TypeError: can only concatenate str (not "int") to str
```
**Instructor notes:** Trigger this error live — the exact "gotcha" flagged at the end of Lesson 1, now given full treatment. Reading the error message together is itself a valuable exercise.

---

### Slide 8 — Fixing It with Type Conversion
**Explanation:** `int()`, `float()`, and `str()` convert values between types deliberately.
**Code example:**
```python
age = int(input("Enter your age: "))
print(age + 1)  # ✅ Works correctly now
```
**Instructor notes:** Emphasize choosing the right conversion for the situation — `int()` for whole numbers, `float()` for decimals, `str()` when combining numbers into text output.

---

### Slide 9 — When Type Conversion Fails
**Explanation:** Converting text that isn't actually a valid number (e.g., `int("hello")`) raises a `ValueError` — a preview of Lesson 9's proper error-handling techniques.
**Code example:**
```python
age = int(input("Enter your age: "))
# If the user types "twenty", this crashes:
# ValueError: invalid literal for int() with base 10: 'twenty'
```
**Instructor notes:** Flag this honestly as a real limitation students will learn to handle gracefully in Lesson 9 — for now, it's fine for programs to crash on bad input; robustness comes later.

---

### Slide 10 — String Formatting with f-strings
**Explanation:** An f-string (`f"..."`) lets you embed variables and expressions directly inside a string using curly braces — cleaner than manually joining strings with `+`.
**Code example:**
```python
name = "Amaka"
age = 24
print(f"{name} is {age} years old.")
print(f"Next year, {name} will be {age + 1}.")
```
**Instructor notes:** Compare directly against Slide 4's `+`-based concatenation — f-strings are shorter, more readable, and handle type conversion automatically inside the braces (no need to wrap numbers in `str()` first).

---

### Slide 11 — Formatting Numbers in f-strings
**Explanation:** F-strings support formatting specifiers, e.g., rounding decimals to a fixed number of places — useful for money, percentages, and other real-world calculations.
**Code example:**
```python
price = 19.9999
print(f"Price: ${price:.2f}")  # Price: $20.00
```
**Instructor notes:** Keep this practical and light — just enough for students to format money/decimals cleanly in today's project; deeper formatting options can be explored independently via the extra resources.

---

### Slide 12 — Building the Student Information System
**Explanation:** Combine everything from today: collect a student's name, age, and three subject scores via `input()`, convert scores to numbers, calculate their average, and display a clean, formatted summary.
**Code example:**
```python
name = input("Enter student name: ")
age = int(input("Enter age: "))
score1 = float(input("Enter score for Math: "))
score2 = float(input("Enter score for English: "))
score3 = float(input("Enter score for Science: "))

average = (score1 + score2 + score3) / 3

print(f"\nStudent Report for {name}")
print(f"Age: {age}")
print(f"Average Score: {average:.2f}")
```
**Instructor notes:** Build this incrementally — collect and print raw inputs first, then add the calculation, then add formatting — the "small steps, test often" habit that will be repeated throughout the course.

---

### Slide 13 — Recap and What's Next
**Explanation:** Recap: arithmetic operators, strings and string methods, booleans and comparisons, type conversion, f-strings, and building a complete Student Information System. Preview: Lesson 3 covers decision-making — `if`/`elif`/`else` — turning today's comparisons into programs that actually make choices, building a Grade Checker.
**Instructor notes:** Point directly at Slide 6's comparisons — "you already know how to ask true/false questions; next lesson, your programs finally *act* on the answers."

---

## 5. Practical Exercises During Class

1. **Operator drill:** Students predict the output of 5 arithmetic expressions (including `//` and `%`) before running them.
2. **Type conversion bug hunt:** Instructor shows the Slide 7 error live; students fix it independently.
3. **F-string drill:** Students rewrite a `+`-based print statement as an f-string.

---

## 6. Homework Assignment

Build a **Currency Converter**: a script that asks the user for an amount in US Dollars and a fixed exchange rate (or hardcode a rate, e.g., 1 USD = 1,600 NGN), then prints the converted amount formatted to 2 decimal places using an f-string.

---

## 7. Mini Project — Student Information System

**Brief:** "Build a program that collects a student's details and academic scores, then generates a clean summary report."

**Requirements:**
- Collects student name, age, and at least 3 subject scores via `input()`
- Correctly converts numeric input using `int()`/`float()`
- Calculates the average score
- Displays a formatted summary using f-strings, including the average rounded to 2 decimal places
- Runs without errors for valid input

**Stretch goal:** Add a 4th subject and calculate both the average and the highest individual score using the `max()` function.

---

## 8. Common Beginner Mistakes

- Forgetting to convert `input()` results before doing math, causing a `TypeError`.
- Using the wrong conversion function (`int()` on a decimal string like `"19.99"`, causing a `ValueError` — `float()` is needed instead).
- Forgetting the `f` before a formatted string, causing the curly braces to print literally instead of substituting values.
- Mixing up `/` (always returns a float) and `//` (floor division) when precise results are needed.
- Forgetting `len()` returns the number of characters, not the string's "value."
- Chaining string methods in the wrong order and getting unexpected results (e.g., trying `.upper()` before `.strip()` when order matters for the intended output).

---

## 9. Extra Resources

- [Python Docs — Numeric Types](https://docs.python.org/3/library/stdtypes.html#numeric-types-int-float-complex)
- [Python Docs — String Methods](https://docs.python.org/3/library/stdtypes.html#string-methods)
- [Python Docs — f-strings (Formatted String Literals)](https://docs.python.org/3/tutorial/inputoutput.html#formatted-string-literals)
- [W3Schools — Python Type Conversion](https://www.w3schools.com/python/python_casting.asp)
