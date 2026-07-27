# Milestone 12 — Azure Deployment

## 1. Overview

Milestone 12 prepared SprintQuest for production and deployed the complete application to Microsoft Azure.

The milestone included:

- backend production configuration
- frontend production configuration
- automated GitHub Actions deployment
- persistent SQLite storage
- Entity Framework Core migrations
- production CORS configuration
- SignalR WebSocket verification
- production validation testing
- fixes for issues discovered after deployment

## 2. Production Architecture

### Frontend

The React and TypeScript frontend is hosted on Azure Static Web Apps.

Production URL:

```text
https://calm-forest-08e02e000.7.azurestaticapps.net
```

### Backend

The ASP.NET Core API is hosted on Azure App Service for Linux.

Production URL:

```text
https://sprintquest-api-jd-2026-bpd5gyhzghhxgdgt.australiaeast-01.azurewebsites.net
```

### Database

The backend uses SQLite through Entity Framework Core.

Production database path:

```text
/home/sprintquest.db
```

Files under `/home` persist across Azure App Service restarts.

### Real-time communication

SignalR uses the following hub route:

```text
/hubs/board
```

Production clients connect through secure WebSockets using `wss://`.

## 3. Azure Resources

### Resource group

```text
sprintquest-api-jd-2026_group
```

### App Service

```text
Name: sprintquest-api-jd-2026
Operating system: Linux
Runtime: .NET 10
Region: Australia East
Plan: Free F1
```

### App Service plan

```text
asp-sprintquest-msa
```

### Static Web App

```text
Name: sprintquest-ui-jd-2026
Plan: Free
```

## 4. Branch Strategy

SprintQuest uses two long-lived branches:

```text
main       Production
develop    Ongoing development
```

Feature, bugfix, and documentation branches are merged through pull requests.

Production deployment workflows run automatically when relevant changes are merged into `main`.

## 5. Backend Production Configuration

Backend production configuration is primarily contained in:

```text
backend/SprintQuest.Api/Program.cs
backend/SprintQuest.Api/appsettings.json
```

### CORS

Allowed frontend origins are loaded from configuration.

Production setting:

```text
AllowedOrigins__0=https://calm-forest-08e02e000.7.azurestaticapps.net
```

The origin does not include a trailing slash.

Credentials are allowed so SignalR negotiation and WebSocket communication work correctly.

### API documentation

OpenAPI and Scalar can be enabled with:

```text
ApiDocumentation__Enabled=true
```

Production documentation endpoints:

```text
/openapi/v1.json
/scalar/v1
```

### Automatic migrations

Database migrations run at application startup using:

```text
Database__ApplyMigrationsOnStartup=true
```

The application creates a scoped `SprintQuestDbContext` and calls:

```csharp
await database.Database.MigrateAsync();
```

### SQLite connection

Production connection string:

```text
ConnectionStrings__SprintQuestDatabase=Data Source=/home/sprintquest.db
```

Persistent App Service storage is enabled with:

```text
WEBSITES_ENABLE_APP_SERVICE_STORAGE=true
```

The ASP.NET Core environment is:

```text
ASPNETCORE_ENVIRONMENT=Production
```

## 6. Rate Limiting

The API uses IP-based rate limiting.

Current rule:

```text
10 requests per 10-second window
```

Requests exceeding the limit receive:

```text
HTTP 429 Too Many Requests
```

## 7. Frontend Production Configuration

Frontend configuration uses Vite environment variables.

Example file:

```text
frontend/sprintquest-ui/.env.example
```

Required variables:

```text
VITE_API_BASE_URL
VITE_DEFAULT_SPRINT_ID
```

Production values:

```text
VITE_API_BASE_URL=https://sprintquest-api-jd-2026-bpd5gyhzghhxgdgt.australiaeast-01.azurewebsites.net
VITE_DEFAULT_SPRINT_ID=f3189605-5fb1-4b66-a9d7-f545bbf17407
```

The sprint ID is public application configuration rather than a secret.

## 8. Static Web App Routing

Single-page application routing is configured in:

```text
frontend/sprintquest-ui/public/staticwebapp.config.json
```

Unknown frontend routes are rewritten to:

```text
/index.html
```

This allows routes such as `/board` to work after a browser refresh.

## 9. Backend Deployment Workflow

Workflow:

```text
.github/workflows/deploy-backend.yml
```

The workflow runs when backend files change on `main`.

Workflow stages:

1. Check out the repository.
2. Install .NET 10.
3. Restore packages.
4. Build in Release mode.
5. Run backend tests.
6. Publish the API.
7. Deploy to Azure App Service.

The Azure publish profile is stored as:

```text
AZURE_WEBAPP_PUBLISH_PROFILE
```

## 10. Frontend Deployment Workflow

Workflow:

```text
.github/workflows/deploy-frontend.yml
```

The workflow runs when frontend files change on `main`.

Workflow stages:

1. Check out the repository.
2. Install Node.js 22.
3. Install dependencies with `npm ci`.
4. Run frontend tests.
5. Build the Vite application.
6. Upload the `dist` directory.
7. Deploy to Azure Static Web Apps.

The deployment token is stored as:

```text
AZURE_STATIC_WEB_APPS_API_TOKEN
```

## 11. Database Migrations

### Initial migration

```text
20260630002551_InitialCreate
```

This migration created the core SprintQuest tables.

### XP award migration

```text
20260726221455_AddTaskItemXpAwardedAt
```

This migration added:

```text
TaskItems.XpAwardedAt
```

`XpAwardedAt` records whether a task has ever awarded completion XP.

