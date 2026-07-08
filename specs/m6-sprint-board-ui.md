# SprintQuest — M6 Sprint Board UI

## Milestone summary

M6 focused on building the first working Sprint Board UI for SprintQuest.

The board now allows users to:

- view tasks grouped by status,
- create new task cards,
- update task status from the board,
- delete tasks from the board,
- load task data from the backend API.

This milestone connects the React frontend to the existing .NET TaskItems CRUD API.

---

## User stories completed

### 1. View sprint board columns

As a user, I want to see tasks grouped by status, so that I can understand sprint progress quickly.

Completed:

- Backlog column
- To Do column
- In Progress column
- Testing column
- Done column
- Task count per column
- Empty column state

---

### 2. View task cards

As a user, I want task cards to show useful task information, so that I can decide what to work on.

Completed task card fields:

- title
- description
- priority
- story points
- XP reward
- status selector

---

### 3. Load tasks from the API

As a user, I want the board to load real backend data, so that the board reflects saved sprint work.

Implemented API call:

```text
GET /api/TaskItems