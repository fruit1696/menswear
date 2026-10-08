For now, I’d keep `profiles` deliberately small:

```text
profiles
──────────────
user_id
display_name
phone
created_at
updated_at
```

* `user_id` → UUID, primary key, unique FK → `auth.users.id`
* `display_name` → customer's display name
* `phone` → optional phone number
* `created_at`, `updated_at` → timestamps

**Don't put addresses here** if customers may have multiple addresses later. That should be a separate `addresses` table.


### `addresses`

| Field           | Type        | Purpose                                        |
| --------------- | ----------- | ---------------------------------------------- |
| `id`            | UUID        | Unique address identifier                      |
| `user_id`       | UUID        | Links the address to the customer profile      |
| `full_name`     | Text        | Name of the person receiving the order         |
| `phone`         | Text        | Contact number for delivery                    |
| `address_line1` | Text        | Primary street/building address                |
| `address_line2` | Text        | Apartment, unit, landmark, etc. — optional     |
| `city`          | Text        | Delivery city                                  |
| `state`         | Text        | State/province                                 |
| `postal_code`   | Text        | ZIP/postal code                                |
| `country`       | Text        | Country                                        |
| `is_default`    | Boolean     | Whether this is the customer's default address |
| `created_at`    | Timestamptz | When the address was created                   |
| `updated_at`    | Timestamptz | When the address was last updated              |

`user_id` should reference `profiles.user_id`. A user can have multiple addresses, but ideally only **one default address**.

