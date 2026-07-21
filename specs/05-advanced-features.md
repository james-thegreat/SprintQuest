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

**Status:** Completed in M10

SprintQuest uses ASP.NET Core SignalR to synchronize live board changes across connected browser clients.

Implemented live events:

* `TaskCreated`
* `TaskUpdated`
* `TaskDeleted`

Task status changes use `TaskUpdated` because the authoritative task payload contains the task's latest status.

The implemented architecture is:

```text
Browser client
    ↓ REST request
ASP.NET Core controller
    ↓
Task service and EF Core persistence
    ↓
SignalR BoardHub broadcast
    ↓
Connected React clients
    ↓
Zustand board store
    ↓
React board rerenders
```

REST remains the authoritative write path. SignalR broadcasts changes only after the related database operation succeeds.

The SignalR hub is exposed at:

```text
/hubs/board
```

The frontend uses the official:

```text
@microsoft/signalr
```

JavaScript client with automatic reconnection.

Incoming events are reconciled through Zustand:

* created tasks are added or replaced by task ID,
* updated tasks replace the matching task by ID,
* deleted tasks are removed by ID,
* gamification data refreshes after relevant live task updates.

This reconciliation prevents duplicate task cards when the initiating browser receives its own SignalR event.

Manual verification using two browser clients confirmed:

* both clients connected through WebSockets,
* task creation appeared in both clients,
* status movement worked across all board columns,
* task deletion synchronized in both directions,
* duplicate task cards were not created,
* XP summaries refreshed correctly,
* XP was awarded only once,
* clients automatically reconnected after the backend restarted,
* live events continued working after reconnection.

Important implementation files:

* `backend/SprintQuest.Api/Hubs/BoardHub.cs`
* `backend/SprintQuest.Api/Program.cs`
* `backend/SprintQuest.Api/Controllers/TaskItemsController.cs`
* `frontend/sprintquest-ui/src/realtime/boardHubConnection.ts`
* `frontend/sprintquest-ui/src/stores/useBoardStore.ts`
* `frontend/sprintquest-ui/src/stores/useGamificationStore.ts`
* `frontend/sprintquest-ui/src/pages/BoardPage.tsx`
* `specs/m10-signalr-live-board.md`

M10 completed SprintQuest's third selected advanced assessment feature.

## Assessment Checklist

* [x] State management library — Zustand
* [x] Security measures — request validation and rate limiting
* [x] WebSockets — SignalR live-board updates
