Yes. Let's finalize **Reviews** with verified-purchase enforcement.

### `reviews`

| Field          | Type        | Constraints                       | Purpose             |
| -------------- | ----------- | --------------------------------- | ------------------- |
| `id`           | UUID        | PK, generated                     | Unique review       |
| `product_id`   | UUID        | NOT NULL, FK → `products.id`      | Reviewed product    |
| `user_id`      | UUID        | NOT NULL, FK → `profiles.user_id` | Reviewer            |
| `rating`       | Integer     | NOT NULL, CHECK 1–5               | Star rating         |
| `title`        | Text        | NULL, max 120 chars               | Optional title      |
| `body`         | Text        | NOT NULL, 10–2000 chars           | Review content      |
| `display_name` | Text        | NOT NULL, 1–80 chars              | Public display name |
| `created_at`   | Timestamptz | NOT NULL                          | Creation time       |
| `updated_at`   | Timestamptz | NOT NULL                          | Last update         |

### Database rules

* `UNIQUE (product_id, user_id)` → one review per customer per product.
* A review is allowed **only if that user has a completed/paid order containing that product**.
* This verified-purchase rule should be enforced by the **database**, not trusted only to the frontend.
* Reviews reference `products`, so the same system works for fabrics and future boxers.

**Review design finalized.**
