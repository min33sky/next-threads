import { z } from 'zod';

const environment = z.object({
  DATABASE_URL: z.string(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  NEXT_CLERK_WEBHOOK_SECRET: z.string(),
  CLERK_SECRET_KEY: z.string(),
  UPLOADTHING_SECRET: z.string(),
  UPLOADTHING_APP_ID: z.string(),
});

export type Environment = z.infer<typeof environment>;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Environment {}
  }
}
