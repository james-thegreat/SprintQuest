# Advanced Features

This file records the top three advanced features used for assessment.

# Advanced Features

This file records the top three advanced features selected for SprintQuest's MSA Phase 2 assessment.

Only the top three advanced features listed in the README will be submitted for assessment.

## 1. Zustand State Management

**Status:** Completed in M8

SprintQuest uses Zustand to manage important shared frontend state.

Implemented stores:

- `useBoardStore`
- `useGamificationStore`

The board store manages:

- task data,
- task loading,
- task creation,
- task status updates,
- task deletion,
- optimistic updates and rollback,
- board loading and error state.

The gamification store manages:

- XP summary data,
- unlocked achievements,
- summary loading,
- summary refreshes,
- gamification-specific error state.

Architecture:

```text
React components
    ↓
Zustand stores
    ↓
API clients
    ↓
ASP.NET Core API