# SprintQuest — M10 SignalR Live Board

## Overview

M10 implements SprintQuest’s third selected advanced assessment feature: WebSockets using ASP.NET Core SignalR.

The goal is to synchronize task creation, task updates, status changes, and task deletion across connected browser clients without requiring a page refresh.

## Current Flow Audit

### Task Creation

The React board calls the Zustand `createTask` action.

The store sends a REST request through `tasksApi.ts`. The backend creates and persists the task and returns an authoritative `TaskItemDto`.

The Zustand store currently prepends the returned task to its task collection.

For SignalR, incoming created tasks must be reconciled by task ID rather than blindly appended. This prevents duplicate task cards when the browser that created a task receives its own `TaskCreated` event.

### Task Updates

The board uses an optimistic status update.

Zustand immediately updates the local task status and then sends a REST `PUT` request. If the request fails, the previous task collection is restored.

The current backend update service returns only a Boolean result, and the controller returns `204 No Content`.

For SignalR, the update operation will return the authoritative updated task DTO after persistence. This DTO can then be returned to the initiating client and broadcast to connected clients using `TaskUpdated`.

### Task Deletion

The Zustand store optimistically removes a task by ID and restores the previous collection if the REST request fails.

The existing filtering operation is idempotent. Receiving the same `TaskDeleted` event more than once leaves the store in the same valid state.

The SignalR delete payload only needs the deleted task ID.

### Gamification

The initiating browser currently refreshes the gamification summary after a successful status update.

A remote browser receiving `TaskUpdated` would not currently refresh its gamification summary.

The SignalR frontend integration will refresh the gamification summary after relevant incoming task updates. The gamification summary will remain separate from the task event payload.

## Event Design

The initial SignalR events are:

| Event         | Payload                | Zustand behaviour         |
| ------------- | ---------------------- | ------------------------- |
| `TaskCreated` | Authoritative task DTO | Add or replace by task ID |
| `TaskUpdated` | Authoritative task DTO | Add or replace by task ID |
| `TaskDeleted` | Deleted task ID        | Remove by task ID         |

A task status change will use `TaskUpdated` because the task payload already contains its latest status.

## Responsibility Split

### REST API

The REST API remains responsible for:

* request validation
* business operations
* database persistence
* XP event creation
* returning authoritative results

### SignalR

SignalR is responsible for:

* notifying connected clients after successful persistence
* carrying authoritative task results
* synchronizing Zustand stores

SignalR will not replace the existing REST CRUD endpoints.

## Backend Design

The SignalR hub will be placed in the API layer:

```text
backend/SprintQuest.Api/Hubs/BoardHub.cs
```

The proposed hub endpoint is:

```text
/hubs/board
```

SignalR will not be referenced by the Domain, Application, or Infrastructure layers.

The `TaskItemsController` will broadcast events after service operations complete successfully.

The task-update service contract will return `TaskItemDto?` instead of `bool` so the controller receives the authoritative persisted task.

## Frontend Design

A reusable SignalR module will manage:

* connection construction
* event-handler registration
* connection startup
* automatic reconnection
* cleanup
* connection errors

Incoming events will call Zustand actions through:

```text
useBoardStore.getState()
```

The board store will expose idempotent reconciliation actions that:

* replace an existing task with the same ID
* add the task when no matching task exists
* remove deleted tasks safely by ID

The React board page will control the connection lifecycle but will not contain the main event-processing logic.

## Broadcast Scope

M10 will initially broadcast events to all connected clients.

SignalR groups by sprint or project are intentionally excluded until the basic live-board flow works reliably.

## Optimistic Update Interaction

The intended task-update flow is:

```text
User changes task status
    ↓
Zustand applies an optimistic update
    ↓
REST request persists the change
    ↓
Backend returns the authoritative task
    ↓
TaskUpdated is broadcast
    ↓
Connected Zustand stores reconcile by task ID
```

If persistence fails:

```text
REST request fails
    ↓
Zustand restores the previous task collection
    ↓
No SignalR event is broadcast
```

## Scope Constraints

