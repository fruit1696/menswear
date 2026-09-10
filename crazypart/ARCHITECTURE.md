# Crazy Cut Piece — Architecture & Engineering Standards

## 1. Purpose

This document defines the engineering standards and architectural rules for the Crazy Cut Piece website.

The website is being developed as a real production e-commerce application, not as a prototype or a collection of UI screens.

The application must be maintainable, scalable, testable, secure, and easy to extend.

**Do not sacrifice architecture quality for speed of implementation.**

---

## 2. Core Principles

All implementation must follow these principles:

* SOLID
* DRY — Don't Repeat Yourself
* Separation of Concerns
* Single Responsibility
* Composition over unnecessary inheritance
* Reusable components
* Clear boundaries between UI, business logic, data access, and infrastructure
* Strong typing wherever supported
* Explicit error handling
* Secure-by-default implementation
* Mobile-first responsive design
* Accessibility
* Maintainability over cleverness

Avoid unnecessary abstraction.

The goal is not to create the maximum number of files or layers. The goal is to create **clear boundaries and reusable abstractions where they provide real value.**

---

## 3. No Vibe Coding

Do not implement features by improvising directly inside existing components.

Before implementing a significant feature:

1. Understand the existing architecture.
2. Identify which layer the feature belongs to.
3. Check whether an existing component, service, utility, hook, type, or abstraction can be reused.
4. Define the data flow.
5. Define dependencies.
6. Implement the smallest clean solution.
7. Check for duplication and architectural violations.
8. Verify that existing functionality has not been broken.

Do not create temporary implementations with the intention of "cleaning them up later."

Do not use fake/mock implementations for production functionality unless explicitly requested for testing.

---

## 4. SOLID Principles

### Single Responsibility Principle

Each module, component, service, hook, and function should have one clear responsibility.

Do not create large components that simultaneously handle:

* UI
* API requests
* business logic
* authentication
* payment logic
* database operations
* validation

Separate these concerns.

### Open/Closed Principle

Design reusable modules so that new functionality can be added without repeatedly modifying unrelated existing code.

### Liskov Substitution Principle

Reusable abstractions must behave consistently with the contracts they represent.

### Interface Segregation Principle

Do not create large interfaces or types containing unrelated responsibilities.

Prefer small, focused contracts.

### Dependency Inversion Principle

Business logic should not be tightly coupled to specific infrastructure implementations.

For example, business logic should not directly depend on a specific payment provider or database implementation when an abstraction is appropriate.

---

## 5. DRY

Do not duplicate:

* Business logic
* Validation rules
* API logic
* Formatting logic
* Product calculations
* Cart calculations
* Authentication logic
* Payment logic
* Shared UI patterns
* Constants
* Types

If the same logic is required in multiple places, determine whether it belongs in a shared utility, service, hook, component, or domain module.

Do not over-abstract simple one-off code merely to satisfy DRY.

---

## 6. Separation of Concerns

Maintain clear separation between:

### Presentation Layer

Responsible for:

* Rendering UI
* User interaction
* Visual states
* Accessibility
* Responsive behavior

### Application Layer

Responsible for:

* Coordinating user actions
* Calling domain/services
* Managing application workflows

### Domain / Business Logic

Responsible for:

* Cart rules
* Pricing rules
* Inventory rules
* Order rules
* Wishlist behavior
* Checkout rules
* Other business decisions

Business logic must not depend directly on UI components.

### Data / Infrastructure Layer

Responsible for:

* Database access
* Authentication provider
* Payment provider
* External APIs
* Email services
* Storage
* Other infrastructure

UI components should not directly contain database or payment-provider logic.

---

## 7. Component Architecture

Components should be small, focused, and reusable.

Avoid extremely large components.

Prefer composition:

* Layout components
* UI primitives
* Shared components
* Feature components
* Page-level components

Do not duplicate nearly identical components simply because they appear on different pages.

Before creating a new component, check whether an existing component can be extended or composed.

---

## 8. Business Logic

Business logic must live outside presentation components whenever possible.

For example:

Cart calculations, order calculations, inventory checks, checkout validation, and payment verification should not be implemented directly inside JSX/UI components.

Business rules should have a clear and testable location.

---

## 9. Data Access

UI components must not directly manipulate the database.

