/**
 * DATA LAYER ENTRY POINT — portfolio copy.
 *
 * This copy is hardcoded to the in-memory DEMO backend (no real-api client, no
 * env flag) so it is always fully self-contained. Screens import `api` from here.
 * Types are re-exported from `mock-api` so screens import value + types from one
 * module. (The source app in the market-intelligence repo keeps the env-driven
 * demo/real dispatcher; here it is intentionally demo-only.)
 */
export * from "./mock-api"

import { demoApi } from "./mock-api"

export const IS_DEMO = true
export const api = demoApi
