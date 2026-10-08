## 2. `payments`

| Field                 | Type        | Constraints                | Purpose                         |
| --------------------- | ----------- | -------------------------- | ------------------------------- |
| `id`                  | UUID        | PK, generated              | Unique payment attempt          |
| `order_id`            | UUID        | NOT NULL, FK → `orders.id` | Related order                   |
| `provider`            | Enum        | NOT NULL                   | `razorpay`                      |
| `idempotency_key`     | Text        | NOT NULL, UNIQUE           | Prevent duplicate processing    |
| `provider_order_id`   | Text        | NULL, UNIQUE               | Razorpay order ID               |
| `provider_payment_id` | Text        | NULL, UNIQUE               | Razorpay payment ID             |
| `payment_method`      | Enum/Text   | NULL                       | Card, UPI, netbanking, etc.     |
| `amount`              | Numeric     | NOT NULL, CHECK > 0        | Payment amount                  |
| `currency`            | Text        | NOT NULL                   | `INR`                           |
| `status`              | Enum        | NOT NULL                   | Payment lifecycle               |
| `failure_reason`      | Text        | NULL                       | Failed-payment reason           |
| `provider_signature`  | Text        | NULL                       | Razorpay signature verification |
| `paid_at`             | Timestamptz | NULL                       | Successful payment time         |
| `metadata`            | JSONB       | NULL                       | Additional provider data        |
| `created_at`          | Timestamptz | NOT NULL                   | Creation time                   |
| `updated_at`          | Timestamptz | NOT NULL                   | Last update                     |

One order can have **multiple payment attempts**.


## 4. `refunds`

| Field                | Type        | Constraints                  | Purpose                |
| -------------------- | ----------- | ---------------------------- | ---------------------- |
| `id`                 | UUID        | PK, generated                | Unique refund          |
| `payment_id`         | UUID        | NOT NULL, FK → `payments.id` | Payment being refunded |
| `order_id`           | UUID        | NOT NULL, FK → `orders.id`   | Related order          |
| `return_id`          | UUID        | NULL, FK → `returns.id`      | Return causing refund  |
| `amount`             | Numeric     | NOT NULL, CHECK > 0          | Amount refunded        |
| `status`             | Enum        | NOT NULL                     | Refund lifecycle       |
| `provider_refund_id` | Text        | NULL, UNIQUE                 | Razorpay refund ID     |
| `reason`             | Text        | NULL                         | Refund reason          |
| `created_at`         | Timestamptz | NOT NULL                     | Refund initiated       |
| `processed_at`       | Timestamptz | NULL                         | Refund completed       |
| `updated_at`         | Timestamptz | NOT NULL                     | Last update            |

A payment can have **multiple partial refunds**, provided the total refunded amount never exceeds the payment amount.

### Overall relationship

```text
profiles
   │
   ▼
 orders
   │
   ├── order_items
   │       │
   │       ▼
   │   return_items
   │       │
   │       ▼
   │     returns
   │       │
   │       ▼
   │     refunds ──────► payments
   │
   └───────────────────► payments
```

**Behavior:** payment success is handled through Razorpay; return acceptance triggers inventory restoration; refund processing happens through Razorpay; database records preserve the full history.
