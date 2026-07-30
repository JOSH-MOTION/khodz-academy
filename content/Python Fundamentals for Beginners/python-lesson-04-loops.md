
# Lesson 4 — Loops

**Khodz Academy — Python Fundamentals for Beginners**
**Session:** 4 of 12 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Explain why loops exist and what problem they solve.
2. Write `while` loops for condition-based repetition.
3. Write `for` loops using `range()` for counted repetition.
4. Use `break` and `continue` to control loop flow.
5. Write nested loops.
6. Build a working Number Guessing Game.

---

## 2. Skills Students Will Learn

- The concept of repetition/iteration in programming
- `while` loops and loop conditions
- Avoiding infinite loops
- `for` loops and `range()`
- `break` to exit a loop early
- `continue` to skip to the next iteration
- Nested loops (a loop inside another loop)

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Lesson 3 + show and tell |
| 0:10–0:20 | Why loops matter (Slides 1–2) |
| 0:20–0:40 | while loops (Slides 3–6) — live coding |
| 0:40–1:00 | for loops and range() (Slides 7–9) — live coding |
| 1:00–1:15 | break and continue (Slides 10–11) — live coding |
| 1:15–1:30 | Nested loops + building the game (Slides 12–14) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — The Problem: Repeating Code
**Explanation:** Without loops, repeating an action means literally copy-pasting code — printing "Hello" 100 times would require 100 lines. Loops let a computer repeat instructions automatically.
**Code example:**
```python
# Without a loop — tedious and doesn't scale
print("Hello")
print("Hello")
print("Hello")
```
**Instructor notes:** Let this feel genuinely tedious before showing the fix — the "why" lands much better after a small, real frustration.

---

### Slide 2 — Why Loops Matter
**Explanation:** Loops power nearly everything repetitive in software: processing every item in a list, retrying until a user gives valid input, running a game until it's won or lost.
**Real-world example:** A number guessing game keeps asking for guesses until the correct number is found — impossible to write without a loop, since we don't know in advance how many guesses it'll take.
**Instructor notes:** Foreshadow today's mini project explicitly here — motivates the entire lesson with its end goal.

---

### Slide 3 — Introducing while Loops
**Explanation:** A `while` loop repeats a block of code as long as its condition remains `True`.
**Code example:**
```python
count = 1
while count <= 5:
    print(count)
    count += 1
```
**Instructor notes:** Walk through this line by line, predicting the output before running it — makes the mechanism (check condition → run block → update → recheck) concrete.

---

### Slide 4 — The Danger of Infinite Loops
**Explanation:** If the loop's condition never becomes `False`, the loop runs forever — a common and important beginner bug.
**Code example:**
```python
# ❌ Infinite loop — count never changes
count = 1
while count <= 5:
    print(count)
```
**Instructor notes:** Trigger this live (with a warning!) and show how to stop a runaway program (Ctrl+C in the terminal) — an essential practical skill, not just a cautionary tale.

---

### Slide 5 — while Loops with User Input
**Explanation:** `while` loops are ideal when you don't know in advance how many repetitions are needed — e.g., "keep asking until the user enters a valid response."
**Code example:**
```python
password = ""
while password != "secret123":
    password = input("Enter the password: ")

print("Access granted!")
```
**Instructor notes:** Point out this pattern directly previews today's Number Guessing Game — "keep looping until a specific condition is met" is the exact shape of that project.

---

### Slide 6 — while True with break (Preview)
**Explanation:** `while True:` creates a loop that runs forever *on purpose*, combined with `break` (covered fully on Slide 10) to exit when ready — a very common real-world pattern for "keep going until something specific happens."
**Code example:**
```python
while True:
    answer = input("Type 'quit' to stop: ")
    if answer == "quit":
        break
```
**Instructor notes:** Keep this brief — a preview only; full `break` explanation comes later in the lesson. Just enough to recognize the pattern when it reappears.

---

### Slide 7 — Introducing for Loops
**Explanation:** A `for` loop iterates over a sequence of values — ideal when you know what you're looping over (a range of numbers, or later, a list).
**Code example:**
```python
for number in range(1, 6):
    print(number)
```
**Instructor notes:** Contrast directly with the Slide 3 `while` version that produces the same output — same result, different tool, different situation (`for` when the number of iterations is known/countable).

---

### Slide 8 — Understanding range()
**Explanation:** `range(start, stop, step)` generates a sequence of numbers. `range(5)` starts at 0, `range(1, 6)` starts at 1 and stops before 6, `range(0, 10, 2)` steps by 2.
**Code example:**
```python
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4 — note: stops BEFORE 5

for i in range(1, 11, 2):
    print(i)  # 1, 3, 5, 7, 9
```
**Instructor notes:** The "stops before the stop value" behavior is a very common early confusion point — demonstrate it explicitly and repeat it clearly.

---

