
# Lesson 9 — Error Handling

**Khodz Academy — Python Fundamentals for Beginners**
**Session:** 9 of 12 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Explain what exceptions are and why programs crash without handling them.
2. Use `try`/`except` to handle errors gracefully.
3. Use `else` and `finally` to structure error-handling logic clearly.
4. Catch specific exception types deliberately.
5. Raise their own errors when appropriate.
6. Build a robust Banking Application that doesn't crash on bad input.

---

## 2. Skills Students Will Learn

- What an exception is, and how Python reports it (the traceback)
- `try`/`except` blocks
- Catching specific exceptions (`ValueError`, `ZeroDivisionError`, `FileNotFoundError`)
- Catching multiple exception types
- `else` (runs only if no exception occurred)
- `finally` (always runs, regardless of success or failure)
- Raising custom errors with `raise`
- Designing programs that handle bad input gracefully instead of crashing

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Lesson 8 + show and tell |
| 0:10–0:20 | What is an exception? Reading tracebacks (Slides 1–3) |
| 0:20–0:45 | try/except basics (Slides 4–7) — live coding |
| 0:45–1:05 | else, finally, multiple exceptions (Slides 8–10) — live coding |
| 1:05–1:15 | Raising custom errors (Slide 11) — live coding |
| 1:15–1:30 | Building the Banking Application (Slides 12–13) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — What Is an Exception?
**Explanation:** An exception is an error that occurs while a program is running, which — if not handled — causes the program to crash immediately. Students have already seen several: `TypeError` (Lesson 2), `ValueError` (Lesson 2), `IndentationError` (Lesson 3), `KeyError` and `NameError` (Lesson 7), `FileNotFoundError` (Lesson 8).
**Instructor notes:** List these previously-seen errors explicitly on screen — today formalizes handling for problems students have already personally experienced throughout the course, making the lesson feel like a payoff rather than new abstract theory.

---

### Slide 2 — Reading a Traceback
**Explanation:** When Python crashes, it prints a "traceback" — showing exactly where the error occurred and what type of error it is. Reading it calmly, from the bottom up, usually tells you exactly what went wrong.
**Code example:**
```python
age = int(input("Enter your age: "))
# User types "twenty":
# Traceback (most recent call last):
#   File "script.py", line 1, in <module>
#     age = int(input("Enter your age: "))
# ValueError: invalid literal for int() with base 10: 'twenty'
```
**Instructor notes:** Recap Lesson 5's "debugging workflow" mindset from the broader Khodz Academy approach — read the *last line* of a traceback first (the actual error type and message), then work upward if more context is needed.

---

### Slide 3 — Why Unhandled Errors Are a Problem
**Explanation:** An unhandled exception stops the entire program immediately — in a real application (like a banking app), this means a single bad input could crash the whole system for a user, which is unacceptable.
**Real-world example:** An ATM shouldn't shut down completely just because a user typed letters instead of numbers — it should show an error message and let them try again.
**Instructor notes:** Foreshadow today's Banking Application project directly here — sets the stakes for why this lesson matters practically, not just academically.

---

### Slide 4 — Your First try/except
**Explanation:** Code inside `try` is attempted; if an exception occurs, the matching `except` block runs instead of crashing the program.
**Code example:**
```python
try:
    age = int(input("Enter your age: "))
    print(f"You are {age} years old.")
except:
    print("That wasn't a valid number.")
```
**Instructor notes:** Run this with both valid and invalid input live — show the program surviving bad input gracefully for the first time.

---

### Slide 5 — Catching Specific Exceptions
**Explanation:** A bare `except:` catches *everything*, including mistakes you didn't anticipate — better practice is to catch the specific exception type you expect.
**Code example:**
```python
try:
    age = int(input("Enter your age: "))
except ValueError:
    print("Please enter a valid whole number.")
```
**Instructor notes:** Explain why bare `except:` is discouraged: it can silently hide real bugs unrelated to the problem you meant to handle — catching specific types keeps error handling intentional and honest.

