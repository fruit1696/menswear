# API layer

This directory will contain the single public application API Edge Function.

```text
api/
  index.ts             # composition root and request dispatcher
  routes/
    profile.api.ts
    cart.api.ts
    wishlist.api.ts
    address.api.ts
    product.api.ts
    review.api.ts
    order.api.ts
    checkout.api.ts
    payment.api.ts
```

Route files validate HTTP input, authenticate and authorize callers, invoke one service operation, and format the response. They must not query PostgreSQL or call third-party providers directly.

An executable `index.ts` will be added with the first migrated vertical slice. Until then, this folder deliberately contains no deployable placeholder endpoint.