Use a dedicated data-access/service layer.

The architecture should allow the underlying database or external provider to be changed without rewriting the entire UI.

Do not scatter database queries throughout the application.

---

## 10. API / Service Layer

External services must be accessed through dedicated service modules.

Examples:

* Authentication service
* Product service
* Cart service
* Wishlist service
* Order service
* Payment service
* User service
* Inventory service

Do not duplicate API request logic across multiple components.

Handle:

* Loading
* Success
* Failure
* Validation errors
* Network errors
* Authentication errors

consistently.

---

## 11. Authentication

Authentication must be implemented using a proper production-ready authentication system.

Do not build insecure custom authentication.

Authentication state should have one clear source of truth.

Do not duplicate login/session logic across components.

Protected functionality must be enforced at the appropriate application/server layer, not only by hiding UI elements.

---

## 12. Authorization

Authentication and authorization are separate concerns.

Being logged in does not automatically mean a user can access administrative functionality.

Admin operations must be protected independently.

Never rely only on frontend checks for authorization.

---

## 13. Payments

Payment processing must be implemented using a proper payment provider.

Never store sensitive payment information directly in the application unless explicitly required and legally/technically appropriate.

Payment success must be verified server-side.

Do not create an order merely because the frontend reports that payment succeeded.

The order/payment flow must be designed around verified payment status.

---

## 14. Orders

Orders must have a clear lifecycle.

Example:

`Pending → Paid → Processing → Shipped → Delivered`

Additional states such as cancelled or failed may be introduced when required.

Order state changes must follow explicit business rules.

Do not allow arbitrary client-side modification of order status.

---

## 15. Inventory

Inventory must be treated as server-side business data.

Do not rely solely on frontend stock values.

Prevent overselling through appropriate server-side validation and transaction/concurrency handling.

Product availability shown in the UI must not be treated as the final authority for purchase validation.

---

## 16. Validation

Validate data at appropriate boundaries.

Client-side validation is for user experience.

Server-side validation is authoritative.

Important data such as:

* User information
* Addresses
* Product quantities
* Prices
* Orders
* Payment information
* Inventory

must be validated on the server.

Never trust values sent by the client for sensitive business operations.

---

## 17. Error Handling

Errors must be handled intentionally.

Do not silently swallow errors.

Do not expose internal implementation details, database errors, secrets, or sensitive information to users.

Provide useful user-facing error states while keeping technical details available for appropriate logging/debugging.

Every important async operation should have:

* Loading state
* Success state
* Error state
* Empty state where applicable

---

## 18. State Management

Do not introduce global state unless there is a real need for it.

Use the smallest appropriate state scope.

Prefer:

* Local component state for local UI concerns
* Feature-level state for feature-specific concerns
* Shared/global state only for genuinely shared application state

Do not duplicate the same source of truth across multiple stores or components.

---

## 19. Types and Data Contracts

Create clear types/interfaces for important domain objects.

Examples:

* User
* Product
* ProductVariant
* CartItem
* Cart
* Wishlist
* Address
* Order
* OrderItem
* Payment
* Inventory

Do not repeatedly redefine the same object shape in different files.

Keep domain types separate from UI-specific types when their responsibilities differ.

---

## 20. Design System

The existing website's visual identity is part of the product and must be preserved.

Do not replace the existing design system without explicit approval.

Preserve:

* Typography
* Font families
* Font weights
* Colors
* Spacing language
* Border styles
* Radius
* Animation style
* Image treatment
* Overall premium/minimal aesthetic

New UI must visually belong to the existing website.

Avoid introducing arbitrary new fonts, colors, gradients, shadows, button styles, or design patterns.

---

## 21. Responsive Design

Mobile is a first-class experience, not a secondary version of desktop.

All new features must work properly across:

* Mobile
* Tablet
* Desktop

Avoid:

* Horizontal overflow
* Fixed widths that break layouts
* Text clipping
* Overlapping elements
* Unusable touch targets
* Excessive whitespace
* Desktop layouts simply compressed onto mobile

Test responsive behavior when implementing every major feature.

---

## 22. Accessibility

Follow accessible web practices.

Interactive elements must be:

* Keyboard accessible
* Properly labeled
* Visually understandable
* Usable with appropriate contrast
* Accessible to screen readers where applicable

