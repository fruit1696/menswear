# Crazy Cut Piece — Monitoring, Alerting & Metrics Strategy

## 1. Overview and Purpose

This document defines the target architecture, operational metrics, and alerting guidelines for **Crazy Cut Piece**. 

As traffic scales, real-time observability is necessary to ensure payment reliability, prevent inventory stockouts, track checkout conversion rates, and catch integration failures (Razorpay / Supabase) before they impact customers.

---

## 2. Key Metric Categories

### 2.1 Business & Conversions
* `checkout.session_created`: Total checkout sessions initiated.
* `checkout.session_completed`: Successfully paid orders.
* `checkout.conversion_rate`: Ratio of completed payments to created checkout sessions.
* `cart.abandonment_rate`: Sessions where cart is active but payment is not attempted within 24h.
* `inventory.low_stock`: Triggered when product available stock falls below safety threshold (e.g. $< 5$ cutpieces).

### 2.2 Payment & Gateway Health (Razorpay)
* `payment.verified_success`: Count of cryptographically verified payments.
* `payment.invalid_signature`: Failed HMAC-SHA256 signature checks (potential tampering attempt).
* `payment.webhook_delivered`: Count of processed Razorpay webhook events (`payment.captured`, `payment.failed`).
* `payment.webhook_failed`: Count of unhandled or signature-mismatched webhooks.

### 2.3 System & Performance Metrics
* `http.request_count`: Total Edge Function invocations grouped by route and status code (`201`, `400`, `403`, `500`).
* `http.latency_ms`: Histogram tracking latency percentiles (p50, p95, p99) for checkout and payment verification.
* `db.query_latency_ms`: Response time for PostgreSQL DAO operations.

---

## 3. Alerting Classification & Notification Channels

| Severity | Event Examples | Target SLA | Notification Channels |
| :--- | :--- | :--- | :--- |
| **P0 - Critical** | Razorpay webhook signature failures, 5xx error spike ($> 2\%$), payment status discrepancy | Immediate ($< 5$ mins) | PagerDuty, Sentry, Urgent WhatsApp / Slack Alert |
| **P1 - Warning** | Product stock depletion ($< 5$ units), elevated checkout latency ($> 2.5\text{s}$) | Within 1 hour | Slack Channel / Email Digest |
| **P2 - Info** | Daily sales summary, user account creation milestones | Daily / Weekly | Email Report |

---

## 4. Planned Technical Architecture

```text
Supabase Edge Function Runtime (Deno)
   │
   ├─► 1. Structured JSON Logging ──► CloudWatch / Datadog / Logtail
   │      (console.info / console.error with requestId & tags)
   │
   └─► 2. Non-Blocking Telemetry Dispatcher (Future implementation)
          │
          ├─► Sentry (Error stack traces & unhandled exceptions)
          ├─► Webhook Forwarder (`ALERT_WEBHOOK_URL` -> Slack / Discord)
          └─► OpenTelemetry Collector (Trace propagation)
```

### Key Engineering Rules for Telemetry
1. **Zero Impact on Customer Path**: Telemetry and alerting dispatches must be async and fail-safe (`try...catch`). A monitoring system failure must **never** fail a customer checkout.
2. **Data Privacy & PII Protection**: Never log customer credit card details, CVVs, passwords, full auth tokens, or private billing details. Log only hashed IDs, amounts in paise, and anonymized request IDs.
3. **Environment Isolation**: Enable detailed debug metrics in `staging`, but enforce aggregated JSON logging in `production`.

---

## 5. Environment Configuration Roadmap

When enabling production monitoring in future sprints, the following secrets will be configured in Supabase Edge Function Secrets:

```bash
# Supabase Edge Function Secrets Roadmap
ALERT_WEBHOOK_URL="https://hooks.slack.com/services/..."
SENTRY_DSN="https://key@sentry.io/project-id"
METRICS_FLUSH_INTERVAL_MS="5000"
```
