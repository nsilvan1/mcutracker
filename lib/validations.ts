import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha muito longa'),
});

// Progress schema
export const progressSchema = z.object({
  watchedItems: z
    .array(z.string())
    .max(200, 'Limite de itens excedido'),
});

// MCU Item schema (for admin updates)
export const mcuItemUpdateSchema = z.object({
  id: z.string().min(1, 'ID é obrigatório'),
  title: z.string().optional(),
  originalTitle: z.string().optional(),
  description: z.string().optional(),
  synopsis: z.string().optional(),
  releaseYear: z.number().min(2008).max(2030).optional(),
  phase: z.number().min(1).max(10).optional(),
  rating: z.number().min(0).max(10).optional(),
  duration: z.string().optional(),
  director: z.string().optional(),
  creator: z.string().optional(),
  cast: z.array(z.string()).optional(),
  genres: z.array(z.string()).optional(),
  budget: z.string().optional(),
  boxOffice: z.string().optional(),
  imageUrl: z.string().url().optional(),
  backdropUrl: z.string().url().optional(),
  whereToWatch: z.array(z.string()).optional(),
});

// Contact/feedback schema
export const feedbackSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome muito longo'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  message: z
    .string()
    .min(10, 'Mensagem deve ter pelo menos 10 caracteres')
    .max(2000, 'Mensagem muito longa'),
  type: z.enum(['bug', 'suggestion', 'other']).optional(),
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProgressInput = z.infer<typeof progressSchema>;
export type MCUItemUpdateInput = z.infer<typeof mcuItemUpdateSchema>;
export type FeedbackInput = z.infer<typeof feedbackSchema>;

// Validation helper
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.issues.map((err: z.ZodIssue) => {
    const path = err.path.join('.');
    return path ? `${path}: ${err.message}` : err.message;
  });

  return { success: false, errors };
}

// Helper to format Zod errors for API responses
export function formatZodErrors(error: z.ZodError): string {
  return error.issues
    .map((err: z.ZodIssue) => {
      const path = err.path.join('.');
      return path ? `${path}: ${err.message}` : err.message;
    })
    .join(', ');
}
