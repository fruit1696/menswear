Yes. I’d make the catalog structure this:

## 1. `product_types`

Defines the controlled categories of products the store can sell.

| Field         | Type        | Constraints          | Purpose                           |
| ------------- | ----------- | -------------------- | --------------------------------- |
| `id`          | UUID        | **PK**, generated    | Unique product-type ID            |
| `name`        | Text        | **NOT NULL, UNIQUE** | Type name, e.g. `fabric`, `boxer` |
| `description` | Text        | Nullable             | Description of the product type   |
| `created_at`  | Timestamptz | **NOT NULL**         | Creation timestamp                |
| `updated_at`  | Timestamptz | **NOT NULL**         | Last update timestamp             |

Initial values:

```text
fabric
boxer
```

---

## 2. `products`

The **generic product record** shared by every product type.

| Field             | Type        | Constraints                         | Purpose                              |
| ----------------- | ----------- | ----------------------------------- | ------------------------------------ |
| `id`              | UUID        | **PK**, generated                   | Unique product ID                    |
| `product_type_id` | UUID        | **FK → product_types.id, NOT NULL** | Identifies the product type          |
| `name`            | Text        | **NOT NULL**                        | Customer-facing product name         |
| `description`     | Text        | Nullable                            | General product description          |
| `price`           | Numeric     | **NOT NULL, CHECK >= 0**            | Current selling price                |
| `sku`             | Text        | **NOT NULL, UNIQUE**                | Unique product SKU                   |
| `status`          | Enum/Text   | **NOT NULL**                        | `active`, `inactive`, `discontinued` |
| `featured`        | Boolean     | **NOT NULL, DEFAULT false**         | Whether product is featured          |
| `created_at`      | Timestamptz | **NOT NULL**                        | Creation timestamp                   |
| `updated_at`      | Timestamptz | **NOT NULL**                        | Last update timestamp                |

Relationship:

```text
products.product_type_id
        ↓
product_types.id
```

---

## 3. `fabrics`
fabrics enforce things:

fabric_type → cotton | linen | silk
pattern     → plain | checks | stripes
PostgreSQL ENUMs, so invalid values are blocked at the database level.
Contains attributes **specific to fabric products**.

| Field          | Type        | Constraints               | Purpose                             |
| -------------- | ----------- | ------------------------- | ----------------------------------- |
| `product_id`   | UUID        | **PK + FK → products.id** | Links to the generic product        |
| `fabric_type`  | Text        | **NOT NULL**              | Cotton, Linen, etc.                 |
| `color`        | Text        | **NOT NULL**              | Specific product color              |
| `color_family` | Text        | **NOT NULL**              | Used for filtering/grouping         |
| `pattern`      | Text        | **NOT NULL**              | Plain, Checks, Stripes, etc.        |
| `weight`       | Text        | **NOT NULL**              | Lightweight, Midweight, Heavyweight |
| `width_inches` | Numeric     | **NOT NULL, CHECK > 0**   | Fabric width                        |
| `created_at`   | Timestamptz | **NOT NULL**              | Creation timestamp                  |
| `updated_at`   | Timestamptz | **NOT NULL**              | Last update timestamp               |

The important part is:

```text
products 1 ───── 1 fabrics
```

`product_id` being both **PK and FK** enforces one fabric-detail record per product.

---

## 4. `boxers`

We don't know the final boxer requirements yet, so keep this intentionally minimal.

| Field        | Type        | Constraints               | Purpose                      |
| ------------ | ----------- | ------------------------- | ---------------------------- |
| `product_id` | UUID        | **PK + FK → products.id** | Links to the generic product |
| `size`       | Text        | Nullable for now          | Boxer size                   |
| `color`      | Text        | Nullable for now          | Boxer color                  |
| `material`   | Text        | Nullable for now          | Material/fabric composition  |
| `created_at` | Timestamptz | **NOT NULL**              | Creation timestamp           |
| `updated_at` | Timestamptz | **NOT NULL**              | Last update timestamp        |

