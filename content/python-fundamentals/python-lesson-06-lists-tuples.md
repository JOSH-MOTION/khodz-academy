
# Lesson 6 — Lists & Tuples

**Khodz Academy — Python Fundamentals for Beginners**
**Session:** 6 of 12 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Create and use lists to store collections of data.
2. Access list items using indexing and slicing.
3. Modify lists using common built-in methods.
4. Loop through lists.
5. Understand tuples and how they differ from lists.
6. Build a working Shopping List Manager.

---

## 2. Skills Students Will Learn

- Creating a list (`[]`)
- Indexing (accessing items by position, including negative indexes)
- Slicing (extracting a sub-portion of a list)
- Common list methods: `.append()`, `.remove()`, `.insert()`, `.sort()`, `.pop()`
- Looping through a list with `for`
- The `len()` and `in` operators applied to lists
- Tuples: what they are, how they differ from lists (immutability)
- When to use a list vs. a tuple

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Lesson 5 + show and tell |
| 0:10–0:20 | Why lists matter (Slides 1–2) |
| 0:20–0:45 | Creating, indexing, and slicing lists (Slides 3–6) — live coding |
| 0:45–1:05 | List methods and looping (Slides 7–9) — live coding |
| 1:05–1:20 | Tuples (Slides 10–12) — live coding |
| 1:20–1:30 | Building the Shopping List Manager (Slide 13) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — The Problem: Storing Many Related Values
**Explanation:** Storing multiple related values in separate variables (`item1`, `item2`, `item3`) doesn't scale and makes looping through them impossible. A list stores an ordered collection of values in a single variable.
**Instructor notes:** Show the separate-variables approach briefly to make the problem concrete before introducing the fix.

---

### Slide 2 — Why Lists Matter
**Explanation:** Lists are one of the most-used data structures in Python — shopping lists, student records, search results, game inventories, and virtually any "collection of things" in a program.
**Real-world example:** Recall Lesson 2's Student Information System, which used three separate score variables (`score1`, `score2`, `score3`) — a list can hold any number of scores in one place, scaling to any class size.
**Instructor notes:** This callback to a real limitation from an earlier lesson makes the motivation concrete rather than hypothetical.

---

### Slide 3 — Creating a List
**Code example:**
```python
fruits = ["apple", "banana", "orange"]
scores = [85, 92, 78, 90]
mixed = ["Amaka", 24, True]  # lists can hold mixed types
```
**Instructor notes:** Point out lists can hold any data type, and even mix types — flexible, unlike some other languages students may have heard of.

---

### Slide 4 — Indexing: Accessing Items by Position
**Explanation:** Items are accessed by position, starting at index 0 (recap the "index starts at 0" concept, foundational across nearly every programming language).
**Code example:**
```python
fruits = ["apple", "banana", "orange"]
print(fruits[0])   # apple
print(fruits[2])   # orange
print(fruits[-1])  # orange — negative indexing counts from the end
```
**Instructor notes:** Introduce negative indexing explicitly as a genuinely useful Python feature — "last item" (`-1`) is used constantly in real code.

---

### Slide 5 — Modifying List Items
**Explanation:** Unlike strings, lists are mutable — individual items can be changed after creation.
**Code example:**
```python
fruits = ["apple", "banana", "orange"]
fruits[1] = "mango"
print(fruits)  # ['apple', 'mango', 'orange']
```
**Instructor notes:** Foreshadow Slide 10's tuple comparison — "this works because lists are mutable; tuples, coming up, are not."

---

### Slide 6 — Slicing: Extracting a Sub-List
**Explanation:** `list[start:stop]` extracts a portion of a list — `start` is included, `stop` is excluded (same "stops before" behavior as `range()` from Lesson 4).
**Code example:**
```python
numbers = [10, 20, 30, 40, 50]
print(numbers[1:3])   # [20, 30]
print(numbers[:2])     # [10, 20] — omit start to begin from index 0
print(numbers[2:])     # [30, 40, 50] — omit stop to go to the end
```
**Instructor notes:** Directly recap `range()`'s "stops before" behavior from Lesson 4 — same underlying convention, reinforces pattern recognition across the course.

---

### Slide 7 — Common List Methods: append, insert, remove
**Code example:**
```python
fruits = ["apple", "banana"]
fruits.append("orange")          # adds to the end
fruits.insert(1, "mango")         # inserts at a specific position
fruits.remove("banana")           # removes by value
print(fruits)  # ['apple', 'mango', 'orange']
```
**Instructor notes:** These three methods cover the vast majority of real list manipulation needs — worth memorizing through repeated practice rather than just reading about.

---

### Slide 8 — Common List Methods: sort, pop, len
**Code example:**
```python
scores = [85, 92, 78, 90]
scores.sort()
print(scores)  # [78, 85, 90, 92]

last_score = scores.pop()  # removes and returns the last item
print(last_score)  # 92
print(len(scores))  # 3
```
**Instructor notes:** Point out `.pop()` both removes *and* returns the item — a useful two-in-one behavior worth calling out explicitly since it's a slightly different pattern than `.remove()`.

---

### Slide 9 — Looping Through a List
**Explanation:** `for` loops (recap Lesson 4) naturally iterate over every item in a list — one of the most common loop patterns in all of Python.
**Code example:**
```python
fruits = ["apple", "banana", "orange"]

for fruit in fruits:
    print(f"I like {fruit}")

# Checking membership:
if "banana" in fruits:
    print("Banana is in the list!")
```
**Instructor notes:** Introduce `in` here as a natural extension — recap its brief preview from Lesson 3's Grade Checker, now given proper treatment as a list-membership check.

