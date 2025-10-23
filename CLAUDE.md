# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gabi Tasting V2 is a wine tasting management system built for wine critics to organize tastings, manage wineries, review wines, and generate AI-powered tasting notes. The application supports multi-tenancy with different roles (SUPER_ADMIN, ADMIN, TASTER, WINERY, GUEST) and features OTP-based authentication.

## Technology Stack

- **Framework**: Next.js 15 (App Router) with React 19 and Turbopack
- **Database**: PostgreSQL via Neon with Prisma ORM (using driver adapters)
- **Authentication**: NextAuth v5 (beta) with custom OTP credentials provider
- **UI**: Shadcn UI components + Tailwind CSS
- **AI Integration**: Vercel AI SDK with OpenAI (gpt-4.1) for tasting note generation
- **Email**: React Email with Resend
- **File Uploads**: UploadThing
- **Rich Text**: TipTap editor
- **Tables**: TanStack Table
- **Package Manager**: pnpm

## Development Commands

```bash
# Development
pnpm dev                 # Start dev server with Turbopack
pnpm build               # Build for production
pnpm start               # Start production server
pnpm lint                # Run ESLint

# Database
pnpm postinstall         # Generate Prisma client (runs automatically after install)
pnpm prisma:seed         # Seed database using tsx

# Email Development
pnpm email               # Start React Email dev server on port 3600

# Utility Scripts
pnpm main                # Run main.ts service script for testing email invites
```

## Architecture

### Multi-Tenant Route Structure

The application uses Next.js App Router with nested dynamic routes for multi-tenancy:

```
/[wineCriticSlug]                           # Wine critic dashboard
  /tastings                                  # Manage tastings
  /winerys                                   # Manage wineries
  /wines                                     # Manage wines
  /users                                     # Manage users
  /[tastingSlug]                            # Tasting details
    /tastingdays                             # Schedule tasting days
    /[winerySlug]                           # Winery in tasting
      /reviews                               # All wine reviews for winery
      /[wineId]                              # Wine details & review
        /new                                 # Create new review

/winery/[winerySlug]                        # Winery-specific portal
  /[tastingSlug]                            # Winery's tasting view
    /[wineId]                                # Wine review view
    /new                                     # Add new wine to tasting
  /wines                                     # Winery's wines
  /users                                     # Winery's users

/admin                                       # Super admin dashboard
  /winecritics                               # Manage wine critics
  /users                                     # Manage all users
  /otpsessions                               # Monitor OTP sessions
  /settings                                  # System settings

/(auth)/login                                # Authentication (route group)
```

### Database Schema Core Entities

- **WineCritic**: Top-level tenant with custom `tastingNotePrompt` for AI generation
- **Tasting**: Organized wine tasting events within a wine critic
- **Winery**: Wine producers that participate in tastings
- **Wine**: Individual wines with vintage, grapes, region, style, and optional technical files
- **Review**: Detailed wine evaluation (intensity, color, aroma, palate, score, AI-generated tasting notes)
- **TastingDay**: Schedule for tasting events with ordered wineries
- **Join Tables**: WineryTasting, WineTasting, TastingDayWinery (with ordering support)

### Service Layer Pattern

All database operations are abstracted into service modules in `src/services/`:
- `*-services.ts` files contain business logic and Prisma queries
- Export TypeScript types (e.g., `ReviewDAO`, `WineDAO`) for type safety
- Use Zod schemas for validation (e.g., `LoginSchema`)
- Services handle relationships and include necessary joins

Example services:
- `review-services.ts` - Wine review CRUD operations
- `wine-services.ts` - Wine management with winery relations
- `ai-services.ts` - OpenAI integration for tasting note generation
- `email-services.ts` - Resend email sending (invitations)
- `login-services.ts` - OTP authentication logic
- `analytics.ts` - Data analytics and reporting

### Authentication Flow

Custom OTP-based authentication using NextAuth v5:
1. User enters email
2. System generates OTP code and stores in `otp_codes` table
3. Email sent via `email-services.ts`
4. User enters code
5. CredentialsProvider validates OTP and creates session
6. JWT session with 7-day expiration
7. OTP sessions tracked in `otp_sessions` with device info (browser, OS, IP, location)

Session configuration in `src/lib/auth.ts` includes retry logic for Neon database sleep mode.

### AI Integration

Tasting notes are generated using OpenAI's `gpt-4.1` model:
- System prompt from `WineCritic.tastingNotePrompt` (customizable per critic)
- Can process PDF technical files via URL
- Uses Vercel AI SDK's `generateText` function
- Located in `src/services/ai-services.ts`

### File Upload

UploadThing integration for wine technical files:
- Configuration in `src/lib/uploadthing.ts`
- API route at `/api/uploadthing/route.ts`
- Files stored with metadata in Wine model (`technicalFileUrl`, `technicalFileName`)

### Email System

React Email templates with Tailwind styling:
- Templates in `src/components/email/`
- `invite-email.tsx` - Winery user invitations
- Sent via Resend in `src/services/email-services.ts`
- Test script in `src/services/main.ts`

## Important Implementation Details

### Path Alias
- Use `@/` for imports (resolves to `src/`)

### Database Connection
- Prisma configured with Neon serverless driver adapter
- Connection pooling via `POSTGRES_PRISMA_URL`
- Direct connection via `POSTGRES_URL_NON_POOLING`
- Database client exported from `src/lib/db.ts`

### Type Safety
- Prisma generates types in `node_modules/.prisma/client`
- Service layer exports DAO types for frontend consumption
- NextAuth extended types in `src/next-auth.d.ts`

### Component Library
- Shadcn UI components in `src/components/ui/`
- Custom layout components in `src/components/layout/`
- Data table components with TanStack Table in `src/components/data-table/`
- Chart components in `src/components/charts/`

### Environment Variables
- Required vars in `.env`: Database URLs, Auth secret, OpenAI key, Resend key, UploadThing keys
- NextAuth configuration requires `AUTH_SECRET`

### Running Single Tests
TypeScript files can be executed directly with tsx:
```bash
pnpm tsx path/to/file.ts
```

### Wine Styles
Enum values: RED, WHITE, ROSÉ, SPARKLING, FORTIFIED, ORANGE, OTHER

### User Roles Hierarchy
SUPER_ADMIN > ADMIN > TASTER > WINERY > GUEST
