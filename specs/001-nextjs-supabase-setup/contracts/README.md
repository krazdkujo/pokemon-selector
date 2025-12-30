# API Contracts: Initial Project Setup

**Feature Branch**: `001-nextjs-supabase-setup`
**Date**: 2025-12-30

## Overview

This feature establishes the project infrastructure. The only API endpoint defined is a health check for verifying deployment success and Supabase connectivity.

## Endpoints

| Method | Path | Description | Contract File |
|--------|------|-------------|---------------|
| GET | `/api/health` | System health check | `api-health.yaml` |

## Contract Files

### api-health.yaml

Defines the health check endpoint used to verify:
- Application is running
- Supabase connection is successful
- Source folder data is accessible

This endpoint supports the acceptance criteria:
- SC-002: Application loads in browser with zero console errors
- SC-003: Supabase client connects and initializes within 3 seconds

## Future Endpoints

Additional API endpoints will be defined in subsequent features:
- Authentication endpoints (Spec 2: Login Screen)
- Pokemon data endpoints (future features)
- Battle/game logic endpoints (future features)

## Notes

- All API routes follow REST conventions
- Responses are JSON format
- Error responses include descriptive messages
- Health endpoint is public (no authentication required)
