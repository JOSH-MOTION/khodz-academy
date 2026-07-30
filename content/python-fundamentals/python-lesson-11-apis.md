
# Lesson 11 — APIs with Python

**Khodz Academy — Python Fundamentals for Beginners**
**Session:** 11 of 12 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Explain what an API is and how client-server communication works.
2. Install and use the `requests` library.
3. Make GET requests to a real public API.
4. Parse and work with JSON data in Python.
5. Handle API errors gracefully.
6. Build a Weather App and a Country Information App.

---

## 2. Skills Students Will Learn

- What an API is, HTTP basics (recap conceptually from a programming, non-browser perspective)
- Installing third-party packages with `pip install`
- Making GET requests with `requests.get()`
- Checking response status codes
- Parsing JSON responses with `.json()`
- Accessing nested JSON data (dictionaries and lists, recap Lessons 6–7)
- Handling API errors with `try`/`except` (recap Lesson 9) and status code checks

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Lesson 10 + show and tell |
| 0:10–0:20 | What is an API? (Slides 1–2) |
| 0:20–0:35 | Installing and using requests (Slides 3–5) — hands-on |
| 0:35–1:00 | Working with JSON (Slides 6–9) — live coding |
| 1:00–1:15 | Error handling for APIs (Slide 10) — live coding |
| 1:15–1:30 | Building the Weather App + Country Info App (Slides 11–13) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — What Is an API?
**Explanation:** An API (Application Programming Interface) lets one program request data or functionality from another — typically over the internet, from a server you don't control. Your Python program becomes a **client** making requests to a **server**.
**Real-world example:** A weather app doesn't know the weather itself — it asks a weather service's API for current data and uses the response.
**Instructor notes:** If students have taken Khodz Academy's web development courses, note this is the exact same concept taught there (client-server, fetch/APIs) — just consumed from a standalone Python script instead of a browser.

---

### Slide 2 — GET Requests and JSON (Conceptual Overview)
**Explanation:** Most simple APIs are accessed via GET requests (asking for data, not sending/changing anything) — the server responds, usually in **JSON** format, a lightweight, text-based way to represent structured data (looks almost identical to Python dictionaries and lists).
**Code example:**
```json
{
  "city": "Lagos",
  "temperature": 31,
  "condition": "Sunny"
}
```
**Instructor notes:** Point out explicitly: "this JSON structure is basically a Python dictionary written as text — that similarity is exactly why working with API data in Python feels so natural."

---