Do not use clickable `<div>` elements when semantic interactive elements are appropriate.

---

## 23. Security

Never expose:

* API secrets
* Private keys
* Database credentials
* Payment secrets
* Server-only environment variables

to the client.

Use environment variables appropriately.

Validate and sanitize untrusted input.

Do not trust client-provided:

* Prices
* Discounts
* Inventory
* User roles
* Payment status
* Order status

Security-sensitive operations must be enforced server-side.

---

## 24. File and Folder Organization

Organize code according to responsibility and feature boundaries.

Avoid dumping unrelated files into large generic folders.

Prefer a structure that makes it obvious:

* Where UI lives
* Where business logic lives
* Where services live
* Where types live
* Where infrastructure lives
* Where feature-specific code lives

The exact folder structure should be chosen after inspecting the existing project's framework and conventions.

**Do not reorganize the entire existing project unnecessarily.**

---

## 25. Naming

Use clear, descriptive names.

Names should communicate responsibility.

Avoid vague names such as:

* `helper`
* `stuff`
* `common2`
* `temp`
* `newComponent`
* `utils2`

Use consistent naming conventions throughout the project.

---

## 26. Reusability

Before creating new functionality, inspect existing code for reusable:

* Components
* Hooks
* Services
* Utilities
* Types
* Constants
* Validation functions

Prefer composition and reuse over duplication.

However, do not create abstractions prematurely.

A reusable abstraction should solve a real repeated problem.

---

## 27. Performance

Do not optimize blindly.

First maintain clean architecture.

Then optimize real bottlenecks.

Pay attention to:

* Image loading
* Unnecessary renders
* Large bundles
* Network requests
* Database queries
* Expensive computations
* Mobile performance

Do not introduce complex caching or state-management solutions without a clear reason.

---

## 28. Testing

Critical business logic must be testable independently from the UI.

Prioritize tests for:

* Cart calculations
* Pricing
* Inventory rules
* Authentication behavior
* Authorization
* Checkout
* Payment verification
* Order creation
* Order state transitions

Do not rely only on manually clicking through the UI to validate business logic.

---

## 29. Existing Code First

Before changing an existing component or system:

1. Read the existing implementation.
2. Understand why it exists.
3. Identify dependencies.
4. Determine whether it can be reused.
5. Change only what is necessary.

Do not rewrite working parts of the application simply because a different implementation looks cleaner.

Avoid unnecessary refactoring while implementing unrelated features.

---

## 30. Change Management

Implement features incrementally.

Do not modify dozens of unrelated files for a small feature.

Each change should have a clear purpose.

After implementation:

* Check for TypeScript/build errors
* Check for runtime errors
* Check responsive behavior
* Check existing functionality
* Check duplicated logic
* Check architectural consistency

---

## 31. Important Rule — Plan Before Implementation

For every significant new feature, first provide:

1. What needs to change
2. Which existing files/components are affected
3. Which new files are required
4. Data flow
5. Dependencies
6. Architectural approach
7. Potential risks

**Do not start coding the feature until this implementation plan is clear.**

For small, obvious changes, this process can be lightweight.

---

## 32. No Unapproved Architecture Changes

Do not:

* Replace the framework
* Replace the database
* Replace authentication
* Replace the payment provider
* Rewrite the frontend
* Introduce a new state-management library
* Introduce a new UI library
* Rebuild the design system

unless explicitly requested or technically necessary and approved.

If an architectural change appears necessary, explain the reason and proposed approach before making it.

---

## 33. Definition of Done

A feature is not complete merely because it visually works.

A feature is considered complete when:

* It works functionally
* It follows the architecture
* Business logic is separated appropriately
* No unnecessary duplication exists
* Errors are handled
* Loading/empty states exist where needed
* Security boundaries are respected
* Mobile layout works
* Existing design language is preserved
* Existing functionality is not broken
* The code is maintainable
* The implementation does not create avoidable technical debt

---

## 34. Development Philosophy

Build this application as if another engineer will maintain it for the next five years.

Prefer:

**Simple + explicit + reusable + maintainable**

over:

**Fast + clever + duplicated + fragile**

When there is a tradeoff between adding a feature quickly and building it correctly, favor the architecture that keeps the application maintainable.

Do not hide complexity.

Put complexity in the correct layer.

