import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';
import { User } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const authHandlers = [
  /**
   * Handler for POST /api/auth/login
   * Simulates a user login.
   */
  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    const { email } = (await request.json()) as { email: string };

    // Simulate a successful login
    const user: User = {
      id: faker.string.uuid(),
      name: faker.person.firstName(),
      email: email,
    };

    return HttpResponse.json({
      user,
      token: `mock-jwt-token-${Date.now()}`, // Send a fake JWT
    });
  }),

  /**
   * Handler for POST /api/auth/register
   * Simulates user registration.
   */
  http.post(`${API_BASE_URL}/auth/register`, async ({ request }) => {
    const { email, name } = (await request.json()) as { email: string, name: string };

    // Simulate a successful registration
    const user: User = {
      id: faker.string.uuid(),
      name: name,
      email: email,
    };

    return HttpResponse.json({
      user,
      token: `mock-jwt-token-${Date.now()}`, // Send a fake JWT
    }, { status: 201 }); // 201 Created
  }),
  
  /**
   * Handler for GET /api/auth/me
   * Simulates fetching the current user profile.
   * This route would be protected in a real app.
   */
  http.get(`${API_BASE_URL}/auth/me`, ({ request }) => {
     const token = request.headers.get('Authorization');
     
     if (token && token.startsWith('Bearer mock-jwt-token')) {
       // In a real app, you'd verify the token.
       // Here, we just return a mock user if any valid-looking token is present.
       const user: User = {
         id: faker.string.uuid(),
         name: "Mock User",
         email: "user@example.com",
       };
       return HttpResponse.json(user);
     } else {
       // No token, return unauthorized
       return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
     }
  }),
];