### Slide 3 — Installing the requests Library
**Explanation:** `requests` is a popular third-party package (recap Lesson 10's standard library vs. third-party distinction) that makes HTTP requests simple in Python — not built in, so it must be installed first.
**Code example:**
```bash
pip install requests
```
**Instructor notes:** Do this live and confirm every student's installation succeeds before proceeding — a hard checkpoint, since nothing today works without it.

---

### Slide 4 — Making Your First GET Request
**Code example:**
```python
import requests

response = requests.get("https://restcountries.com/v3.1/name/nigeria")
print(response.status_code)  # 200 means success
print(response.text)          # raw response, as text
```
**Instructor notes:** Run this live and look at the raw, messy `.text` output together — motivates the next slide's cleaner `.json()` approach.

---

### Slide 5 — Understanding Status Codes
**Explanation:** `200` = success. `404` = not found (bad URL/resource). `401`/`403` = authentication/permission issue (often a missing/invalid API key). `500` = server error, not your fault.
**Instructor notes:** Frame this as a debugging tool — "when a request doesn't work as expected, the status code is the first thing to check," directly recapping the general debugging mindset from earlier lessons.

---

### Slide 6 — Parsing JSON with .json()
**Explanation:** `.json()` converts the response's JSON text into a real Python data structure (dictionaries and lists) that can be worked with directly.
**Code example:**
```python
import requests

response = requests.get("https://restcountries.com/v3.1/name/nigeria")
data = response.json()
print(type(data))  # <class 'list'>
print(data[0]["name"]["common"])  # Nigeria
```
**Instructor notes:** Point out `data` behaves exactly like the lists and dictionaries from Lessons 6–7 — "everything you already learned about accessing nested data applies directly here, with real, live data from the internet."

---

### Slide 7 — Exploring an Unfamiliar API Response
**Explanation:** Real API responses are often large and unfamiliar — always print/inspect the raw structure first (recap this same advice from earlier course discussions on API work) before writing code that assumes specific fields exist.
**Code example:**
```python
import requests
import json

response = requests.get("https://restcountries.com/v3.1/name/nigeria")
data = response.json()
print(json.dumps(data[0], indent=2))  # pretty-print the structure
```
**Instructor notes:** Introduce `json.dumps(..., indent=2)` as a genuinely useful debugging tool for exploring unfamiliar API data — students should treat this as a first step whenever working with a new API.

---

### Slide 8 — Accessing Nested Data
**Explanation:** Real API responses often nest dictionaries inside lists inside dictionaries — apply Lesson 7's nested dictionary skills directly, one layer at a time.
**Code example:**
```python
country = data[0]
print(country["name"]["common"])          # Nigeria
print(country["capital"][0])               # Abuja
print(country["population"])                # a number
print(country["flags"]["png"])              # URL to a flag image
```
**Instructor notes:** Walk through this slowly, layer by layer — this is one of the day's denser moments; connect explicitly back to Lesson 7's nested dictionary looping exercises.

---

### Slide 9 — Setting Up an API Key (Weather API)
**Explanation:** Many APIs (like OpenWeatherMap) require a free API key for identification — sign up, get a key, and include it as part of the request URL.
**Code example:**
```python
import requests

API_KEY = "your_api_key_here"
city = "Lagos"
url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"

response = requests.get(url)
data = response.json()
print(data["main"]["temp"])
```
**Instructor notes:** Help every student register for a free OpenWeatherMap (or similar) API key during class — resolve this friction live rather than as unsupervised homework, since account approval can sometimes take a few minutes.

---

### Slide 10 — Handling API Errors Gracefully
**Explanation:** Combine `try`/`except` (recap Lesson 9) with status code checks to handle network failures, invalid city names, or bad API keys without crashing.
**Code example:**
```python
import requests

def get_weather(city, api_key):
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"

    try:
        response = requests.get(url)
        if response.status_code != 200:
            print("City not found or API error.")
            return None
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Network error: {e}")
        return None
```
**Instructor notes:** Point out `requests.exceptions.RequestException` catches network-level problems (no internet, timeout) specifically — recap Lesson 9's "catch specific exception types" principle directly applied to a new domain.

---

### Slide 11 — Building the Weather App
**Code example:**
```python
import requests

API_KEY = "your_api_key_here"

def get_weather(city):
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    try:
        response = requests.get(url)
        if response.status_code != 200:
            print("City not found.")
            return
        data = response.json()
        temp = data["main"]["temp"]
        condition = data["weather"][0]["description"]
        print(f"\nWeather in {city}: {temp}°C, {condition}")
    except requests.exceptions.RequestException as e:
        print(f"Network error: {e}")

while True:
    print("\n1. Check weather  2. Quit")
    choice = input("Choose an option: ")

    if choice == "1":
        city = input("Enter a city name: ")
        get_weather(city)
    elif choice == "2":
        print("Goodbye!")
        break
    else:
        print("Invalid option, please try again.")
```
**Instructor notes:** Build incrementally: get a single hardcoded city working and printed correctly first, then wire it into the menu loop and function — consistent "small steps" habit maintained through the final stretch of the course.

---

### Slide 12 — Building the Country Information App
**Explanation:** Apply the exact same request → check → parse → display pattern to a second, different API (REST Countries, no key required) — reinforcing that today's skills generalize across many APIs, not just one.
**Code example:**
```python
import requests

def get_country_info(country_name):
    url = f"https://restcountries.com/v3.1/name/{country_name}"
    try:
        response = requests.get(url)
        if response.status_code != 200:
            print("Country not found.")
            return
        data = response.json()
        country = data[0]
        print(f"\nCountry: {country['name']['common']}")
        print(f"Capital: {country['capital'][0]}")
        print(f"Population: {country['population']:,}")
        print(f"Region: {country['region']}")
    except requests.exceptions.RequestException as e:
        print(f"Network error: {e}")

while True:
    print("\n1. Look up a country  2. Quit")
    choice = input("Choose an option: ")

    if choice == "1":
        country_name = input("Enter a country name: ")
        get_country_info(country_name)
    elif choice == "2":
        print("Goodbye!")
        break
```
**Instructor notes:** Point out the `{country['population']:,}` formatting — the comma format specifier adds thousand-separators to large numbers, a small but polished touch worth calling out.

---

### Slide 13 — Recap and What's Next
**Explanation:** Recap: what APIs are, `requests`, status codes, parsing JSON, accessing nested data, handling errors, and building two complete API-driven applications. Preview: Lesson 12, the final session, covers code organization, debugging, clean code, and the capstone project — bringing every skill from the entire course together.
**Instructor notes:** Take a moment to name explicitly how much has been covered: variables → data types → decisions → loops → functions → data structures → files → error handling → modules → APIs. The capstone is the payoff for all of it.

---

## 5. Practical Exercises During Class

1. **Status code drill:** Students deliberately request an invalid endpoint/city and observe the resulting status code and behavior.
2. **JSON exploration drill:** Students use `json.dumps(data, indent=2)` on an unfamiliar API response and identify 3 fields they could use.
3. **Nested access drill:** Given a sample nested JSON response, students write the correct chain of brackets to access a specific deeply nested value.
4. **Full build-along:** Every student builds both the Weather App and Country Information App with the instructor.

---

## 6. Homework Assignment

Build a **Cryptocurrency Price Checker**: a program using the free CoinGecko API (no key required) to look up and display the current price of a cryptocurrency the user specifies, with proper error handling for invalid coin names.

---

## 7. Mini Projects — Weather App & Country Information App

**Brief (Weather App):** "Build a console app where a user types a city and sees the current temperature and weather condition."
**Brief (Country Information App):** "Build a console app where a user types a country and sees its capital, population, and region."

**Requirements (both):**
- Uses `requests.get()` to fetch real data from a public API
- Checks the response status code before parsing
- Parses and displays specific fields from the JSON response
- Handles invalid input (city/country not found) and network errors gracefully, without crashing
- Menu loop allowing repeated lookups until the user quits

**Stretch goal:** Combine both into a single app with a menu offering "Check weather," "Look up country," or "Quit."

---

## 8. Common Beginner Mistakes

- Forgetting `pip install requests` before running a script that imports it.
- Forgetting to check `response.status_code` before calling `.json()`, leading to confusing errors on failed requests.
- Hardcoding an API key directly in shared/public code — acceptable for this course's practice projects, but flagged as a habit to break once handling anything sensitive (recap the same caution given in Khodz Academy's web development courses).
- Assuming a JSON field always exists without checking, causing a `KeyError` on unexpected or missing data.
- Mismatching bracket vs. index access when navigating nested lists vs. dictionaries in a response.
- Not handling network errors (`requests.exceptions.RequestException`) separately from data-related errors (`KeyError`, invalid city/country names).

---

## 9. Extra Resources

- [Requests Library — Official Documentation](https://requests.readthedocs.io/en/latest/)
- [OpenWeatherMap API Documentation](https://openweathermap.org/api)
- [REST Countries API Documentation](https://restcountries.com/)
- [CoinGecko API Documentation](https://www.coingecko.com/en/api/documentation)
- [Python Docs — json Module](https://docs.python.org/3/library/json.html)