---

### Slide 6 — Catching Multiple Exception Types
**Explanation:** A single `try` can have multiple `except` blocks for different error types, or one `except` block catching several types at once using a tuple.
**Code example:**
```python
try:
    num1 = float(input("Enter first number: "))
    num2 = float(input("Enter second number: "))
    print(num1 / num2)
except ValueError:
    print("Please enter valid numbers.")
except ZeroDivisionError:
    print("Cannot divide by zero.")
```
**Instructor notes:** Recap Lesson 5's manual `if b == 0:` divide-by-zero check from the Scientific Calculator — "this is a cleaner, more general way to handle that same problem, alongside other errors at once."

---

### Slide 7 — Accessing the Error Message
**Explanation:** The caught exception can be assigned to a variable (conventionally `e`) to inspect its message — useful for logging or displaying more specific feedback.
**Code example:**
```python
try:
    age = int(input("Enter your age: "))
except ValueError as e:
    print(f"Error: {e}")
```
**Instructor notes:** Keep this practical — students don't need deep exception object theory, just the ability to print a more informative message when useful.

---

### Slide 8 — Using else
**Explanation:** Code in an `else` block runs only if the `try` block completed *without* raising an exception — useful for separating "what happens on success" from the risky operation itself.
**Code example:**
```python
try:
    age = int(input("Enter your age: "))
except ValueError:
    print("Invalid input.")
else:
    print(f"Thanks! You are {age} years old.")
```
**Instructor notes:** Clarify the distinction from simply putting the success code inside `try` — `else` makes it explicit which lines were the "risky" operation and which lines only run after confirmed success, improving readability.

---

### Slide 9 — Using finally
**Explanation:** Code in a `finally` block always runs, whether an exception occurred or not — commonly used for cleanup actions (like closing a file, recap Lesson 8) that must happen regardless of success or failure.
**Code example:**
```python
try:
    file = open("data.txt", "r")
    content = file.read()
except FileNotFoundError:
    print("File not found.")
finally:
    print("Attempted to read the file.")
    file.close() if 'file' in locals() else None
```
**Instructor notes:** Keep the example simple — the goal is understanding *when* `finally` runs (always), not writing complex cleanup logic; note that `with` (Lesson 8) actually handles file-closing automatically in most real cases, but `finally` is the general-purpose tool for any type of required cleanup.

---

### Slide 10 — Putting It All Together
**Code example:**
```python
try:
    amount = float(input("Enter withdrawal amount: "))
    balance = 500
    if amount > balance:
        raise ValueError("Insufficient funds")  # preview of Slide 11
    balance -= amount
except ValueError as e:
    print(f"Transaction failed: {e}")
else:
    print(f"Withdrawal successful. New balance: {balance}")
finally:
    print("Transaction attempt complete.")
```
**Instructor notes:** Walk through the full flow with both a successful and failing withdrawal amount, tracing exactly which blocks run in each case — a genuinely important synthesis moment for the whole lesson.

---

### Slide 11 — Raising Your Own Errors
**Explanation:** `raise` deliberately triggers an exception — useful when your own program logic detects an invalid situation that should be treated as an error, not just an unexpected crash.
**Code example:**
```python
def withdraw(balance, amount):
    if amount > balance:
        raise ValueError("Insufficient funds")
    return balance - amount

try:
    new_balance = withdraw(500, 700)
except ValueError as e:
    print(f"Error: {e}")
```
**Instructor notes:** Frame `raise` as "giving your own code a voice to say 'something is wrong here'" — connects `try`/`except` handling with proactive error *creation*, not just reacting to Python's built-in errors.

---

