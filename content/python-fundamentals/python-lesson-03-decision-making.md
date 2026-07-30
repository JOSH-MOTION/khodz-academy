
# Lesson 3 — Decision Making

**Khodz Academy — Python Fundamentals for Beginners**
**Session:** 3 of 12 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Use comparison operators to ask true/false questions.
2. Combine conditions using logical operators.
3. Write `if`, `elif`, and `else` statements.
4. Understand and correctly use Python's indentation rules.
5. Write nested conditions for more complex decisions.
6. Build a working Grade Checker.

---

## 2. Skills Students Will Learn

- Comparison operators: `==`, `!=`, `>`, `<`, `>=`, `<=` (recap from Lesson 2, now applied to decisions)
- Logical operators: `and`, `or`, `not`
- `if` statements
- `elif` for multiple conditions
- `else` as a catch-all
- Python's indentation-based block structure
- Nested `if` statements (a condition inside another condition)

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Lesson 2 + show and tell |
| 0:10–0:20 | Recap: comparisons, why decisions matter (Slides 1–2) |
| 0:20–0:35 | Logical operators (Slides 3–4) — live coding |
| 0:35–1:00 | if / elif / else (Slides 5–9) — live coding |
| 1:00–1:15 | Indentation rules deep dive (Slide 10) |
| 1:15–1:30 | Nested conditions + building the Grade Checker (Slides 11–13) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Recap: Comparisons Produce Booleans
**Explanation:** Recall Lesson 2: `age >= 18` produces `True` or `False`. Today, programs finally *act* on that answer instead of just printing it.
**Instructor notes:** A quick recap — ask a student to predict the output of a comparison expression from memory before moving on.

---

### Slide 2 — Why Decision-Making Matters
**Explanation:** Nearly every real program needs to behave differently depending on circumstances — is the user old enough? did they enter valid input? did they win the game? Decision-making is what makes programs feel intelligent rather than purely mechanical.
**Real-world example:** An ATM checking whether you have sufficient balance before allowing a withdrawal — pure decision logic.
**Instructor notes:** Frame this as the biggest conceptual leap of the course so far — everything before today was "do this," starting today, programs can "decide what to do."

---

### Slide 3 — Logical Operators: and, or, not
**Explanation:** `and` (both conditions must be true), `or` (at least one must be true), `not` (flips true to false and vice versa).
**Code example:**
```python
age = 20
has_id = True

print(age >= 18 and has_id)   # True — both are true
print(age >= 65 or has_id)    # True — at least one is true
print(not has_id)              # False — flips True to False
```
**Instructor notes:** Use a simple truth-table style walkthrough on the whiteboard for `and`/`or` — many beginners confuse them, especially `or` (thinking it requires both, like everyday English sometimes implies).

---

### Slide 4 — Combining Comparisons with Logical Operators
**Explanation:** Real conditions often combine multiple comparisons — e.g., checking a value falls within a range.
**Code example:**
```python
score = 75
print(score >= 70 and score <= 100)  # True — checks a range
```
**Instructor notes:** Mention Python also supports chained comparisons (`70 <= score <= 100`) as a nicer shorthand — introduce as an optional, elegant alternative, not a requirement.

---

### Slide 5 — Your First if Statement
**Explanation:** `if` runs a block of code only when its condition is `True`.
**Code example:**
```python
age = 20

if age >= 18:
    print("You are an adult.")
```
**Instructor notes:** Point out the colon (`:`) and the indented line beneath it — both are required syntax, introduced formally in depth on Slide 10.

---

### Slide 6 — Adding else
**Explanation:** `else` runs when the `if` condition is `False` — a catch-all for "otherwise."
**Code example:**
```python
age = 15

if age >= 18:
    print("You are an adult.")
else:
    print("You are a minor.")
```
**Instructor notes:** Run this with both an adult and minor age live to show both branches firing correctly.

---

### Slide 7 — Adding elif for Multiple Conditions
**Explanation:** `elif` ("else if") checks an additional condition only if the previous `if`/`elif` was `False` — allows chaining multiple distinct possibilities.
**Code example:**
```python
score = 82

if score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
elif score >= 70:
    print("Grade: C")
else:
    print("Grade: F")
```
**Instructor notes:** This is the day's centerpiece pattern and the direct foundation of today's Grade Checker project — walk through it slowly, testing several different `score` values live.

---

### Slide 8 — Order Matters in elif Chains
**Explanation:** Conditions are checked top to bottom, and Python stops at the first `True` match — writing conditions in the wrong order can produce incorrect results.
**Code example:**
```python
# ❌ Bug: this always prints "Grade: F" for high scores too!
if score >= 70:
    print("Grade: C")
elif score >= 80:
    print("Grade: B")   # never reached — 80+ already matched the first condition
elif score >= 90:
    print("Grade: A")   # never reached either
```
**Instructor notes:** Trigger this bug live with a high score (e.g., 95) to show the incorrect "Grade: C" result — a genuinely important lesson about `elif` chain ordering (typically highest-to-lowest, or lowest-to-highest, but always consistent with the check direction).

---

