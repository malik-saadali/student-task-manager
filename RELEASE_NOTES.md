# Release Notes - Student Task Manager

## Version 1.0.0 (23 November 2026)

### New Features
- User signup with email and password (minimum 6 characters).
- User login and logout with a saved session.
- Add a new task with a title.
- Delete a task from the list.
- Mark a task as complete, or undo it.
- Tasks are saved per user in the browser (localStorage).

### Bug Fixes
- Empty task titles are now blocked with a clear message.
- Duplicate signup with the same email is now blocked.
- Email input is trimmed and converted to lower case before login.
- Wrong password now shows a clear "Invalid email or password" message.

### Known Issues
- Data is stored only in the browser, so tasks are not shared across devices.
- Passwords are stored in plain text in localStorage (demo app, no backend).
- The layout is not fully responsive on very small screens.
