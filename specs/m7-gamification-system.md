# M7 - Gamification System

## Goal

The goal of M7 was to make SprintQuest clearly connect to the required gamification theme.

Before this milestone, SprintQuest already had a working sprint board with task CRUD. In M7, the app was extended so completing work gives the user visible rewards and progress feedback.

## Features completed

### 1. XP rewards when tasks are completed

SprintQuest now awards XP when a task is completed.

Rule:

- When a task is moved to `Done`, the backend uses the task's `XpReward` value.
- The task is marked as completed.
- An `XpEvent` is created and saved.
- Duplicate XP is avoided when a task is already done.

Important files:

- `backend/SprintQuest.Domain/Entities/TaskItem.cs`
- `backend/SprintQuest.Domain/Entities/XpEvent.cs`
- `backend/SprintQuest.Infrastructure/Services/TaskItemService.cs`
- `backend/SprintQuest.Tests/TaskItemTests.cs`

### 2. Gamification summary endpoint

A new backend endpoint was added:

```http
GET /api/gamification/summary