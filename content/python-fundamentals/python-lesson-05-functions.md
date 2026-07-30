
# Lesson 5 — Functions

**Khodz Academy — Python Fundamentals for Beginners**
**Session:** 5 of 12 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Explain why functions exist and the problems they solve.
2. Create functions using `def`.
3. Use parameters and arguments to make functions flexible.
4. Use `return` to send values back from a function.
5. Understand variable scope (local vs. global).
6. Build a Scientific Calculator organized around functions.

---

## 2. Skills Students Will Learn

- Defining a function with `def`
- Calling a function
- Parameters vs. arguments
- Default parameter values
- `return` vs. `print()` inside a function
- Functions that return multiple values
- Variable scope: local vs. global
- Organizing a program's logic into well-named, single-purpose functions

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Lesson 4 + show and tell |
| 0:10–0:20 | Why functions matter (Slides 1–2) |
| 0:20–0:40 | Creating and calling functions (Slides 3–5) — live coding |
| 0:40–1:00 | Parameters, arguments, defaults (Slides 6–8) — live coding |
| 1:00–1:15 | return values and scope (Slides 9–11) — live coding |
| 1:15–1:30 | Building the Scientific Calculator (Slides 12–13) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — The Problem: Repeated Logic
**Explanation:** Without functions, repeated logic (like calculating a grade, or validating input) must be copy-pasted everywhere it's needed — hard to maintain, and error-prone if the logic ever needs to change.
**Real-world example:** Recall Lesson 3's Grade Checker logic — if that grading logic were needed in three different places in a bigger program, copy-pasting it three times means fixing bugs in three places too.
**Instructor notes:** Ground this in a project students already built — makes the motivation concrete rather than abstract.

---

### Slide 2 — Why Functions Matter
**Explanation:** A function is a named, reusable block of code — write the logic once, and run it as many times as needed, optionally with different inputs. This is one of the most important ideas in all of programming.
**Real-world example:** A vending machine: the same "dispense item" mechanism runs every time, just with a different selected item each time (the input).
**Instructor notes:** This analogy (same mechanism, different input) is worth returning to throughout today's lesson.

---

### Slide 3 — Defining Your First Function
**Explanation:** `def` defines a function; the code inside runs only when the function is *called*, not when it's defined.
**Code example:**
```python
def greet():
    print("Hello, welcome to Khodz Academy!")

greet()  # this line actually runs the function
```
**Instructor notes:** Comment out the call and re-run to prove nothing happens without it — demonstrates clearly that defining and calling are two separate steps.

---

### Slide 4 — Calling a Function Multiple Times
**Explanation:** Once defined, a function can be called as many times as needed.
**Code example:**
```python
def greet():
    print("Hello, welcome to Khodz Academy!")

greet()
greet()
greet()
```
**Instructor notes:** Reinforce the "write once, use many times" value proposition directly and visibly.

---

### Slide 5 — Naming Functions Well
**Explanation:** Function names should be verbs describing what they do (`calculate_average`, `check_password`), following the same `snake_case` convention as variables (recap Lesson 1).
**Code example:**
```python
# ✅ Good
def calculate_average(scores):
    ...

# ❌ Unclear
def do_thing(x):
    ...
```
**Instructor notes:** Frame good function naming as a professional habit with the exact same reasoning as Lesson 1's variable naming — self-documenting code reduces the need for excessive comments.

---

### Slide 6 — Parameters: Making Functions Flexible
**Explanation:** A parameter is a placeholder input a function expects — makes a function work with different data each time it's called, instead of hardcoded values.
**Code example:**
```python
def greet(name):
    print(f"Hello, {name}!")

greet("Amaka")
greet("Tunde")
```
**Instructor notes:** Directly recap the "vending machine" analogy — the selected item is the parameter.

---

### Slide 7 — Parameters vs. Arguments
**Explanation:** A **parameter** is the placeholder name in the function definition; an **argument** is the actual value passed in when calling it. The terms are related but distinct.
**Code example:**
```python
def greet(name):  # "name" is the parameter
    print(f"Hello, {name}!")

greet("Amaka")  # "Amaka" is the argument
```
**Instructor notes:** This distinction is often glossed over but worth stating precisely — students will encounter both terms constantly in documentation and error messages going forward.

---

### Slide 8 — Default Parameter Values
**Explanation:** A parameter can have a default value, used automatically if no argument is provided for it.
**Code example:**
```python
def greet(name="friend"):
    print(f"Hello, {name}!")

greet("Amaka")  # Hello, Amaka!
greet()         # Hello, friend!
```
**Instructor notes:** A small but genuinely useful pattern — flag it as something students will see often in real-world Python code and libraries.

---

### Slide 9 — Returning Values with return
**Explanation:** `return` sends a value back out of a function so it can be used elsewhere (stored in a variable, used in a calculation) — different from `print()`, which only displays a value and doesn't make it usable afterward.
**Code example:**
```python
def add(a, b):
    return a + b

result = add(5, 3)
print(result)  # 8
print(add(10, 20) + 1)  # 31 — the returned value can be used directly in more code
```
**Instructor notes:** This distinction (`return` vs `print`) is one of the most important and most commonly confused ideas in the whole course — spend real time here, with a clear live demo of a function that only `print()`s failing to be usable in further calculation.