M10 will not introduce:

* authentication
* user accounts
* SignalR groups
* Redis
* distributed backplanes
* chat
* presence indicators
* unrelated notifications

## Initial Implementation Order

1. Add and map `BoardHub`.
2. Change task updates to return the authoritative DTO.
3. Broadcast task-created events.
4. Broadcast task-updated events.
5. Broadcast task-deleted events.
6. Add Zustand reconciliation actions.
7. Add the frontend SignalR connection.
8. Verify the feature across two browser clients.


## Manual Verification

Manual verification was completed on 22 July 2026 using two separate browser clients connected to the SprintQuest frontend.

### Environment

```text
Backend API: http://localhost:5087
Frontend: http://localhost:5173
SignalR hub: /hubs/board
Transport: WebSockets
Protocol: JSON
```

The browser console confirmed:

```text
WebSocket connected to ws://localhost:5087/hubs/board
Using HubProtocol 'json'
SprintQuest live-board connection started.
```

### Build and Test Results

Backend verification:

```text
dotnet build backend/SprintQuest.sln
Build succeeded
```

```text
dotnet test backend/SprintQuest.sln
69 tests passed
0 tests failed
0 tests skipped
```

Frontend verification:

```text
npm run build
TypeScript compilation passed
Vite 8.1.3 production build passed
68 frontend modules transformed
```

Vite displayed non-blocking `INVALID_ANNOTATION` warnings originating from pure-annotation comments inside the `@microsoft/signalr` package. The production build still completed successfully.

### Two-Client Verification Results

| Test                     | Expected result                                          | Actual result |
| ------------------------ | -------------------------------------------------------- | ------------- |
| Both clients connect     | Both clients establish a SignalR connection              | Passed        |
| Task created             | A task created in one client appears in the other        | Passed        |
| Reverse task creation    | A task created in the second client appears in the first | Passed        |
| Duplicate prevention     | The initiating client displays only one task card        | Passed        |
| Task status update       | The task moves to the matching column in both clients    | Passed        |
| All status columns       | Live movement works across every task status             | Passed        |
| Task deletion            | A deleted task disappears from both clients              | Passed        |
| Gamification refresh     | Total XP updates in both connected clients               | Passed        |
| XP duplication           | Completing a task awards XP only once                    | Passed        |
| Reconnection             | Clients reconnect after the backend restarts             | Passed        |
| Post-reconnection events | Live task updates resume after reconnection              | Passed        |
| UI resilience            | The board remains visible during temporary disconnection | Passed        |

### Task Creation Verification

A task created in client A appeared automatically in client B without a page refresh.

A second task created in client B appeared automatically in client A.

The initiating client received its own `TaskCreated` event safely. Zustand reconciled the event by task ID, so duplicate task cards were not created.

### Task Update Verification

Changing a task status in one client moved the same task to the correct board column in the other client.

Live updates were verified across all statuses:

```text
Backlog
To Do
In Progress
Testing
Done
```

The initiating browser continued to use its optimistic Zustand update. The server then returned and broadcast the authoritative task state, which safely replaced the optimistic version.

### Task Deletion Verification

Deleting a task in one client removed it from the other connected client without a page refresh.

The initiating browser also received its own `TaskDeleted` event without producing an error. Removing tasks by ID made repeated deletion handling idempotent.

### Gamification Verification

A task with a known XP reward was moved to `Done`.

Both connected clients refreshed their gamification summaries and displayed the updated Total XP.

Refreshing the browsers did not award the XP again, confirming that SignalR synchronized the task state without duplicating the backend XP event.

### Reconnection Verification

The backend API was stopped while both frontend clients remained open.

The board remained visible, and the frontend did not crash.

After the backend was restarted, both clients automatically reconnected through SignalR. A subsequent task change was synchronized successfully across both clients.

### Verification Conclusion

The manual verification demonstrates that SprintQuest can synchronize task creation, task updates, status movement, deletion, and related gamification changes across connected browser clients without requiring manual page refreshes.

This completes the practical verification for SprintQuest’s SignalR WebSockets advanced feature.