---

### Slide 10 — Introducing Tuples
**Explanation:** A tuple is an ordered collection like a list, but written with parentheses `()` instead of brackets, and **immutable** — once created, its contents cannot be changed.
**Code example:**
```python
coordinates = (10, 20)
person = ("Amaka", 24, "Lagos")
```
**Instructor notes:** Introduce the term "immutable" clearly and simply: "once you make it, you can't change what's inside it."

---

### Slide 11 — Why Use a Tuple Instead of a List?
**Explanation:** Tuples signal to anyone reading the code "this data shouldn't change" — useful for fixed collections like coordinates, RGB colors, or a function's multiple return values (recap Lesson 5, Slide 10).
**Code example:**
```python
coordinates = (10, 20)
# coordinates[0] = 15  # ❌ TypeError: 'tuple' object does not support item assignment
```
**Instructor notes:** Trigger this error live — makes the immutability concept concrete rather than purely theoretical. Directly recap Lesson 5's multi-return-value example as a real tuple use case students have already seen.

---

### Slide 12 — Accessing Tuple Items
**Explanation:** Tuples support the same indexing and slicing as lists — the *access* patterns are identical; only *modification* is restricted.
**Code example:**
```python
person = ("Amaka", 24, "Lagos")
print(person[0])   # Amaka
print(person[-1])  # Lagos

name, age, city = person  # "unpacking" — assigns each value to a variable
print(name, age, city)
```
**Instructor notes:** Introduce tuple unpacking here — a genuinely elegant Python feature, and directly connects back to Lesson 5's `low, high = get_min_max(...)` example, resolving that earlier "magic" as ordinary tuple unpacking.

---

### Slide 13 — Building the Shopping List Manager
**Explanation:** Combine today's list skills into a menu-driven program (recap Lesson 5's menu loop pattern) for managing a shopping list: add items, remove items, view the list, and quit.
**Code example:**
```python
shopping_list = []

while True:
    print("\n1. Add item  2. Remove item  3. View list  4. Quit")
    choice = input("Choose an option: ")

    if choice == "1":
        item = input("Enter item to add: ")
        shopping_list.append(item)
        print(f"{item} added.")
    elif choice == "2":
        item = input("Enter item to remove: ")
        if item in shopping_list:
            shopping_list.remove(item)
            print(f"{item} removed.")
        else:
            print("Item not found.")
    elif choice == "3":
        print("\nYour Shopping List:")
        for i, item in enumerate(shopping_list, start=1):
            print(f"{i}. {item}")
    elif choice == "4":
        print("Goodbye!")
        break
    else:
        print("Invalid option, please try again.")
```
**Instructor notes:** Introduce `enumerate()` here as a small, practical bonus — "gives you both the position and the item while looping, perfect for numbered lists like this one." Build incrementally: get add/view working first, then remove, then quit — consistent with the course's established "small steps" habit.

---

## 5. Practical Exercises During Class

1. **Indexing/slicing drill:** Given a list of 6 items, students write expressions to get the first item, last item, and middle three items.
2. **Method drill:** Students build a list of 3 favorite movies, then add a 4th, remove one, and sort the result.
3. **Tuple drill:** Students create a tuple representing a point `(x, y)` and unpack it into two variables.
4. **Full build-along:** Every student builds the Shopping List Manager with the instructor.

---

## 6. Homework Assignment

Build a **Student Attendance Tracker**: a program that stores a list of student names, lets the user mark a name as "present" (removing it from an "absent" list, or similar logic of your design), and displays the final attendance summary using a loop.

---

## 7. Mini Project — Shopping List Manager

**Brief:** "Build a menu-driven program to manage a shopping list — add, remove, and view items."

**Requirements:**
- Uses a list to store shopping items
- Menu loop (recap Lesson 5) offering add, remove, view, and quit options
- Add functionality using `.append()`
- Remove functionality using `.remove()`, with a check for whether the item exists first
- View functionality that loops through and numbers each item (using `enumerate()`)
- Runs without errors for valid input

**Stretch goal:** Add a "clear list" option that empties the list, and prevent adding duplicate items already present in the list.

---

## 8. Common Beginner Mistakes

- Off-by-one errors from misunderstanding index 0 as the starting position.
- Forgetting slicing's "stop is excluded" behavior (recap from `range()` in Lesson 4).
- Attempting to modify a tuple, causing a `TypeError`.
- Using `.remove()` on an item not present in the list, causing a `ValueError` (fixed by checking `in` first, as shown in Slide 13).
- Confusing `.pop()` (removes by position, returns the value) with `.remove()` (removes by value).
- Forgetting `enumerate()`'s `start` parameter defaults to 0, producing off-by-one numbering if not adjusted for human-friendly display.

---

## 9. Extra Resources

- [Python Docs — Lists](https://docs.python.org/3/tutorial/introduction.html#lists)
- [Python Docs — More on Lists (all list methods)](https://docs.python.org/3/tutorial/datastructures.html#more-on-lists)
- [Python Docs — Tuples and Sequences](https://docs.python.org/3/tutorial/datastructures.html#tuples-and-sequences)
- [W3Schools — Python Lists](https://www.w3schools.com/python/python_lists.asp)
