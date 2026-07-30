
# Lesson 7 — Dictionaries & Sets

**Khodz Academy — Python Fundamentals for Beginners**
**Session:** 7 of 12 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Create and use dictionaries to store key-value data.
2. Access, add, update, and remove dictionary items.
3. Loop through dictionaries correctly.
4. Build and use nested dictionaries.
5. Create and use sets, understanding how they differ from lists.
6. Build a working Student Record System.

---

## 2. Skills Students Will Learn

- Creating a dictionary (`{}`) with key-value pairs
- Accessing values by key, including safe access with `.get()`
- Adding, updating, and removing entries
- Looping through keys, values, and key-value pairs (`.keys()`, `.values()`, `.items()`)
- Nested dictionaries (a dictionary containing other dictionaries)
- Creating and using sets (`set()`), and set uniqueness behavior
- When to choose a dictionary vs. a list vs. a set

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Lesson 6 + show and tell |
| 0:10–0:20 | The problem with lists for labeled data (Slides 1–2) |
| 0:20–0:45 | Dictionaries: creating, accessing, modifying (Slides 3–7) — live coding |
| 0:45–1:00 | Nested dictionaries (Slides 8–9) — live coding |
| 1:00–1:15 | Sets (Slides 10–12) — live coding |
| 1:15–1:30 | Building the Student Record System (Slide 13) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — The Problem: Lists Don't Label Their Data
**Explanation:** A list like `["Amaka", 24, "Lagos"]` stores related data, but you have to remember that position 0 is the name, position 1 is age, and so on — fragile and unreadable, especially as data grows.
**Instructor notes:** Recall Lesson 6's `person = ("Amaka", 24, "Lagos")` tuple example — show how easy it is to lose track of what each position means without labels.

---

### Slide 2 — Dictionaries: Labeled Data
**Explanation:** A dictionary stores data as key-value pairs — each value has a descriptive label (the key), making code far more readable and less error-prone.
**Real-world example:** A real dictionary: you look up a word (the key) to find its definition (the value) — Python dictionaries work the same way, but keys and values can be almost any type.
**Instructor notes:** This analogy (the word "dictionary" itself) tends to land immediately for beginners — lean into it.

---

### Slide 3 — Creating a Dictionary
**Code example:**
```python
student = {
    "name": "Amaka",
    "age": 24,
    "city": "Lagos"
}
```
**Instructor notes:** Rewrite Slide 1's unlabeled tuple/list as this dictionary side by side — a clear, immediate before/after.

---

### Slide 4 — Accessing Values
**Code example:**
```python
print(student["name"])   # Amaka
print(student["age"])     # 24
```
**Instructor notes:** Show what happens when accessing a key that doesn't exist (`KeyError`) — sets up the next slide's safer alternative.

---

### Slide 5 — Safe Access with .get()
**Explanation:** `.get()` returns `None` (or a specified default) instead of crashing when a key doesn't exist — safer than direct bracket access when a key's presence isn't guaranteed.
**Code example:**
```python
print(student.get("email"))              # None — no crash
print(student.get("email", "Not provided"))  # Not provided — custom default
```
**Instructor notes:** Foreshadow Lesson 9 (error handling) — "this is one way to avoid a crash; next week, you'll learn a more general tool (`try`/`except`) for handling any unexpected situation."

---

### Slide 6 — Adding and Updating Entries
**Explanation:** Assigning to a new key adds it; assigning to an existing key updates it — the same syntax handles both cases.
**Code example:**
```python
student["email"] = "amaka@email.com"  # adds a new key
student["age"] = 25                    # updates an existing key
print(student)
```
**Instructor notes:** Point out this dual behavior explicitly — a common early question is "how do I update vs. add?" — the answer is simply "the same way."

---

### Slide 7 — Removing Entries and Looping
**Code example:**
```python
del student["city"]

for key in student:
    print(key, ":", student[key])

for key, value in student.items():
    print(f"{key}: {value}")
```
**Instructor notes:** Show both looping styles — plain `for key in student` (common but requires bracket access) and `.items()` (cleaner, unpacks both at once) — recommend `.items()` as the generally preferred style for readability.

---

### Slide 8 — Nested Dictionaries
**Explanation:** A dictionary's values can themselves be dictionaries — useful for representing more complex, structured data (e.g., multiple students, each with their own details).
**Code example:**
```python
students = {
    "s001": {"name": "Amaka", "age": 24, "grade": "A"},
    "s002": {"name": "Tunde", "age": 22, "grade": "B"}
}

print(students["s001"]["name"])  # Amaka
```
**Instructor notes:** This structure directly previews today's mini project — point that out explicitly before building it.

---

