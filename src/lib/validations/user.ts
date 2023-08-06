import { z } from 'zod';

export const UserValidation = z.object({
  profile_photo: z.string().url().nonempty(),
  name: z.string().min(3).max(30),
  username: z.string().min(3).max(30),
  bio: z.string().max(1000),
});

export type UserRequest = z.infer<typeof UserValidation>;