### Slide 12 — Planning the Banking Application
**Explanation:** Plan functions (recap Lesson 5) for `deposit`, `withdraw`, and `check_balance`, each wrapped in appropriate error handling — combine with a menu loop (recap Lesson 5/6/7's established pattern).
**Instructor notes:** Reinforce planning function responsibilities before coding — by now, an established habit across the course.

---

### Slide 13 — Building the Banking Application
**Code example:**
```python
balance = 0

def deposit(amount):
    global balance
    if amount <= 0:
        raise ValueError("Deposit amount must be positive")
    balance += amount

def withdraw(amount):
    global balance
    if amount > balance:
        raise ValueError("Insufficient funds")
    balance -= amount

while True:
    print(f"\nCurrent balance: {balance}")
    print("1. Deposit  2. Withdraw  3. Quit")
    choice = input("Choose an option: ")

    if choice == "3":
        print("Thank you for banking with us!")
        break

    try:
        amount = float(input("Enter amount: "))
        if choice == "1":
            deposit(amount)
            print("Deposit successful.")
        elif choice == "2":
            withdraw(amount)
            print("Withdrawal successful.")
        else:
            print("Invalid option.")
    except ValueError as e:
        print(f"Transaction failed: {e}")
    finally:
        print("Transaction attempt complete.")
```
**Instructor notes:** Point out `global balance` here — the first real, motivated use of the `global` keyword, directly connecting back to Lesson 5's local/global scope discussion ("functions need this keyword to modify a variable defined outside them, rather than just reading it"). Build incrementally: get deposit/withdraw functions and their `raise` logic working and tested independently first, then wrap the menu loop and `try`/`except` around them.

---

## 5. Practical Exercises During Class

1. **Traceback reading drill:** Instructor shows 3 different tracebacks (from errors seen in past lessons); students identify the error type and likely cause from the message alone.
2. **try/except drill:** Students wrap a risky `int(input(...))` call in proper error handling with a friendly message.
3. **else/finally drill:** Students add `else` and `finally` blocks to an existing `try`/`except` and predict which blocks run for both valid and invalid input.
4. **Full build-along:** Every student builds the Banking Application with the instructor.

---

## 6. Homework Assignment

Build a **Login System**: a program that checks a username/password against hardcoded correct values, using `try`/`except` to handle non-string or empty input gracefully, and allowing 3 attempts before locking the user out with a friendly message.

---

## 7. Mini Project — Banking Application

**Brief:** "Build a simple banking app that never crashes on bad input — deposits, withdrawals, and balance checks, all handled gracefully."

**Requirements:**
- `deposit()` and `withdraw()` functions using `raise` to signal invalid operations (negative deposits, insufficient funds)
- Menu loop wrapped in `try`/`except` catching `ValueError`
- `finally` block confirming each transaction attempt completed
- Balance displayed and updated correctly after every valid transaction
- Program never crashes regardless of what the user types

**Stretch goal:** Add transaction logging to a text file (recap Lesson 8) inside the `finally` block, recording every attempted transaction (successful or not) with a timestamp (a light preview of Lesson 10's `datetime` module).

---

## 8. Common Beginner Mistakes

- Using a bare `except:` that silently swallows all errors, including genuine bugs unrelated to the expected problem.
- Forgetting that `else` only runs when no exception occurred, and mistakenly placing success logic inside `try` when clarity would benefit from `else`.
- Assuming `finally` is optional cleanup that can be skipped — forgetting it always runs, even after a `return` inside a function.
- Confusing `raise` (creating a new error) with `except` (catching an existing one).
- Catching an exception type that's too broad (e.g., catching `Exception` generally) when a specific type would give clearer, more actionable handling.
- Forgetting the `global` keyword when a function needs to modify a variable defined outside it, causing confusing `UnboundLocalError` issues.

---

## 9. Extra Resources

- [Python Docs — Errors and Exceptions](https://docs.python.org/3/tutorial/errors.html)
- [Python Docs — Built-in Exceptions Reference](https://docs.python.org/3/library/exceptions.html)
- [W3Schools — Python Try Except](https://www.w3schools.com/python/python_try_except.asp)