The migration also backfilled currently completed tasks:

```sql
UPDATE TaskItems
SET XpAwardedAt = CompletedAt
WHERE CompletedAt IS NOT NULL;
```

The migration was tested against a disposable SQLite database before production deployment.

## 12. Duplicate XP Production Bug

### Problem

Moving a task through the following states awarded XP more than once:

```text
Done
→ In Progress
→ Done
```

Production evidence:

```text
Before:
totalXp: 20
xpEventCount: 2

After recompleting the same task:
totalXp: 30
xpEventCount: 3
```

### Fix

The `TaskItem` entity received:

```csharp
public DateTime? XpAwardedAt { get; private set; }
```

XP is now awarded only when the task has never received completion XP.

Reopening a task clears `CompletedAt`, but does not clear `XpAwardedAt`.

### Regression tests

```text
CompleteForXp_WhenReopenedAfterXpAward_DoesNotCreateAnotherXpEvent
UpdateAsync_WhenReopenedAfterXpAward_DoesNotDuplicateXpEvent
```

Production testing confirmed that recompleting the same task no longer creates additional XP.

## 13. Story-Point Validation Bug

### Problem

Task requests originally accepted:

```text
storyPoints: 0
```

This allowed invalid requests to reach the service layer.

### Fix

Create and update request validation now uses:

```csharp
[Range(1, 100)]
```

The domain entity also rejects values below `1`.

### Regression tests

```text
CreateRequest_WithZeroStoryPoints_IsInvalid
UpdateRequest_WithZeroStoryPoints_IsInvalid
Constructor_WithZeroStoryPoints_ThrowsArgumentException
UpdateDetails_WithZeroStoryPoints_ThrowsArgumentException
```

Production verification returned:

```text
HTTP 400 Bad Request
Story points must be between 1 and 100.
```

## 14. Deployment Branch Bug

### Problem

The project used `main` as its production branch, but the deployment workflows listened to:

```text
release/deployment-prep
```

Fixes merged into `main` did not deploy automatically.

### Fix

Both deployment workflows now use:

```yaml
branches:
  - main
```

Production deployment from `main` was verified successfully.

## 15. Production Verification

The following checks passed:

- `GET /api/projects` returned HTTP 200.
- `GET /openapi/v1.json` returned HTTP 200.
- Scalar loaded at `/scalar/v1`.
- The frontend root loaded successfully.
- `/board` worked after direct browser refresh.
- Tasks could be created, updated, moved, and deleted.
- SignalR negotiation returned HTTP 200.
- WebSocket communication connected successfully.
- Changes appeared live in a second browser.
- SQLite data survived an App Service restart.
- Invalid task requests returned HTTP 400.

## 16. Test Results

### Backend

```text
85 tests passed
0 failed
0 skipped
```

### Frontend

```text
15 tests passed
3 test files passed
```

### Frontend build

The Vite production build succeeded.

Two non-blocking `INVALID_ANNOTATION` warnings were reported from `@microsoft/signalr`. They did not prevent the application from building or running.

## 17. Deployment Security

Deployment credentials are stored in GitHub Actions secrets:

```text
AZURE_WEBAPP_PUBLISH_PROFILE
AZURE_STATIC_WEB_APPS_API_TOKEN
```

The Azure publish profile was rotated after an earlier exposure during deployment setup.

Local environment files remain ignored by Git.

## 18. Useful Commands

### Backend tests

```bash
dotnet test backend/SprintQuest.sln
```

### Frontend tests

```bash
cd frontend/sprintquest-ui
npm test
```

### Frontend build

```bash
cd frontend/sprintquest-ui
npm run build
```

### Backend health

```bash
API_URL="https://sprintquest-api-jd-2026-bpd5gyhzghhxgdgt.australiaeast-01.azurewebsites.net"
curl -i "$API_URL/api/projects"
```

### Tasks

```bash
curl -sS "$API_URL/api/TaskItems" |
  python3 -m json.tool
```

### Gamification summary

```bash
curl -sS "$API_URL/api/gamification/summary" |
  python3 -m json.tool
```

## 19. Key Lessons

- Deployment workflows must listen to the real production branch.
- Production testing can reveal integration issues missed locally.
- `CompletedAt` represents current completion state.
- `XpAwardedAt` represents permanent XP-award history.
- Secrets must remain outside source control.
- SQLite requires a persistent filesystem path in production.

## 20. Completion Checklist

- [x] Backend configured for production
- [x] Frontend configured for production
- [x] Azure App Service created
- [x] Azure Static Web App created
- [x] Persistent SQLite storage configured
- [x] Startup migrations configured
- [x] Backend deployment workflow created
- [x] Frontend deployment workflow created
- [x] Workflows updated to deploy from `main`
- [x] Backend deployed successfully
- [x] Frontend deployed successfully
- [x] REST communication verified
- [x] SignalR live updates verified
- [x] Browser route refresh verified
- [x] Database persistence verified
- [x] OpenAPI and Scalar verified
- [x] Request validation verified
- [x] Duplicate XP bug fixed
- [x] Story-point validation bug fixed
- [x] Backend tests passing
- [x] Frontend tests passing
- [x] Deployment documented

## 21. Final Result

SprintQuest is deployed as a complete cloud-hosted application using:

```text
React and TypeScript
ASP.NET Core and .NET 10
Entity Framework Core
Persistent SQLite storage
SignalR live updates
Zustand state management
Azure App Service
Azure Static Web Apps
GitHub Actions CI/CD
```

Milestone 12 is complete.
