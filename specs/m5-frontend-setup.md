# M5 - Frontend Setup

## Goal

Create the React TypeScript frontend foundation for SprintQuest.

This milestone focuses on setting up the frontend app structure, routing, layout, and API client foundation before building the full sprint board UI in M6.

## Completed Work

- Created a Vite React TypeScript frontend app.
- Added React Router.
- Created the frontend folder structure.
- Added basic routes for:
  - Dashboard
  - Projects
  - Sprint Board
  - Task Details
  - Profile & Progress
- Created a shared app layout with sidebar navigation.
- Added a responsive dashboard layout.
- Added an API client folder structure.
- Added a project API service placeholder.
- Added frontend TypeScript types.
- Confirmed the frontend production build works.

## Frontend Structure

```text
frontend/sprintquest-ui/
├── src/
│   ├── api/
│   ├── components/
│   │   └── layout/
│   ├── features/
│   ├── pages/
│   ├── routes/
│   ├── stores/
│   ├── types/
│   └── utils/