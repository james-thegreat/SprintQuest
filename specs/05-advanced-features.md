# Advanced Features

This file records the top three advanced features selected for SprintQuest's MSA Phase 2 assessment.

Only the top three advanced features listed in the README will be submitted for assessment.

## 1. Zustand State Management

**Status:** Completed in M8

SprintQuest uses Zustand to manage important shared frontend state.

Implemented stores:

* `useBoardStore`
* `useGamificationStore`

The board store manages:

* task data,
* task loading,
* task creation,
* task status updates,
* task deletion,
* optimistic updates and rollback,
* board loading and error state.

The gamification store manages:

* XP summary data,
* unlocked achievements,
* summary loading,
* summary refreshes,
* gamification-specific error state.

Architecture:

```text
React components
    ↓
Zustand stores
    ↓
API clients
    ↓
ASP.NET Core API
```

Important implementation files:

* `frontend/sprintquest-ui/src/stores/useBoardStore.ts`
* `frontend/sprintquest-ui/src/stores/useGamificationStore.ts`
* `specs/m8-zustand-state-management.md`

Zustand keeps shared state outside large React components and provides predictable actions for loading, creating, updating, deleting, and refreshing application data.

## 2. Security Measures

**Status:** Completed in M9

SprintQuest implements two meaningful API security measures:

1. Request validation
2. ASP.NET Core rate limiting

### Request Validation

Validation is applied to important create and update DTOs in the Application layer.

Validated resources include:

* projects,
* sprints,
* tasks,
* checklist items.

Implemented validation includes:

* required names and titles,
* rejection of whitespace-only values,
* rejection of empty parent identifiers,
* maximum text lengths aligned with EF Core,
* bounded story points,
* bounded XP rewards,
* defined task-status values,
* defined priority values,
* required sprint dates,
* rejection of sprint end dates before start dates.

The API controllers use `[ApiController]`, so invalid models automatically return structured:

```text
400 Bad Request
```

This prevents invalid, malformed, or excessively large input from reaching application services and the database.

Domain safeguards remain in place as defence in depth.

### Rate Limiting

SprintQuest uses ASP.NET Core's built-in rate-limiting middleware.

The named API policy uses:

* a fixed-window algorithm,
* 10 permitted requests,
* a 10-second window,
* partitioning by client IP,
* a queue limit of zero,
* immediate rejection of excessive requests.

Requests exceeding the limit return:

```text
429 Too Many Requests
```

Manual verification confirmed:

```text
Requests 1–10: HTTP 200 OK
Requests 11–12: HTTP 429 Too Many Requests
After the window reset: HTTP 200 OK
```

Important implementation files:

* `backend/SprintQuest.Application/Validation/NotEmptyGuidAttribute.cs`
* `backend/SprintQuest.Application/Validation/NotWhiteSpaceAttribute.cs`
* `backend/SprintQuest.Application/DTOs`
* `backend/SprintQuest.Api/Program.cs`
* `backend/SprintQuest.Api/Controllers`
* `backend/SprintQuest.Tests/Application`
* `specs/m9-security-measures.md`

M9 completed SprintQuest's second selected advanced assessment feature.

## 3. SignalR WebSockets

**Status:** Planned for M10

SprintQuest will use SignalR to provide live board updates through WebSockets.

Planned live events include:

* task created,
* task updated,
* task moved between statuses,
* task deleted,
* task completed,
* achievement unlocked.

The planned architecture is:

```text
ASP.NET Core service or controller
    ↓
SignalR BoardHub
    ↓
Connected React clients
    ↓
Zustand board and gamification stores
```

SignalR has intentionally not been added during M9 so the security milestone remains controlled and focused.

## Assessment Checklist

* [x] State management library — Zustand
* [x] Security measures — request validation and rate limiting
* [ ] WebSockets — SignalR live board updates