We can completely redesign `boxers` when you're actually ready to sell them. **Don't over-engineer a product we don't have yet.**

### Overall relationship

```text
product_types
      │
      │ 1:N
      ▼
   products
      │
      ├──────── 1:1 ────────► fabrics
      │
      └──────── 1:1 ────────► boxers
```

One thing we should decide **before moving on**: how we enforce that a `products` row with `product_type = fabric` **must have a `fabrics` row and cannot have a `boxers` row**. That's an important integrity rule and is worth deciding before we start writing SQL.

### `product_images`

Stores images separately because one product can have multiple images.

| Field           | Type        | Constraints                    | Purpose                           |
| --------------- | ----------- | ------------------------------ | --------------------------------- |
| `id`            | UUID        | **PK**, generated              | Unique image ID                   |
| `product_id`    | UUID        | **FK → products.id, NOT NULL** | Product this image belongs to     |
| `image_url`     | Text        | **NOT NULL**                   | Supabase Storage/public image URL |
| `display_order` | Integer     | **NOT NULL, CHECK >= 0**       | Controls image ordering           |
| `is_primary`    | Boolean     | **NOT NULL, DEFAULT false**    | Identifies the main product image |
| `created_at`    | Timestamptz | **NOT NULL**                   | When the image was added          |

Relationship:

```text
products 1 ───── N product_images
```

We should also enforce **only one `is_primary = true` image per product** with a PostgreSQL partial unique index.

### `inventory`

Since stock belongs to the **product**, not specifically to fabrics or boxers, keep inventory separate from product-type tables.

| Field        | Type        | Constraints               | Purpose                                  |
| ------------ | ----------- | ------------------------- | ---------------------------------------- |
| `product_id` | UUID        | **PK + FK → products.id** | Product whose inventory is being tracked |
| `quantity`   | Integer     | **NOT NULL, CHECK >= 0**  | Current available stock                  |
| `updated_at` | Timestamptz | **NOT NULL**              | When stock was last updated              |

Relationship:

```text
products 1 ───── 1 inventory
```

For now, I'd keep it this simple. **No `stock_quantity` in `products`**—inventory has one clear owner. Later, if you need inventory history, reservations, restocking, or adjustments, we can add an `inventory_movements` table rather than bloating this one.

### `inventory_reservations`

Temporarily holds product stock while a customer is completing checkout.

| Field        | Type        | Constraints                     | Purpose                                                      |
| ------------ | ----------- | ------------------------------- | ------------------------------------------------------------ |
| `id`         | UUID        | **PK**, generated               | Unique reservation ID                                        |
| `product_id` | UUID        | **FK → products.id, NOT NULL**  | Product being reserved                                       |
| `quantity`   | Integer     | **NOT NULL, CHECK > 0**         | Number of units reserved                                     |
| `user_id`    | UUID        | **FK → profiles.user_id, NULL** | Customer making the reservation; nullable for guest checkout |
| `expires_at` | Timestamptz | **NOT NULL**                    | When the reservation expires                                 |
| `status`     | Enum/Text   | **NOT NULL**                    | `active`, `confirmed`, `expired`, `cancelled`                |
| `created_at` | Timestamptz | **NOT NULL**                    | When reservation was created                                 |
| `updated_at` | Timestamptz | **NOT NULL**                    | Last status/update time                                      |

Relationship:

```text id="6hj7aq"
products 1 ───── N inventory_reservations
profiles 1 ───── N inventory_reservations
```

### Stock logic

We **do not deduct from `inventory.quantity` when checkout starts**.

```text
Available stock
= inventory.quantity
− active reservations
```

At checkout:

```text
Customer starts checkout
        ↓
Create reservation (10 min)
        ↓
Razorpay payment succeeds
        ↓
Reservation → confirmed
        ↓
Inventory permanently decreases
```

If the customer doesn't complete payment:

```text
10 minutes pass
        ↓
Reservation → expired
        ↓
Stock becomes available again
```

This keeps `inventory.quantity` representing **actual physical stock**, while reservations represent **temporarily held stock**.
