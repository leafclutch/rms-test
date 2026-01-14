import { z } from 'zod';

//Registration validation schema
export const registerSchema = z.object({
    body: z.object({
        email: z
            .string()
            .email('Invalid email format')
            .min(1, 'Email is required'),
        password: z
            .string()
            .min(6, 'Password must be at least 6 characters long')
            .max(100, 'Password must not exceed 100 characters'),
        name: z
            .string()
            .min(2, 'Name must be at least 2 characters long')
            .max(100, 'Name must not exceed 100 characters'),
    })
});

// Login validation schema
export const loginSchema = z.object({
    body: z.object({
        email: z
            .string()
            .email('Invalid email format')
            .min(1, 'Email is required'),
        password: z
            .string()
            .min(1, 'Password is required'),
    })
});


// Export types for use in controllers and services
export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