### Slide 9 — if Without else or elif
**Explanation:** `if` can stand alone without `else`/`elif` when there's simply nothing to do in the false case.
**Code example:**
```python
balance = 500
withdrawal = 200

if withdrawal > balance:
    print("Insufficient funds.")
# if the condition is False, the program just continues normally — no else needed
```
**Instructor notes:** Prevents an overcorrection where students feel every `if` "needs" an `else` — sometimes doing nothing in the false case is exactly correct.

---

### Slide 10 — Understanding Python's Indentation Rules
**Explanation:** Unlike many languages that use `{}` to mark code blocks, Python uses indentation (consistently 4 spaces, by convention) to determine what code belongs inside an `if`/`elif`/`else` block. Inconsistent indentation causes errors.
**Code example:**
```python
# ✅ Correct — consistent 4-space indentation
if age >= 18:
    print("Adult")
    print("Can vote")

# ❌ IndentationError — inconsistent spacing
if age >= 18:
    print("Adult")
      print("Can vote")
```
**Instructor notes:** This is the moment to fully resolve the "Python cares about spacing" mention flagged back in Lesson 1 — trigger an `IndentationError` live and read the error message together. Recommend VS Code's auto-indentation (which handles this automatically after a colon) as a practical safety net.

---

### Slide 11 — Nested Conditions
**Explanation:** An `if` statement can contain another `if` statement inside it — useful when a decision only makes sense after another condition is already true.
**Code example:**
```python
age = 20
has_ticket = True

if age >= 18:
    if has_ticket:
        print("Entry allowed.")
    else:
        print("You need a ticket.")
else:
    print("You must be 18 or older.")
```
**Instructor notes:** Point out this could also be written as a single `if age >= 18 and has_ticket:` — nesting is useful when the "false" branches need genuinely different messages (as shown here), not just as a default habit. Encourage students to prefer combined conditions when nesting doesn't add real value, to keep code readable.

---

### Slide 12 — Building the Grade Checker
**Explanation:** Combine today's full toolkit — comparisons, logical operators, `if`/`elif`/`else` — into a complete grade-checking program.
**Code example:**
```python
name = input("Enter student name: ")
score = float(input("Enter score: "))

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"\n{name}'s Grade: {grade}")

if grade in ["A", "B"]:
    print("Great job!")
elif grade == "F":
    print("Please see your teacher for extra support.")
else:
    print("Keep working hard!")
```
**Instructor notes:** Build this incrementally: get the grade calculation working and printed first, then layer on the encouraging message logic — recap the "in" operator briefly here as a preview, full list/membership coverage comes in Lesson 6.

---

### Slide 13 — Recap and What's Next
**Explanation:** Recap: logical operators, `if`/`elif`/`else`, indentation rules, nested conditions, and building a complete Grade Checker. Preview: Lesson 4 introduces loops — `while` and `for` — teaching programs to repeat actions automatically, building a Number Guessing Game.
**Instructor notes:** Tease directly: "right now, your programs make one decision and stop — next lesson, they can keep going until a goal is reached."

---

## 5. Practical Exercises During Class

1. **Logical operator drill:** Students predict the output of 5 `and`/`or`/`not` expressions before running them.
2. **elif ordering bug hunt:** Instructor shows the Slide 8 bug; students fix the ordering themselves.
3. **Indentation drill:** Instructor shows a script with an indentation error; students identify and fix it before running.
4. **Full build-along:** Every student builds the Grade Checker with the instructor.

---

## 6. Homework Assignment

Build an **ATM Eligibility Checker**: a script that asks for the user's age and whether they have a valid ID (yes/no input), and prints whether they're eligible to open a bank account, using combined logical conditions (`and`/`or`) and `if`/`else`.

---

## 7. Mini Project — Grade Checker

**Brief:** "Build a program that takes a student's score and reports their letter grade along with an encouraging message."

**Requirements:**
- Collects a student's name and numeric score via `input()`
- Correctly converts the score to a number
- Uses an `if`/`elif`/`else` chain, correctly ordered, to determine a letter grade (A–F)
- Prints the grade in a formatted message using an f-string
- Prints an additional message based on the grade (encouragement for high grades, support message for failing grades)
- Runs without errors for valid input

**Stretch goal:** Add a check that rejects scores outside the valid 0–100 range with a friendly error message, using an additional `if` condition before the grading logic runs.

---

## 8. Common Beginner Mistakes

- Forgetting the colon (`:`) at the end of `if`/`elif`/`else` lines.
- Inconsistent indentation, causing `IndentationError`.
- Writing `elif` conditions in the wrong order, causing higher-priority conditions to never be reached (recap Slide 8).
- Confusing `=` (assignment) with `==` (comparison) inside a condition.
- Using `and` when `or` was intended (or vice versa), producing logic that's always true or always false.
- Over-nesting `if` statements when a single combined condition (`and`/`or`) would be clearer and simpler.
- Forgetting an `else` is not always necessary — adding an empty or redundant `else` block out of habit.

---

## 9. Extra Resources

- [Python Docs — if Statements](https://docs.python.org/3/tutorial/controlflow.html#if-statements)
- [Python Docs — Boolean Operations](https://docs.python.org/3/library/stdtypes.html#boolean-operations-and-or-not)
- [W3Schools — Python Conditions](https://www.w3schools.com/python/python_conditions.asp)
