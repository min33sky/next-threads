import { z } from 'zod';

const environment = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
});

export type Environment = z.infer<typeof environment>;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Environment {}
  }
}
