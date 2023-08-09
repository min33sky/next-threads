import { z } from 'zod';

export const ThreadValidation = z.object({
  thread: z
    .string()
    .nonempty()
    .min(3, { message: '최소 3글자 이상 입력해주세요.' })
    .max(100, { message: '최대 100글자까지 입력 가능합니다.' }),
  accountId: z.string(),
});

export type ThreadValidationType = z.infer<typeof ThreadValidation>;

export const CommentValidation = z.object({
  thread: z
    .string()
    .nonempty()
    .min(3, { message: '최소 3글자 이상 입력해주세요.' }),
});

export type CommentValidationType = z.infer<typeof CommentValidation>;
