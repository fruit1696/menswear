Yes. Let’s design **Cart + Cart Items together**.

### `carts`

| Field        | Type        | Constraints                               | Purpose           |
| ------------ | ----------- | ----------------------------------------- | ----------------- |
| `id`         | UUID        | PK, generated                             | Unique cart       |
| `user_id`    | UUID        | NOT NULL, FK → `profiles.user_id`, UNIQUE | One cart per user |
| `created_at` | Timestamptz | NOT NULL                                  | Creation time     |
| `updated_at` | Timestamptz | NOT NULL                                  | Last modification |

### `cart_items`

| Field        | Type        | Constraints                                 | Purpose           |
| ------------ | ----------- | ------------------------------------------- | ----------------- |
| `id`         | UUID        | PK, generated                               | Unique cart item  |
| `cart_id`    | UUID        | NOT NULL, FK → `carts.id` ON DELETE CASCADE | Cart              |
| `product_id` | UUID        | NOT NULL, FK → `products.id`                | Product           |
| `quantity`   | Integer     | NOT NULL, CHECK > 0                         | Quantity          |
| `created_at` | Timestamptz | NOT NULL                                    | Added time        |
| `updated_at` | Timestamptz | NOT NULL                                    | Last modification |

**Important constraint:** `UNIQUE(cart_id, product_id)` so the same product can't appear twice in one cart.

This gives us **1 user → 1 cart → many cart items**.
