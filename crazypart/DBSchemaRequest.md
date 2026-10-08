# Product Option Request Schema

This schema stores requests from signed-in customers who want the same or a similar fabric in another color or pattern. Requests remain inside the website and can be answered through the admin interface.

## `product_option_requests`

| Field | Type | Constraints | Purpose |
| --- | --- | --- | --- |
| `id` | UUID | PK, generated | Unique request ID |
| `user_id` | UUID | NOT NULL, FK → `profiles.id`, ON DELETE CASCADE | Customer who submitted the request |
| `product_id` | UUID | NOT NULL, FK → `products.id`, ON DELETE RESTRICT | Exact product from which the request was opened |
| `product_name` | Text | NOT NULL | Product-name snapshot at submission time |
| `product_image` | Text | NULL | Product-image path or URL snapshot |
| `product_details` | JSONB | NOT NULL, defaults to `{}` | Relevant product snapshot such as price, SKU/code, color, pattern, and fabric type |
| `requested_color` | Text | NULL | Selected palette color or custom color |
| `requested_pattern` | Text | NULL | Selected pattern or custom pattern description |
| `customer_note` | Text | NULL, maximum 1,000 characters | Optional additional customer instructions |
| `status` | Text | NOT NULL, defaults to `new` | Request workflow state |
| `admin_reply` | Text | NULL, maximum 2,000 characters | Reply shown to the customer inside their account |
| `created_at` | Timestamptz | NOT NULL, defaults to current time | Submission time |
| `updated_at` | Timestamptz | NOT NULL, defaults to current time | Last admin update time |

## Relationships

```text
profiles 1 ───── N product_option_requests N ───── 1 products
```

- One customer can submit multiple requests.
- One product can receive requests from multiple customers.
- Deleting a customer deletes that customer's requests.
- A referenced product cannot be deleted while requests still refer to it.

The product name, image, and details are also stored as snapshots. This preserves what the customer saw when submitting, even if the live product information changes later.

## Validation rules

- At least one of `requested_color` or `requested_pattern` must be present.
- A customer can request only a color, only a pattern, or both.
- `customer_note` is optional and limited to 1,000 characters.
- `admin_reply` is optional and limited to 2,000 characters.
- `status` must be one of:

```text
new → checking → replied → closed
```

The admin UI exposes only the next valid workflow state. The database check constraint ensures that no unknown status can be stored.

## Row Level Security

RLS is enabled for the table.

### Customer permissions

- Authenticated customers can insert requests only for their own `user_id`.
- New customer submissions must have `status = 'new'`.
- New customer submissions cannot contain an admin reply.
- Customers can read only their own requests and replies.
- Customers cannot update request status or admin replies.

### Admin permissions

- Administrators can read every request.
- Administrators can update `status`, `admin_reply`, and `updated_at`.
- Admin access is checked through `private.is_admin()`.

Anonymous visitors cannot submit or read requests. If a visitor attempts to submit, the application sends them through the existing login flow before storing anything.

## Indexes

| Index | Purpose |
| --- | --- |
| `product_option_requests_user_created` | Efficiently lists a customer's newest requests in their account |
| `product_option_requests_status_created` | Efficiently lists and filters the admin request inbox by status and date |

## Application flow

```text
Product detail page
        ↓
Customer selects color and/or pattern
        ↓
Request is saved with customer and product IDs plus product snapshot
        ↓
Admin reviews request at /admin/requests
        ↓
Admin moves status forward and writes a reply
        ↓
Customer reads status and reply under Account → My fabric requests
```

## Source of truth

The implemented migration is:

`supabase/migrations/202609290001_product_option_requests.sql`

That migration is authoritative if this document and the deployed schema ever differ.
