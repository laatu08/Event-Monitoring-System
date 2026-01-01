# Event Logging & Monitoring System

A production-grade observability platform for centralized log aggregation, real-time alerting, incident management, and error monitoring across distributed services.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [System Components](#system-components)
- [Data Flow](#data-flow)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Alert System](#alert-system)
- [Frontend Components](#frontend-components)

---

## Overview

This system provides comprehensive observability for microservices architectures. It ingests logs from multiple services, stores them efficiently, evaluates alert rules in real-time, manages incidents with deduplication, and provides a modern dashboard for visualization and incident response.

### Key Capabilities

- **Log Ingestion**: Asynchronous log collection with queue-based processing
- **Alert Rules**: Configurable threshold-based alerting per service
- **Incident Management**: Automatic deduplication with fingerprinting
- **Notification System**: Webhook-based alert delivery
- **Metrics & Trends**: Time-series error visualization
- **Log Explorer**: Full-text search and filtering

---

## Architecture

```
┌─────────────────┐
│   Services      │ (Auth, Payment, etc.)
└────────┬────────┘
         │ POST /api/logs
         ▼
┌─────────────────┐
│   API Server    │ (Express)
└────────┬────────┘
         │ Enqueue
         ▼
┌─────────────────┐
│   Redis Queue   │ (BullMQ)
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────────┐
│ Ingest Worker   │─────▶│ Elasticsearch    │
└─────────────────┘      └──────────────────┘
                               │
┌─────────────────┐           │ Query
│  Alert Worker   │───────────┘
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │ (Rules, Incidents, Channels)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Webhook Notify  │
└─────────────────┘
```

---

## Features

### 1. Log Ingestion & Storage

- **Async Processing**: Logs are queued in Redis and processed asynchronously
- **Daily Indexing**: Elasticsearch uses daily indices (`app-logs-YYYY-MM-DD`)
- **Validation**: Schema validation with Zod
- **Retry Logic**: BullMQ handles failed ingestion with automatic retries

### 2. Alert Rules

- **Threshold-Based**: Trigger when error count exceeds threshold in time window
- **Per-Service Config**: Each service can have multiple alert rules
- **Cooldown Period**: Prevents alert spam with configurable cooldown
- **Enable/Disable**: Rules can be toggled without deletion

### 3. Incident Management

- **Fingerprinting**: Unique identifier per service + rule combination
- **Deduplication**: Prevents duplicate incidents for ongoing issues
- **Lifecycle States**:
  - `open`: New incident requiring attention
  - `acknowledged`: Team is aware and investigating
  - `resolved`: Issue fixed
- **Auto-Reopening**: Incidents reopen if errors resume after quiet period
- **Last Seen Tracking**: Monitors when errors were last observed

### 4. Notification Channels

- **Webhook Support**: HTTP POST notifications to external systems
- **Multiple Channels**: Support for multiple notification targets
- **Enable/Disable**: Control which channels receive alerts
- **Payload Format**: Structured JSON with incident details

### 5. Metrics & Visualization

- **Error Trends**: Time-series aggregation with configurable ranges
- **Dynamic Intervals**: Auto-adjusted bucketing (1m, 5m, 1h, 6h, 1d, 1w)
- **Service-Specific**: Filter metrics by service
- **Multi-Range Support**: 1h, 24h, 7d, 30d, 3m, 6m, 1y

### 6. Log Explorer

- **Full-Text Search**: Query logs by service, level, and time range
- **Pagination**: Efficient navigation through large result sets
- **Filtering**: Level-based filtering (debug, info, warn, error, fatal)
- **Real-Time**: Near real-time log availability

---

## Technology Stack

### Backend

- **Runtime**: Node.js with TypeScript
- **Web Framework**: Express 5.x
- **Database**: PostgreSQL with Drizzle ORM
- **Search Engine**: Elasticsearch 8.x
- **Queue**: BullMQ + Redis (IORedis)
- **Validation**: Zod

### Frontend

- **Framework**: React 19.x with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **HTTP Client**: Axios

### Infrastructure

- **Containerization**: Docker Compose
- **Services**: Redis, Elasticsearch, PostgreSQL
- **Orchestration**: docker-compose.yml

---

## Project Structure

```
.
├── apps/
│   ├── api/                      # Backend API
│   │   ├── src/
│   │   │   ├── alerts/           # Alert rules & state
│   │   │   ├── controllers/      # Route handlers
│   │   │   ├── db/               # Database config & schema
│   │   │   ├── lib/              # Shared utilities (ES, Redis, Queue)
│   │   │   ├── repositories/     # Data access layer
│   │   │   ├── routes/           # Express routes
│   │   │   ├── schemas/          # Zod validation schemas
│   │   │   ├── services/         # Business logic
│   │   │   ├── utils/            # Helper functions
│   │   │   ├── workers/          # Background workers
│   │   │   ├── app.ts            # Express app setup
│   │   │   └── index.ts          # Server entry point
│   │   ├── drizzle/              # Database migrations
│   │   └── package.json
│   │
│   └── dashboard/                # React frontend
│       ├── src/
│       │   ├── api/              # API client functions
│       │   ├── components/       # Reusable UI components
│       │   ├── layouts/          # Page layouts
│       │   ├── pages/            # Route pages
│       │   ├── App.tsx           # App router
│       │   └── main.tsx          # Entry point
│       └── package.json
│
├── packages/
│   └── shared-types/             # Shared TypeScript types
│
├── docker-compose.yml            # Infrastructure setup
└── package.json                  # Workspace root
```

---

## System Components

### API Server (`apps/api/src/index.ts`)

Main HTTP server that exposes REST endpoints for log ingestion, querying, and management operations.

**Port**: 4000 (default)

**Endpoints**:
- `/health` - Health check
- `/api/logs` - Log ingestion and querying
- `/api/metrics` - Error metrics
- `/api/alerts/rules` - Alert rule management
- `/api/alerts/channels` - Notification channels
- `/api/alerts/incidents` - Incident management
- `/api/alerts/services` - Service list

### Ingest Worker (`apps/api/src/workers/ingest.worker.ts`)

Background worker that processes queued logs and stores them in Elasticsearch.

**Process**:
1. Dequeues log from Redis
2. Generates daily index name
3. Indexes document in Elasticsearch
4. Handles failures with retry

**Retry**: 3 attempts with exponential backoff

### Alert Worker (`apps/api/src/workers/alert.worker.ts`)

Background worker that evaluates alert rules every minute.

**Process**:
1. Fetch all enabled alert rules
2. Count errors in time window per rule
3. Compare against threshold
4. Check cooldown period
5. Create/update/reopen incidents
6. Send notifications

**Interval**: 60 seconds

---

## Data Flow

### 1. Log Ingestion Flow

```
Service → POST /api/logs
    ↓
Zod Validation (logSchema)
    ↓
Enqueue to Redis (BullMQ)
    ↓
Return 202 Accepted
    ↓
[Async] Ingest Worker
    ↓
Index in Elasticsearch (app-logs-YYYY-MM-DD)
    ↓
Available for querying
```

### 2. Alert Evaluation Flow

```
Alert Worker (every 60s)
    ↓
For each enabled alert rule:
    ↓
Query Elasticsearch (error count in window)
    ↓
Count >= Threshold?
    ├─ NO → Skip
    └─ YES → Check cooldown
         ↓
    Cooldown expired?
         ├─ NO → Skip
         └─ YES → Generate fingerprint
              ↓
         Check for existing incident
              ↓
         Existing active incident?
              ├─ YES → Update lastSeenErrorAt
              └─ NO → Check resolved incident
                   ↓
              Resolved incident exists?
                   ├─ NO → Create new incident
                   └─ YES → Check quiet period
                        ↓
                   Quiet period passed?
                        ├─ YES → Reopen incident
                        └─ NO → Suppress
              ↓
         Send notifications via channels
              ↓
         Update rule lastTriggeredAt
```

### 3. Incident Deduplication

**Fingerprint**: `{service}:{ruleId}`

**Logic**:
- **Active Incident** (open/acknowledged): Update `lastSeenErrorAt`, suppress new alert
- **Resolved Incident**: Reopen only if quiet period has passed
- **No Incident**: Create new incident

**Quiet Period**: `max(windowMinutes * 2, 15)` minutes

**Purpose**: Prevents duplicate incidents for the same ongoing issue while allowing reopening for recurring problems.

---

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Docker & Docker Compose
- PostgreSQL connection (or use Supabase)

### 1. Start Infrastructure

```bash
docker-compose up -d
```

This starts:
- Redis on `localhost:6379`
- Elasticsearch on `localhost:9200`

### 2. Configure Environment

Create `apps/api/.env`:

```env
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/logs_db
REDIS_URL=redis://localhost:6379
ELASTIC_URL=http://localhost:9200
```

### 3. Run Database Migrations

```bash
cd apps/api
pnpm install
pnpm drizzle-kit push
```

### 4. Start Backend

```bash
# Terminal 1: API Server
cd apps/api
pnpm dev

# Terminal 2: Ingest Worker
cd apps/api
pnpm worker

# Terminal 3: Alert Worker
cd apps/api
pnpm alert
```

### 5. Start Frontend

```bash
cd apps/dashboard
pnpm install
pnpm dev
```

Dashboard: `http://localhost:5173`

### 6. Ingest Test Logs

```bash
curl -X POST http://localhost:4000/api/logs \
  -H "Content-Type: application/json" \
  -d '{
    "service": "auth-service",
    "level": "error",
    "message": "Failed to authenticate user",
    "meta": {
      "userId": "123",
      "ip": "192.168.1.1"
    }
  }'
```

---

## API Reference

### Logs

#### POST `/api/logs`

Ingest a log event.

**Request**:
```json
{
  "service": "string",
  "level": "debug|info|warn|error|fatal",
  "message": "string",
  "timestamp": "ISO8601 (optional)",
  "meta": {
    "key": "value"
  }
}
```

**Response**: `202 Accepted`
```json
{
  "status": "queued"
}
```

#### GET `/api/logs`

Query logs.

**Query Params**:
- `service` (string, optional)
- `level` (string, optional)
- `from` (ISO8601, optional)
- `to` (ISO8601, optional)
- `page` (number, default: 1)
- `limit` (number, default: 20, max: 100)

**Response**:
```json
{
  "total": 150,
  "logs": [
    {
      "service": "auth-service",
      "level": "error",
      "message": "Authentication failed",
      "timestamp": "2026-01-01T10:30:00.000Z",
      "meta": {}
    }
  ]
}
```

### Metrics

#### GET `/api/metrics/errors`

Get error trends over time.

**Query Params**:
- `service` (string, required)
- `range` (string, required): `1h|24h|7d|30d|3m|6m|1y`

**Response**:
```json
[
  {
    "time": "2026-01-01T10:00:00.000Z",
    "count": 15
  }
]
```

### Alert Rules

#### GET `/api/alerts/rules`

List all alert rules.

#### POST `/api/alerts/rules`

Create alert rule.

**Request**:
```json
{
  "service": "auth-service",
  "threshold": 10,
  "windowMinutes": 5,
  "cooldownMinutes": 15
}
```

#### PATCH `/api/alerts/rules/:id`

Toggle alert rule.

**Request**:
```json
{
  "enabled": true
}
```

#### DELETE `/api/alerts/rules/:id`

Delete alert rule.

### Notification Channels

#### GET `/api/alerts/channels`

List notification channels.

#### POST `/api/alerts/channels`

Create channel.

**Request**:
```json
{
  "type": "webhook",
  "target": "https://example.com/webhook"
}
```

#### PATCH `/api/alerts/channels/:id`

Toggle channel.

**Request**:
```json
{
  "enabled": true
}
```

### Incidents

#### GET `/api/alerts/incidents`

List incidents (last 100, newest first).

**Response**:
```json
[
  {
    "id": "uuid",
    "service": "auth-service",
    "fingerprint": "auth-service:rule-id",
    "errorCount": 25,
    "windowMinutes": 10,
    "triggeredAt": "2026-01-01T10:00:00.000Z",
    "lastSeenErrorAt": "2026-01-01T10:05:00.000Z",
    "status": "open",
    "acknowledgedAt": null,
    "resolvedAt": null
  }
]
```

#### POST `/api/alerts/incidents/:id/acknowledge`

Acknowledge incident.

#### POST `/api/alerts/incidents/:id/resolve`

Resolve incident.

### Metadata

#### GET `/api/alerts/services`

List all services with active alert rules.

---

## Database Schema

### Tables

#### `alert_rules`

Defines alert thresholds per service.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| service | text | Service name (must match logs) |
| threshold | integer | Error count threshold |
| windowMinutes | integer | Time window for counting errors |
| cooldownMinutes | integer | Minimum time between alerts |
| enabled | boolean | Rule enabled status |
| lastTriggeredAt | timestamptz | Last time alert triggered |
| createdAt | timestamptz | Rule creation time |

**Indexes**: Primary key on `id`

#### `alert_incidents`

Stores triggered alert incidents.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| ruleId | uuid | Reference to alert rule |
| service | text | Service name |
| fingerprint | text | Deduplication key |
| errorCount | integer | Error count when triggered |
| windowMinutes | integer | Time window used |
| triggeredAt | timestamptz | When incident was created/reopened |
| lastSeenErrorAt | timestamptz | Last error observation |
| status | text | open / acknowledged / resolved |
| acknowledgedAt | timestamp | When acknowledged |
| resolvedAt | timestamp | When resolved |

**Indexes**:
- `idx_alert_incidents_fingerprint` on `fingerprint`
- `idx_alert_incidents_active_fingerprint` on `fingerprint, status`
- `idx_alert_incidents_last_seen` on `lastSeenErrorAt`

#### `notification_channels`

Defines notification targets.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| type | text | Channel type (webhook) |
| target | text | Webhook URL |
| enabled | boolean | Channel enabled status |
| createdAt | timestamptz | Channel creation time |

**Indexes**: Primary key on `id`

### Elasticsearch Indices

**Pattern**: `app-logs-YYYY-MM-DD`

**Fields**:
- `service` (keyword)
- `level` (keyword)
- `message` (text)
- `timestamp` (date)
- `meta` (object, dynamic)

**Mapping**: Dynamic mapping with keyword subfields for exact matching.

---

## Alert System

### Alert Rule Configuration

**Example**: Trigger when auth-service has 5+ errors in 10 minutes, with 15-minute cooldown.

```json
{
  "service": "auth-service",
  "threshold": 5,
  "windowMinutes": 10,
  "cooldownMinutes": 15
}
```

### Incident Lifecycle

1. **Creation**: Alert rule threshold exceeded
2. **Active Monitoring**: `lastSeenErrorAt` updated on each evaluation
3. **Acknowledgement**: Team takes ownership
4. **Resolution**: Issue fixed, incident marked resolved
5. **Reopening**: Errors resume after quiet period

### Notification Payload

```json
{
  "type": "error_alert",
  "service": "auth-service",
  "errorCount": 25,
  "windowMinutes": 10,
  "triggeredAt": "2026-01-01T10:00:00.000Z",
  "incidentId": "uuid"
}
```

For reopened incidents:
```json
{
  "type": "error_alert_reopened",
  ...
}
```

### Deduplication Strategy

**Fingerprinting**: Each rule + service combination gets a unique fingerprint.

**Benefits**:
- Prevents alert fatigue
- Groups related errors
- Enables tracking of recurring issues
- Supports incident reopening logic

**Trade-offs**:
- One incident per rule per service (not per unique error message)
- Requires manual rule configuration per service

---

## Frontend Components

### Pages

#### Overview (`apps/dashboard/src/pages/Overview.tsx`)

Main dashboard showing error trends.

**Features**:
- Service selector dropdown
- Time range selector (1h to 1y)
- Error trend chart (Recharts LineChart)
- Empty state guidance

**API Calls**:
- `GET /api/alerts/services` - Load service list
- `GET /api/metrics/errors` - Load trend data

#### Logs (`apps/dashboard/src/pages/LogsPage.tsx`)

Log explorer with filtering.

**Features**:
- Level filter dropdown
- Real-time refresh
- Paginated table view
- Empty state with guidance

**API Calls**:
- `GET /api/logs` - Query logs

#### Incidents (`apps/dashboard/src/pages/Incidents.tsx`)

Incident management dashboard.

**Features**:
- Incident summary cards (total, critical)
- Status badges (open, acknowledged, resolved)
- Acknowledge/Resolve actions
- Real-time refresh

**API Calls**:
- `GET /api/alerts/incidents` - List incidents
- `POST /api/alerts/incidents/:id/acknowledge`
- `POST /api/alerts/incidents/:id/resolve`

#### Alert Rules (`apps/dashboard/src/pages/AlertRules.tsx`)

Alert rule configuration.

**Features**:
- Rule summary (total, enabled, disabled)
- Create rule form
- Toggle enable/disable
- Delete rules
- Validation feedback

**API Calls**:
- `GET /api/alerts/rules` - List rules
- `POST /api/alerts/rules` - Create rule
- `PATCH /api/alerts/rules/:id` - Toggle
- `DELETE /api/alerts/rules/:id` - Delete

#### Notifications (`apps/dashboard/src/pages/Notifications.tsx`)

Notification channel management.

**Features**:
- Channel summary
- Add webhook form
- Toggle enable/disable
- URL validation

**API Calls**:
- `GET /api/alerts/channels` - List channels
- `POST /api/alerts/channels` - Create channel
- `PATCH /api/alerts/channels/:id` - Toggle

### Components

#### ErrorChart (`apps/dashboard/src/components/ErrorChart.tsx`)

Time-series line chart using Recharts.

**Props**:
- `data`: Array of `{time: string, count: number}`

**Features**:
- Responsive container
- Auto-scaling Y-axis
- Hidden X-axis (time on tooltip)
- Empty state handling

#### IncidentTable (`apps/dashboard/src/components/IncidentTable.tsx`)

Interactive table for incident management.

**Props**:
- `incidents`: Array of incidents
- `onChange`: Callback after action

**Features**:
- Status badge styling
- Action buttons (acknowledge/resolve)
- Loading states per row
- Empty state message

#### LogsTable (`apps/dashboard/src/components/LogsTable.tsx`)

Read-only table for log display.

**Props**:
- `logs`: Array of log entries

**Features**:
- Level-based color coding
- Truncated messages
- Timestamp formatting
- Empty state

#### AlertRuleForm (`apps/dashboard/src/components/AlertRuleForm.tsx`)

Form for creating alert rules.

**Props**:
- `onCreated`: Callback after creation

**Features**:
- Service name input
- Numeric inputs (threshold, window, cooldown)
- Inline help text
- Submit state handling

#### AlertRulesTable (`apps/dashboard/src/components/AlertRulesTable.tsx`)

Table for managing alert rules.

**Props**:
- `rules`: Array of rules
- `onChange`: Callback after modification

**Features**:
- Toggle switches for enable/disable
- Delete confirmation
- Badge styling for threshold
- Empty state

#### NotificationForm (`apps/dashboard/src/components/NotificationForm.tsx`)

Form for adding notification channels.

**Props**:
- `onCreated`: Callback after creation

**Features**:
- URL validation
- Type selection (currently webhook only)
- Help text
- Submit state

#### NotificationTable (`apps/dashboard/src/components/NotificationTable.tsx`)

Table for managing notification channels.

**Props**:
- `channels`: Array of channels
- `onChange`: Callback after modification

**Features**:
- Toggle switches
- URL truncation
- Empty state

#### ToggleSwitch (`apps/dashboard/src/components/ToggleSwitch.tsx`)

Reusable toggle component.

**Props**:
- `enabled`: Boolean state
- `onChange`: Callback with new value

**Features**:
- Smooth animation
- Visual feedback (green/gray)
- Accessible button

### Layout

#### DashboardLayout (`apps/dashboard/src/layouts/DashboardLayout.tsx`)

Main application layout with sidebar navigation.

**Features**:
- Fixed sidebar (64 width)
- Active route highlighting
- Brand header
- Version footer
- Responsive content area

**Routes**:
- `/` - Overview
- `/logs` - Logs Explorer
- `/incidents` - Incidents
- `/alerts` - Alert Rules
- `/notifications` - Notification Channels

---

## Service Layer

### Log Query Service (`apps/api/src/services/logQuery.service.ts`)

Handles log queries to Elasticsearch.

**Function**: `queryLogs(query: LogQuery)`

**Features**:
- Exact term matching (keyword fields)
- Time range filtering
- Pagination
- Sorted by timestamp descending

### Error Metrics Service (`apps/api/src/services/errorMetrics.service.ts`)

Aggregates error counts over time.

**Function**: `getErrorTrends(service: string, range: string)`

**Dynamic Intervals**:
- 1h → 1-minute buckets
- 24h → 5-minute buckets
- 7d → 1-hour buckets
- 30d → 6-hour buckets
- 3m, 6m → 1-day buckets
- 1y → 1-week buckets

**Function**: `countErrorsInWindow(service: string, windowMinutes: number)`

Counts errors in sliding time window for alert evaluation.

### Alert Evaluator Service (`apps/api/src/services/alertEvaluator.service.ts`)

Core alert evaluation logic.

**Function**: `evaluateAlerts()`

**Algorithm**:
1. Load all enabled rules
2. For each rule:
   - Query error count in window
   - Check threshold
   - Check cooldown
   - Generate fingerprint
   - Find existing incident
   - Determine action (create/update/reopen/suppress)
   - Send notifications if needed
3. Handle race conditions with DB constraints

### Notification Service (`apps/api/src/services/notification.service.ts`)

Sends notifications to configured channels.

**Function**: `sendNotifications(payload: any)`

**Features**:
- Fetches enabled channels
- Sends HTTP POST to webhooks
- Error handling (logs failures, doesn't throw)
- Future: Support for Slack, email, etc.

### Log Storage Service (`apps/api/src/services/logStorage.service.ts`)

Stores logs in Elasticsearch.

**Function**: `storeLog(log: LogSchema)`

**Features**:
- Daily index naming
- Timestamp normalization
- Level lowercasing
- Error propagation (for retry)

---

## Repositories

### Alert Rule Repository (`apps/api/src/repositories/alertRule.repo.ts`)

**Functions**:
- `getActiveAlertRules()` - Fetch enabled rules
- `markAlertTriggered(ruleId)` - Update last triggered timestamp

### Alert Incident Repository (`apps/api/src/repositories/alertIncident.repo.ts`)

**Functions**:
- `recordIncident(data)` - Create new incident
- `acknowledgeIncident(id)` - Set status to acknowledged
- `resolveIncident(id)` - Set status to resolved
- `getActiveIncidentForRule(ruleId)` - Find active incident for rule
- `findIncidentByFingerprint(fingerprint)` - Latest incident for fingerprint
- `reopenIncident(id)` - Reset to open status
- `updateLastSeenErrorAt(id)` - Update last error timestamp

---

## Utilities

### Fingerprint (`apps/api/src/utils/fingerprint.ts`)

**Function**: `getAlertFingerprint(service: string, ruleId: string)`

Generates unique identifier for incident deduplication.

**Format**: `{service}:{ruleId}`

### DB Errors (`apps/api/src/utils/dbErrors.ts`)

**Function**: `isUniqueViolation(err: any)`

Detects PostgreSQL unique constraint violations (code 23505).

Used for handling race conditions in incident creation.

---

## Schemas

### Log Schema (`apps/api/src/schemas/log.schema.ts`)

Validates incoming log events.

**Fields**:
- `service` (string, min 1)
- `level` (enum: debug|info|warn|error|fatal)
- `message` (string, min 1)
- `timestamp` (ISO8601 datetime, optional)
- `meta` (record, optional)

### Log Query Schema (`apps/api/src/schemas/logQuery.schema.ts`)

Validates log query parameters.

**Fields**:
- `service` (string, optional)
- `level` (enum, optional)
- `from` (ISO8601, optional)
- `to` (ISO8601, optional)
- `page` (number, min 1, default 1)
- `limit` (number, min 1, max 100, default 20)

---

## Deployment Considerations

### Scaling

**API Server**:
- Stateless, can run multiple instances
- Use load balancer (nginx, ALB)
- Scale horizontally

**Workers**:
- Ingest: Scale based on queue depth
- Alert: Single instance (idempotent evaluation)

**Elasticsearch**:
- Use cluster for high availability
- Shard by date (daily indices)
- Configure retention policy

**Redis**:
- Use Redis Sentinel or Cluster
- Persistent storage (AOF)

**PostgreSQL**:
- Connection pooling
- Read replicas for queries
- Regular backups

### Monitoring

**Application**:
- API response times
- Queue depth and processing rate
- Worker health checks
- Database connection pool

**Infrastructure**:
- Elasticsearch cluster health
- Redis memory usage
- PostgreSQL query performance

### Security

**API**:
- Add authentication (JWT, API keys)
- Rate limiting per client
- Input sanitization (Zod handles this)
- CORS configuration

**Database**:
- Use environment variables for credentials
- Enable SSL connections
- Principle of least privilege

**Elasticsearch**:
- Enable security features
- Use API keys or basic auth
- Restrict network access

### Retention

**Logs**:
- Daily indices enable easy deletion
- Use Elasticsearch ILM (Index Lifecycle Management)
- Example: Keep 30 days, then delete

**Incidents**:
- Archive resolved incidents after 90 days
- Keep alert rules indefinitely

---

## Troubleshooting

### Logs Not Appearing

1. Check API server is running: `curl http://localhost:4000/health`
2. Check ingest worker is running: `ps aux | grep ingest`
3. Check Redis connection: `redis-cli ping`
4. Check Elasticsearch: `curl http://localhost:9200/_cluster/health`
5. Check BullMQ jobs: View Redis keys `KEYS bull:log-ingestion:*`

### Alerts Not Triggering

1. Check alert worker is running: `ps aux | grep alert`
2. Verify alert rule is enabled: Check `enabled = true` in DB
3. Check error count: Query Elasticsearch directly
4. Verify cooldown hasn't suppressed alert
5. Check logs for "[ALERT DEBUG]" messages

### Incidents Duplicating

- Check fingerprint uniqueness
- Verify indexes exist on `alert_incidents`
- Review quiet period calculation
- Check for race conditions in logs

### Dashboard Not Loading Data

1. Check API CORS configuration
2. Verify API base URL in frontend (`http://localhost:4000/api`)
3. Check browser console for errors
4. Verify API endpoints return data

---

## Development

### Adding a New Alert Type

1. Create alert rule in DB or via API
2. Ensure service name matches log events
3. Configure threshold and window
4. Test by generating errors

### Adding a New Notification Channel

1. Update `notification_channels` table with new type
2. Implement handler in `notification.service.ts`
3. Add UI for configuration in dashboard
4. Test delivery

### Custom Log Fields

Logs support arbitrary metadata in the `meta` field. No schema changes needed.

```json
{
  "service": "payment-service",
  "level": "error",
  "message": "Payment failed",
  "meta": {
    "transactionId": "txn_123",
    "amount": 99.99,
    "currency": "USD"
  }
}
```

### Dashboard Customization

- Update colors in Tailwind config
- Add new pages in `src/pages`
- Register routes in `App.tsx`
- Add nav links in `DashboardLayout.tsx`

---

## Contributing

### Code Style

- TypeScript strict mode
- ESLint + Prettier
- Meaningful variable names
- JSDoc for complex functions

### Commit Convention

```
type(scope): description

Examples:
feat(api): add incident deduplication
fix(dashboard): resolve chart rendering issue
docs(readme): update deployment guide
```

### Testing

Currently no automated tests. Recommended additions:
- Unit tests for services
- Integration tests for API endpoints
- E2E tests for critical flows

---

## License

ISC

---

## Support

For issues, questions, or contributions:
1. Check troubleshooting section
2. Review API logs for errors
3. Verify infrastructure is running
4. Check database connectivity

---

**Built with care for production observability.**
