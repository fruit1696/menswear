# Service layer

Services contain business rules and coordinate DAOs and integrations.

Use focused files such as:

- `profile.service.ts`
- `cart.service.ts`
- `wishlist.service.ts`
- `address.service.ts`
- `product.service.ts`
- `review.service.ts`
- `order.service.ts`
- `checkout.service.ts`
- `payment.service.ts`

Services must not depend on HTTP request/response objects or execute database queries directly.
