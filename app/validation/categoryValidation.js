import {z} from "zod";

const ALLOWED_COLORS = [
    "#EF4444", "#3B82F6", "#10B981", "#F59E0B",
    "#8B5CF6", "#EC4899", "#6366F1", "#6B7280"
];

export const createCategory=z.object({
    name: z.string()
        .min(2,"name must be atleast 2 characters")
        .max(50,"name is to long")
        .trim(),
    type: z.enum(["income", "expense"], {
        errorMap: () => ({ message: "Type must be 'income' or 'expense'" })
    }),

    description: z.string()
        .max(200,"too long description")
        .trim()
        .optional()
        .default(""),

    icon: z.string()
        .max(10, "Icon is too long")
        .trim()
        .optional()
        .default("📁"),

    color: z.enum(ALLOWED_COLORS, {
        errorMap: () => ({
            message: `Color must be one of: ${ALLOWED_COLORS.join(", ")}`
        })
    }).default("#3B82F6"),

    budget: z.number()
        .min(0, "Budget cannot be negative")
        .optional()
        .default(0)

})

export const updateCategorySchema = z.object({
    name: z.string()
        .min(2, "Category name must be at least 2 characters")
        .max(50, "Category name is too long")
        .trim()
        .optional(),

    description: z.string()
        .max(200, "Description is too long")
        .trim()
        .optional(),

    icon: z.string()
        .max(10, "Icon is too long")
        .trim()
        .optional(),

    color: z.enum(ALLOWED_COLORS).optional(),

    budget: z.number()
        .min(0, "Budget cannot be negative")
        .optional()
        .default(0)

});
