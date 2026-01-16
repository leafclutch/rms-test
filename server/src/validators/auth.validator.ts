import { z } from 'zod';

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


export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
