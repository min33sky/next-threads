'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../db';

interface CreateThreadParams {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createThread({
  text,
  author,
  communityId,
  path,
}: CreateThreadParams) {
  try {
    await prisma.thread.create({
      data: {
        text,
        authorId: author,
      },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }
}
