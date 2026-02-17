import mongoose from 'mongoose'

import {z} from 'zod'

export const registerSchema = z.object({
    name:z.string()
        .min(2,"name must be at least 2 characters")
        .max(50,"name cannot exceed 50 characters")
        .trim(),

    email:z.string()
        .email("invalid email address")
        .toLowerCase()
        .trim(),

    password:z.string()
        .min(6,"password must be at least 6 characters")
        .max(100,"password is too long"),

    currency:z.enum(["USD","INR","PKR","EUR"])
        .default("PKR")
        .optional()
})

export const loginSchema = z.object({
    email:z.string()
        .email("invalid email address")
        .toLowerCase()
        .trim(),
    password:z.string()
        .min(1,"password is required")
})

export const updateProfileSchema = z.object({
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name cannot exceed 50 characters")
        .trim()
        .optional(),

    currency: z.enum(["USD", "INR", "PKR", "EUR"])
        .optional()
});