---

### Slide 10 — Functions Returning Multiple Values
**Explanation:** Python functions can return multiple values at once, separated by commas — they're automatically packaged as a tuple (full tuple coverage in Lesson 6).
**Code example:**
```python
def get_min_max(a, b, c):
    return min(a, b, c), max(a, b, c)

low, high = get_min_max(4, 9, 2)
print(low, high)  # 2 9
```
**Instructor notes:** Keep this as a practical preview — full tuple mechanics are covered properly next lesson; today, it's simply "yes, you can return more than one thing."

---

### Slide 11 — Variable Scope: Local vs. Global
**Explanation:** A variable created inside a function (a **local** variable) only exists within that function — it can't be accessed outside it. Variables created outside any function are **global** and accessible everywhere.
**Code example:**
```python
def calculate_total():
    total = 100  # local variable — only exists inside this function
    return total

print(calculate_total())  # 100
print(total)  # ❌ NameError: name 'total' is not defined
```
**Instructor notes:** Trigger this error live — a very common beginner confusion ("but I just used `total` a second ago!"). Explain the mental model: "each function has its own private workspace for its local variables."

---

### Slide 12 — Planning the Scientific Calculator
**Explanation:** Plan the calculator's structure around functions: one function per operation (`add`, `subtract`, `multiply`, `divide`, `power`, `square_root`), each taking numeric parameters and returning a result — a menu loop (recap Lesson 4's `while True` + `break`) lets the user choose repeatedly.
**Instructor notes:** Reinforce the "plan the function names and responsibilities before coding" habit — mirrors the general "plan before you build" theme from earlier lessons in other Khodz Academy courses.

---

### Slide 13 — Building the Scientific Calculator
**Code example:**
```python
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b == 0:
        return "Error: cannot divide by zero"
    return a / b

def power(a, b):
    return a ** b

while True:
    print("\n1. Add  2. Subtract  3. Multiply  4. Divide  5. Power  6. Quit")
    choice = input("Choose an option: ")

    if choice == "6":
        print("Goodbye!")
        break

    num1 = float(input("Enter first number: "))
    num2 = float(input("Enter second number: "))

    if choice == "1":
        print(f"Result: {add(num1, num2)}")
    elif choice == "2":
        print(f"Result: {subtract(num1, num2)}")
    elif choice == "3":
        print(f"Result: {multiply(num1, num2)}")
    elif choice == "4":
        print(f"Result: {divide(num1, num2)}")
    elif choice == "5":
        print(f"Result: {power(num1, num2)}")
    else:
        print("Invalid option, please try again.")
```
**Instructor notes:** Build this incrementally: write and test each function individually first (calling them directly with fixed numbers), *then* wrap the menu loop around them — reinforces that functions can and should be tested independently before being wired into a larger program.

---

## 5. Practical Exercises During Class

1. **Function drill:** Students write a `square(n)` function that returns `n * n`, and test it with 3 different inputs.
2. **Parameters vs. arguments quiz:** Instructor shows a function definition and call; students identify which parts are parameters and which are arguments.
3. **Scope drill:** Instructor shows the Slide 11 error live; students explain in their own words why it happens.
4. **Full build-along:** Every student builds the Scientific Calculator's functions with the instructor, then wires up the menu loop.

---

## 6. Homework Assignment

Build a **Unit Converter**: a program with separate functions for converting kilometers to miles, Celsius to Fahrenheit, and kilograms to pounds, tied together with a menu loop (recap today's calculator structure).

---

## 7. Mini Project — Scientific Calculator

**Brief:** "Build a calculator organized around clean, reusable functions — one per operation — with a menu the user can navigate repeatedly."

**Requirements:**
- At least 5 operation functions (add, subtract, multiply, divide, power), each using `return`, not just `print()`
- A menu loop (recap Lesson 4) allowing repeated calculations until the user chooses to quit
- Divide-by-zero handled gracefully (returns a friendly message rather than crashing)
- Clean, descriptive function names following naming conventions
- Runs without errors for valid input

**Stretch goal:** Add a `square_root(a)` function using `a ** 0.5`, and a history feature that stores and displays the last 5 calculations (a light preview of Lesson 6's lists).

---

## 8. Common Beginner Mistakes

- Confusing `return` with `print()` — trying to use a function's printed output in a calculation and getting `None` instead.
- Forgetting `return` entirely, causing a function to implicitly return `None`.
- Trying to access a local variable from outside its function.
- Giving a function too many responsibilities instead of splitting it into smaller, single-purpose functions (recap the "small functions, single responsibility" principle referenced across Khodz Academy's other courses).
- Forgetting parentheses when calling a function (`greet` instead of `greet()`), which references the function itself rather than running it.
- Mismatching the number of arguments to a function's defined parameters, causing a `TypeError`.

---

## 9. Extra Resources

- [Python Docs — Defining Functions](https://docs.python.org/3/tutorial/controlflow.html#defining-functions)
- [Python Docs — More on Defining Functions (default arguments)](https://docs.python.org/3/tutorial/controlflow.html#more-on-defining-functions)
- [W3Schools — Python Functions](https://www.w3schools.com/python/python_functions.asp)
- [W3Schools — Python Scope](https://www.w3schools.com/python/python_scope.asp)
