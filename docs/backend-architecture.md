# Backend Architecture Documentation

## Overview

The system has been migrated to an enterprise-grade architecture with proper separation of concerns. The frontend no longer accesses Supabase directly - all data access goes through the API layer.

## Architecture Layers

```
Frontend (React + TanStack Query)
    ↓
API Layer (TanStack Start Server Functions)
    ↓
Domain Services (Business Logic)
    ↓
Repositories (Data Access)
    ↓
Supabase (Database)
```

## Directory Structure

```
src/backend/
├── shared/
│   ├── dto/              # Shared DTOs (pagination, filters, API responses)
│   └── types/            # Common types (pagination, roles, permissions)
├── infra/
│   ├── database/         # Base repository class
│   └── supabase/         # Supabase client wrapper
├── modules/
│   ├── customers/        # Customer domain
│   │   ├── dto/         # Customer DTOs
│   │   ├── repositories/ # Customer repositories
│   │   ├── services/    # Customer services
│   │   └── api/         # Customer API endpoints
│   ├── plans/           # Plans domain
│   ├── analytics/       # Analytics domain
│   ├── orders/          # Orders domain
│   ├── network/         # Network domain
│   └── payments/        # Payments domain
└── api/
    └── index.ts         # Central API exports
```

## Domain Implementation

### 1. Customer Domain

**DTOs:**
- `Customer` - Customer entity
- `CreateCustomerDto` - Customer creation
- `UpdateCustomerDto` - Customer update
- `Customer360` - Customer 360 view

**Repository:**
- `CustomerRepository` - Customer data access

**Service:**
- `CustomerService` - Customer business logic

**API Endpoints:**
- `GET /api/customers` - List customers
- `GET /api/customers/:id` - Get customer by ID
- `GET /api/customers/:id/360` - Get customer 360 view
- `POST /api/customers` - Create customer
- `PATCH /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer
- `GET /api/customers/stats` - Get customer statistics
- `GET /api/customers/:id/downlines` - Get customer downlines

### 2. Plans Domain

**DTOs:**
- `Plan` - Plan entity
- `CreatePlanDto` - Plan creation
- `UpdatePlanDto` - Plan update
- `PlanBonus` - Plan bonus entity
- `CustomerPlan` - Customer plan entity

**Repositories:**
- `PlanRepository` - Plan data access
- `PlanBonusRepository` - Plan bonus data access
- `CustomerPlanRepository` - Customer plan data access

**Service:**
- `PlanService` - Plan business logic

**API Endpoints:**
- `GET /api/plans` - List plans
- `GET /api/plans/:id` - Get plan by ID
- `GET /api/plans/slug/:slug` - Get plan by slug
- `POST /api/plans` - Create plan
- `PATCH /api/plans/:id` - Update plan
- `DELETE /api/plans/:id` - Delete plan
- `GET /api/plans/:id/bonuses` - Get plan bonuses
- `POST /api/plans/bonuses` - Create plan bonus
- `DELETE /api/plans/bonuses/:id` - Delete plan bonus
- `POST /api/plans/activate` - Activate customer plan
- `POST /api/plans/deactivate` - Deactivate customer plan
- `GET /api/plans/stats` - Get plan statistics

### 3. Analytics Domain

**DTOs:**
- `ExecutiveAnalytics` - Executive analytics
- `SalesAnalytics` - Sales analytics
- `NetworkAnalytics` - Network analytics
- `PlanAnalytics` - Plan analytics
- `BonusDistribution` - Bonus distribution

**Repository:**
- `AnalyticsRepository` - Analytics data access (materialized views)

**Service:**
- `AnalyticsService` - Analytics business logic

**API Endpoints:**
- `GET /api/analytics/executive` - Get executive analytics
- `GET /api/analytics/sales` - Get sales analytics
- `GET /api/analytics/network` - Get network analytics
- `GET /api/analytics/plans` - Get plan analytics
- `GET /api/analytics/bonus-distribution` - Get bonus distribution

### 4. Orders Domain

**DTOs:**
- `Order` - Order entity
- `CreateOrderDto` - Order creation
- `UpdateOrderDto` - Order update
- `OrderItem` - Order item entity
- `OrderSummary` - Order summary

**Repositories:**
- `OrderRepository` - Order data access
- `OrderItemRepository` - Order item data access

**Service:**
- `OrderService` - Order business logic

**API Endpoints:**
- `GET /api/orders` - List orders
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/summary` - Get order summary
- `POST /api/orders` - Create order
- `PATCH /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order
- `GET /api/orders/:id/items` - Get order items
- `GET /api/orders/stats` - Get order statistics

### 5. Network Domain

**DTOs:**
- `NetworkTreeNode` - Network tree node
- `NetworkTree` - Network tree
- `DownlineNode` - Downline node
- `UplineNode` - Upline node
- `NetworkStats` - Network statistics

**Repository:**
- `NetworkRepository` - Network data access

**Service:**
- `NetworkService` - Network business logic

**API Endpoints:**
- `GET /api/network/tree` - Get network tree
- `GET /api/network/downlines` - Get downlines
- `GET /api/network/upline` - Get upline
- `GET /api/network/stats` - Get network statistics

### 6. Payments Domain

**DTOs:**
- `Payment` - Payment entity
- `CreatePaymentDto` - Payment creation
- `UpdatePaymentDto` - Payment update
- `WebhookPayload` - Webhook payload

**Repository:**
- `PaymentRepository` - Payment data access

**Service:**
- `PaymentService` - Payment business logic

**API Endpoints:**
- `GET /api/payments` - List payments
- `GET /api/payments/:id` - Get payment by ID
- `POST /api/payments` - Create payment
- `PATCH /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment
- `POST /api/payments/webhook` - Process payment webhook
- `GET /api/payments/stats` - Get payment statistics

## Key Principles

### 1. Separation of Concerns
- Frontend: UI and user interaction only
- API Layer: Request/response handling
- Services: Business logic
- Repositories: Data access only

### 2. No Direct Database Access
- Frontend never accesses Supabase directly
- All data access goes through repositories
- Repositories use service role key for full access

### 3. Type Safety
- Zod schemas for validation
- TypeScript types for all DTOs
- Strict typing throughout

### 4. Error Handling
- Consistent error responses
- Proper error messages
- Try-catch in all API handlers

### 5. Pagination
- Consistent pagination across all list endpoints
- Page, limit, offset parameters
- Total count and total pages in response

## Frontend Migration Guide

### Before (Direct Supabase Access)
```typescript
import { supabase } from '@/lib/supabase';

const { data } = await supabase.from('customers').select('*');
```

### After (API Layer)
```typescript
import { useQuery } from '@tanstack/react-query';
import { getCustomers } from '@/backend/api';

const { data } = useQuery({
  queryKey: ['customers'],
  queryFn: () => getCustomers({ page: 1, limit: 20 }),
});
```

## Security

### RLS (Row Level Security)
- RLS policies are active on all tables
- Frontend uses anon key (limited access)
- Backend uses service role key (full access)

### JWT Authentication
- JWT tokens for authentication
- Role-based access control
- Permission-based authorization

## Next Steps

1. **Auth Module**: Implement JWT authentication with roles and guards
2. **Event System**: Implement event-driven architecture for automation
3. **Chatwoot Integration**: Integrate with Chatwoot for customer communication
4. **Frontend Migration**: Migrate all frontend components to use API layer
5. **Observability**: Implement logging, tracing, and audit trails
