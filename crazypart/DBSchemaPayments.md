

## 1. `orders`

| Field                    | Type        | Constraints                     | Purpose                           |
| ------------------------ | ----------- | ------------------------------- | --------------------------------- |
| `id`                     | UUID        | PK, generated                   | Unique order                      |
| `order_number`           | Text        | NOT NULL, UNIQUE, DB-generated  | Customer-facing order number      |
| `user_id`                | UUID        | NULL, FK → `profiles.user_id`   | Customer; NULL for guest checkout |
| `status`                 | Enum        | NOT NULL                        | Overall order lifecycle           |
| `subtotal`               | Numeric     | NOT NULL, CHECK >= 0            | Sum of item totals                |
| `shipping_fee`           | Numeric     | NOT NULL, CHECK >= 0            | Shipping charge                   |
| `discount`               | Numeric     | NOT NULL, DEFAULT 0, CHECK >= 0 | Discount applied                  |
| `total_amount`           | Numeric     | NOT NULL, CHECK >= 0            | Final order amount                |
| `shipping_full_name`     | Text        | NOT NULL                        | Shipping snapshot                 |
| `shipping_phone`         | Text        | NOT NULL                        | Shipping snapshot                 |
| `shipping_address_line1` | Text        | NOT NULL                        | Shipping snapshot                 |
| `shipping_address_line2` | Text        | NULL                            | Shipping snapshot                 |
| `shipping_city`          | Text        | NOT NULL                        | Shipping snapshot                 |
| `shipping_state`         | Text        | NOT NULL                        | Shipping snapshot                 |
| `shipping_postal_code`   | Text        | NOT NULL                        | Shipping snapshot                 |
| `shipping_country`       | Text        | NOT NULL                        | Shipping snapshot                 |
| `created_at`             | Timestamptz | NOT NULL                        | Creation time                     |
| `updated_at`             | Timestamptz | NOT NULL                        | Last update                       |

### `order_items`

| Field          | Type        | Constraints                                  | Purpose                      |
| -------------- | ----------- | -------------------------------------------- | ---------------------------- |
| `id`           | UUID        | PK, generated                                | Unique order item            |
| `order_id`     | UUID        | NOT NULL, FK → `orders.id` ON DELETE CASCADE | Parent order                 |
| `product_id`   | UUID        | NULL, FK → `products.id` ON DELETE SET NULL  | Original product             |
| `product_name` | Text        | NOT NULL                                     | Purchase-time snapshot       |
| `sku`          | Text        | NOT NULL                                     | Purchase-time SKU snapshot   |
| `image_url`    | Text        | NULL                                         | Purchase-time image snapshot |
| `quantity`     | Integer     | NOT NULL, CHECK > 0                          | Quantity purchased           |
| `unit_price`   | Numeric     | NOT NULL, CHECK >= 0                         | Price at purchase            |
| `line_total`   | Numeric     | NOT NULL, CHECK >= 0                         | `unit_price × quantity`      |
| `created_at`   | Timestamptz | NOT NULL                                     | Creation time                |

---
---

## 3. `returns`

A return represents the **return request/process**, not the individual products.

| Field          | Type        | Constraints                       | Purpose                    |
| -------------- | ----------- | --------------------------------- | -------------------------- |
| `id`           | UUID        | PK, generated                     | Unique return              |
| `order_id`     | UUID        | NOT NULL, FK → `orders.id`        | Related order              |
| `user_id`      | UUID        | NOT NULL, FK → `profiles.user_id` | Customer requesting return |
| `status`       | Enum        | NOT NULL                          | Return lifecycle           |
| `reason`       | Text        | NOT NULL                          | Customer's return reason   |
| `notes`        | Text        | NULL                              | Additional details         |
| `requested_at` | Timestamptz | NOT NULL                          | Return requested           |
| `received_at`  | Timestamptz | NULL                              | Returned item received     |
| `completed_at` | Timestamptz | NULL                              | Return completed           |
| `created_at`   | Timestamptz | NOT NULL                          | Creation time              |
| `updated_at`   | Timestamptz | NOT NULL                          | Last update                |

### `return_items`

| Field              | Type        | Constraints                                   | Purpose                    |
| ------------------ | ----------- | --------------------------------------------- | -------------------------- |
| `id`               | UUID        | PK, generated                                 | Unique return item         |
| `return_id`        | UUID        | NOT NULL, FK → `returns.id` ON DELETE CASCADE | Parent return              |
| `order_item_id`    | UUID        | NOT NULL, FK → `order_items.id`               | Item being returned        |
| `quantity`         | Integer     | NOT NULL, CHECK > 0                           | Quantity returned          |
| `condition`        | Enum        | NULL                                          | Condition after inspection |
| `inspection_notes` | Text        | NULL                                          | Inspection details         |
| `created_at`       | Timestamptz | NOT NULL                                      | Creation time              |
| `updated_at`       | Timestamptz | NOT NULL                                      | Last update                |

This supports **partial returns**.

---