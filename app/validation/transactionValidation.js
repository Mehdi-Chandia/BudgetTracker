import {z} from 'zod'

export const transactionValidation=z.object({
    type: z.enum(["income","expense"]),
    description:z.string()
        .optional()
        .default(""),
    date:z.date()
        .default(()=>new Date()),
    amount:z.number()
        .positive("Amount must be positive number"),
})