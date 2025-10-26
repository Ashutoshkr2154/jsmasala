import { productHandlers } from './productHandlers';
import { authHandlers } from './authHandlers';
// Import other handlers (e.g., orderHandlers) here

export const handlers = [
  ...productHandlers,
  ...authHandlers,
  // ...otherHandlers
];