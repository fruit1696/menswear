# DAO layer

DAOs are the only business modules that query or mutate PostgreSQL.

Use focused files such as:

- `profile.dao.ts`
- `cart.dao.ts`
- `wishlist.dao.ts`
- `address.dao.ts`
- `product.dao.ts`
- `review.dao.ts`
- `order.dao.ts`
- `payment.dao.ts`

DAOs contain persistence operations only. Business workflows belong in services, and Razorpay or other provider calls belong in `integrations`.
