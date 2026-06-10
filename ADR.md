# Architecture Decision Record
This file records all the architecture decisions made for the project.


### ADR 1: HTML/CSS/JS

Using HTML, CSS, and JavaScript together for the base frontend stack.
This combination gives a structured, stylized UI with familiar code language and fast performance.
HTML structures page content, CSS styles the UI, and JavaScript adds interactivity.

- Pros:
  - Standard web stack
  - Familiar language for development
  - Works in every browser
  - Supports real-time visualization
- Cons:
  - CSS layout debugging can be tricky
  - JavaScript can run slightly differently by browser

#### Alternatives:

- Framework-only abstraction for all UI logic and styling - less direct control over core web layers

---

### ADR 2: Tailwind CSS

Tailwind CSS will be used to apply pre-built utility classes directly in HTML, speed up development, and reduce CSS volume.

- Pros:
  - Pre-built utility classes directly in HTML
  - Faster development
  - Less code needed
- Cons:
  - Utility-heavy markup can become harder to scan at first

#### Alternatives:

- Only traditional CSS files - slower UI iteration

---

### ADR 3: TypeScript

TypeScript will be used with JavaScript to add strict typing, improve readability, and reduce debugging effort. It is also expected to make AI-generated code safer by enforcing stronger type constraints.

- Pros:
  - Strictly typed JavaScript
  - Easier to read and debug
  - Safer AI-generated code with stronger specifications
- Cons:
  - Requires an additional compilation step

#### Alternatives:

- Plain JavaScript only - weaker type safety, harder debugging at scale

---

### ADR 4: Vue.js

Vue.js will be used as the frontend framework to build the app and strengthen Vue skills for the rest of the internship. Vue is based in JavaScript, so the code is be simpler, and it allows the DOM to update automatically. 

Specifically, I chose Vue because by using this as a development tool in this project, I will become more familiar with it, and get used to its syntax and style. During the rest of the internship I think we will be using Vue a lot, so I want to know as best as I can for our future projects.

- Pros:
  - Simple syntax and easy learning curve
  - Automatic DOM updates speed development
  - Good fit for single-page applications
  - Includes Angular-like data binding and React-like components
  - More alignment with likely internship tool usage
- Cons:
  - Smaller ecosystem and mindshare compared to React

#### Alternatives:

- Angular - heavy and complex, mostly for very large company apps
- React - less experience today, harder to read/debug now, no built-in routing library
- Svelte - fewer features/libraries, less known than Vue
- Backbone - outdated versus modern frameworks, missing modern technologies
- Ember.js - complex code, mostly used for very large apps

---

### ADR 5: Browser Local Storage

Browser Local Storage will be used as the backend persistence approach for this phase. It stores data directly in the browser so ToDo items appear after reload without running a server.

- Pros:
  - Simplest persistence option for this project
  - No backend service required
  - Instant save/reload behavior in the same browser
- Cons:
  - Data is limited to one browser/device profile

#### Alternatives:

- Database - more complex, better for bigger apps with structured data
- JSON file storage - requires backend code, better for desktop apps than web apps
- Backend-as-a-Service - requires internet connection, more complex than local storage

---