### Slide 9 — for Loops for Counted Repetition
**Explanation:** `for` loops are the natural choice whenever you know exactly how many times to repeat something.
**Code example:**
```python
for i in range(1, 6):
    print(f"This is repetition number {i}")
```
**Real-world example:** Printing a multiplication table (this week's homework) — a fixed, known number of repetitions, perfectly suited to `for`.
**Instructor notes:** Directly connect to the Multiplication Table Generator homework assignment — gives the exercise immediate, obvious relevance.

---

### Slide 10 — break: Exiting a Loop Early
**Explanation:** `break` immediately stops the loop, regardless of its condition — useful for "stop as soon as this specific thing happens."
**Code example:**
```python
for number in range(1, 100):
    if number == 7:
        print("Found it!")
        break
    print(number)
```
**Instructor notes:** Fully resolve the Slide 6 preview here — return to that `while True` example and explain `break`'s role in it properly now that the mechanism is clear.

---

### Slide 11 — continue: Skipping an Iteration
**Explanation:** `continue` skips the rest of the current iteration and moves on to the next one, without exiting the loop entirely.
**Code example:**
```python
for number in range(1, 11):
    if number % 2 == 0:
        continue  # skip even numbers
    print(number)  # only odd numbers print
```
**Instructor notes:** Contrast directly with `break` on the same board/slide — "`break` leaves the loop entirely, `continue` just skips ahead to the next lap."

---

### Slide 12 — Nested Loops
**Explanation:** A loop can contain another loop inside it — useful for grid-like or table-like repetition (e.g., rows and columns).
**Code example:**
```python
for row in range(1, 4):
    for col in range(1, 4):
        print(f"({row}, {col})", end=" ")
    print()  # move to a new line after each row
```
**Instructor notes:** Introduce `print(..., end=" ")` here briefly — a small but useful trick for controlling output layout, directly relevant to today's homework (Multiplication Table Generator, which benefits from clean row/column formatting).

---

### Slide 13 — Planning the Number Guessing Game
**Explanation:** Plan before coding: generate a random number (preview `random` module, fully covered in Lesson 10 — for today, provide the one line needed), loop asking for guesses until correct, and give "higher"/"lower" hints.
**Code example:**
```python
import random
secret_number = random.randint(1, 100)
```
**Instructor notes:** Be explicit that `import random` is a preview of Lesson 10 — treat it as a "recipe ingredient" for today's project rather than teaching modules in depth now.

---

### Slide 14 — Building the Number Guessing Game
**Code example:**
```python
import random

secret_number = random.randint(1, 100)
guess = 0

print("I'm thinking of a number between 1 and 100!")

while guess != secret_number:
    guess = int(input("Take a guess: "))

    if guess < secret_number:
        print("Too low! Try again.")
    elif guess > secret_number:
        print("Too high! Try again.")
    else:
        print("🎉 You got it!")
```
**Instructor notes:** Build this incrementally: get the random number working and printed (for testing) first, then add the loop, then add the hint logic — recap the "small steps, test often" habit established since Lesson 1. Remove the debug print of the secret number once everything works, and discuss briefly why (it would spoil the game for a real user).

---

## 5. Practical Exercises During Class

1. **while loop drill:** Students write a `while` loop that counts down from 10 to 1.
2. **range() drill:** Students predict the output of 3 different `range()` calls before running them.
3. **break/continue drill:** Given a `for` loop over `range(1, 21)`, students print only numbers divisible by 3, skipping others with `continue`, and stopping entirely once they reach 18 using `break`.
4. **Full build-along:** Every student builds the Number Guessing Game with the instructor.

---

## 6. Homework Assignment

Build a **Multiplication Table Generator**: a script that asks the user for a number, then prints its multiplication table from 1 to 10 using a `for` loop and clean f-string formatting.

---

## 7. Mini Project — Number Guessing Game

**Brief:** "Build a game where the computer picks a secret number and the player keeps guessing until they find it, with helpful hints along the way."

**Requirements:**
- Uses `random.randint()` to generate a secret number in a defined range
- Uses a `while` loop to keep prompting for guesses until correct
- Gives "too high"/"too low" feedback on each incorrect guess
- Prints a congratulatory message when the correct number is guessed
- Runs without errors for valid numeric input

**Stretch goal:** Add a guess counter that tracks and displays how many attempts it took the player to win.

---

## 8. Common Beginner Mistakes

- Writing an infinite loop by forgetting to update the loop variable/condition inside a `while` loop.
- Confusing `range(5)` (0 through 4) with a range that includes 5.
- Using `break` when `continue` was intended, or vice versa.
- Forgetting that a `for` loop's variable is temporary and only exists meaningfully within the loop's scope (light preview of Lesson 5's scope discussion).
- Nesting loops incorrectly (misaligned indentation causing the inner loop to run in the wrong place, or not repeat as expected).
- Not converting `input()` to `int()` inside the guessing loop, causing a comparison error against the secret number.

---

## 9. Extra Resources

- [Python Docs — for Statements](https://docs.python.org/3/tutorial/controlflow.html#for-statements)
- [Python Docs — range() Function](https://docs.python.org/3/library/stdtypes.html#range)
- [Python Docs — break and continue Statements](https://docs.python.org/3/tutorial/controlflow.html#break-and-continue-statements)
- [W3Schools — Python Loops](https://www.w3schools.com/python/python_while_loops.asp)