### Slide 9 — Looping Through Nested Dictionaries
**Code example:**
```python
for student_id, details in students.items():
    print(f"{student_id}: {details['name']}, Age {details['age']}, Grade {details['grade']}")
```
**Instructor notes:** Walk through this slowly — nested access (`details['name']` inside a loop that's already unpacking `.items()`) is one of today's denser ideas; build it up piece by piece rather than presenting it all at once.

---

### Slide 10 — Introducing Sets
**Explanation:** A set is an unordered collection of **unique** values — duplicates are automatically removed.
**Code example:**
```python
numbers = {1, 2, 2, 3, 3, 3}
print(numbers)  # {1, 2, 3} — duplicates removed automatically
```
**Instructor notes:** Run this live and let the "duplicates disappear automatically" behavior speak for itself — a memorable, visual demonstration of what makes sets distinct.

---

### Slide 11 — Common Set Operations
**Code example:**
```python
fruits = {"apple", "banana", "orange"}
fruits.add("mango")
fruits.remove("banana")
print(fruits)

# Set math:
a = {1, 2, 3}
b = {2, 3, 4}
print(a & b)  # intersection: {2, 3}
print(a | b)  # union: {1, 2, 3, 4}
print(a - b)  # difference: {1}
```
**Instructor notes:** Keep set math brief and practical — the goal is recognition, not mastery; students will use sets mainly for uniqueness/deduplication in this course.

---

### Slide 12 — When to Use a Dictionary vs. a List vs. a Set
**Explanation:** Use a **list** for an ordered collection where duplicates and order matter. Use a **dictionary** when each value needs a descriptive label. Use a **set** when you only care about unique values and don't need order.
**Real-world example:** A shopping list (Lesson 6) → list. A student's profile (name, age, grade) → dictionary. A list of unique visitor emails → set.
**Instructor notes:** This decision-guide slide is the day's key takeaway — have students copy it into their notes, mirroring the "choosing the right pattern" habit established in other Khodz Academy courses.

---

### Slide 13 — Building the Student Record System
**Explanation:** Combine today's dictionary skills into a menu-driven program (recap Lesson 5's menu pattern) for managing student records using a dictionary of dictionaries.
**Code example:**
```python
students = {}

while True:
    print("\n1. Add student  2. View student  3. View all  4. Quit")
    choice = input("Choose an option: ")

    if choice == "1":
        student_id = input("Enter student ID: ")
        name = input("Enter name: ")
        grade = input("Enter grade: ")
        students[student_id] = {"name": name, "grade": grade}
        print("Student added.")
    elif choice == "2":
        student_id = input("Enter student ID to view: ")
        student = students.get(student_id)
        if student:
            print(f"{student_id}: {student['name']}, Grade {student['grade']}")
        else:
            print("Student not found.")
    elif choice == "3":
        for student_id, details in students.items():
            print(f"{student_id}: {details['name']}, Grade {details['grade']}")
    elif choice == "4":
        print("Goodbye!")
        break
    else:
        print("Invalid option, please try again.")
```
**Instructor notes:** Point out `.get()` used defensively in option 2 — a direct, practical application of Slide 5's safer-access lesson, rather than risking a `KeyError` crash on a mistyped ID.

---

## 5. Practical Exercises During Class

1. **Dictionary drill:** Students build a dictionary representing themselves (name, age, favorite hobby) and print each value with a label.
2. **.get() drill:** Students practice safely accessing a key that may or may not exist, using a custom default message.
3. **Nested dictionary drill:** Students build a small nested dictionary of 2 friends' contact info and loop through printing each one's details.
4. **Set drill:** Students create a set from a list containing duplicates and confirm the duplicates are removed.
5. **Full build-along:** Every student builds the Student Record System with the instructor.

---

## 6. Homework Assignment

Build a **Phone Contact Manager**: a menu-driven program using a dictionary (name as key, phone number as value) to add, view, update, and delete contacts.

---

## 7. Mini Project — Student Record System

**Brief:** "Build a system to manage student records, storing each student's details under their unique ID."

**Requirements:**
- Uses a dictionary of dictionaries (student ID → student details)
- Menu loop offering add, view one, view all, and quit options
- Safe access using `.get()` where a lookup might fail
- Clean, labeled output when displaying student information
- Runs without errors for valid input

**Stretch goal:** Add an "update grade" option that finds a student by ID and updates just their grade field, and a "delete student" option using `del`.

---

## 8. Common Beginner Mistakes

- Accessing a dictionary key that doesn't exist with `[]` instead of `.get()`, causing a `KeyError`.
- Forgetting quotes around string keys (`student[name]` instead of `student["name"]`), causing a `NameError`.
- Confusing dictionary key order with list order — dictionaries preserve insertion order in modern Python, but shouldn't be relied on the same way a list's order is used for indexing (dictionaries aren't indexed by position).
- Trying to access a set by index (`my_set[0]`) — sets are unordered and don't support indexing.
- Overwriting an existing key accidentally when intending to add a new one (a typo in the key name).
- Forgetting `.items()` when looping if both key and value are needed, leading to awkward extra bracket-lookups inside the loop.

---

## 9. Extra Resources

- [Python Docs — Dictionaries](https://docs.python.org/3/tutorial/datastructures.html#dictionaries)
- [Python Docs — Sets](https://docs.python.org/3/tutorial/datastructures.html#sets)
- [W3Schools — Python Dictionaries](https://www.w3schools.com/python/python_dictionaries.asp)
- [W3Schools — Python Sets](https://www.w3schools.com/python/python_sets.asp)
