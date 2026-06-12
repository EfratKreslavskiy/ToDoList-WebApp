# ToDoList Web App Spec

## Goal
Create a simple, client-side web app for tracking personal tasks.

## Technology
- HTML
- Tailwind CSS
- JavaScript with TypeScript
- Vue.js
- Vue Router for navigation between Home and List views without page reloads
- Browser Local Storage for persistence
- A lightweight Vue-compatible drag-and-drop library
- No backend required
- Must function entirely client-side

## Data Saving
- All data must automatically save, immediately after any change
- Data must persist after page refresh, browser restart, and reopening the tab
- No manual Save button
- Local Storage should store:
	- All To-Do Lists
	- List titles
	- List background colors
	- List item text
	- Completion status
	- Importance status
	- Custom ordering

## Home Page
- Display all To-Do Lists as organized cards
- Most recently modified list appears at the top
- Clicking a list opens that list
- Include a Create New List button
- Include a delete button for each list
- When deleting a list, show a confirmation modal with this message:
	- This is a complete deletion with no way to go back. Are you sure you want to delete this To-Do List?
- Deletion only occurs after explicit confirmation
- Include a copy button that copies the entire list contents as plain text
- Show the number of incomplete items on each list card, clearly separate from the list title
- List card appearance:
	- List title
	- Number of incomplete tasks
	- Display card with the selected background color
- If no lists exist, display a friendly empty-state message

## Individual To-Do List Page
- Always provide a visible button to return to the Home Page
- New lists are created with the title Untitled List and automatically open after creation
- Display editable list title at the top
- Save title and list text edits automatically when focus leaves the title field
- Allow selecting a background color for the list
- When a color is selected, only that list card changes
- Other list cards may have other colors
- Background color options should be clearly distinguishable, classic named colors (for example Red, Orange, Green, Blue, Purple, Brown, Teal)
- Color buttons should use their relevant color as the button background, with dark text for readability
- Colors should be darker than pastel shades while still allowing readable text and UI contrast
- Do not provide more than 8 color options
- Include a button to add a new task
- New tasks should appear at the bottom of tasks
- Allow editing task text by clicking the task
- Allow deleting individual tasks
- Allow marking tasks complete by checking a box with rounded edges on the left side of the task item, next to the task text
- Completed tasks:
	- Display with strikethrough text
	- Remain in the same single list section (no separate completed section)
	- Do not automatically move to the bottom when completed
- Allow marking tasks as Important by clicking an important icon such as a star, flag, or badge
- Important tasks:
	- Always appear above non-important tasks within the same single list section
	- Display a visual indicator such as a star, flag, or badge
- Allow drag-and-drop reordering
- Reordering should save automatically
- Include a copy-to-clipboard button near the title that copies the entire list with its title in a readable text format

## Task Ordering Rules
- All tasks should appear in one single section
- Important tasks should always appear at the top of that section
- Non-important tasks should appear below important tasks
- Completed tasks should stay in their current area of the same section and only change visual style (strikethrough)
- Drag-and-drop should preserve user-defined order while respecting the important-first rule

## User Experience
- Professional modern appearance
- Clean spacing and typography
- Consistent styling throughout the application
- Smooth hover effects on buttons and cards
- Smooth transitions where appropriate
- Responsive design for desktop screens
- Use cards, rounded corners, and subtle shadows
- Avoid excessive animations

## Browser Compatibility
- Must function correctly in Chrome
- Must function correctly in Edge
- Must function correctly in Safari
- Must function correctly in Brave
- Must function correctly in Firefox
- Use standards-compliant HTML, CSS, and JavaScript
- Avoid browser-specific functionality

## Accessibility
- All buttons should have clear labels
- Sufficient color contrast, especially dark text on light backgrounds and light text on dark backgrounds
- Keyboard navigation should work
- Confirmation modals should be keyboard accessible

## Error Handling
- Prevent saving completely blank lists with no title and no list items
- A list may be saved if it contains either a non-empty title or at least one task
- Completely empty lists should be automatically discarded
- Prevent saving completely blank tasks
- Handle Local Storage errors gracefully
- Show user-friendly feedback when copy-to-clipboard succeeds

## Code Requirements
- Organize code into reusable Vue components
- Use TypeScript interfaces for list and task data
- Keep state management simple
- Use a clean, maintainable project structure
- Comment non-obvious logic

## Open Decisions
- Backend/API choice is fixed to no backend required
- Authentication needs are not required for the current scope
