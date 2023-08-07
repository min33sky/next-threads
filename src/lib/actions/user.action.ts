'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../db';

/**
 * 회원 정보를 가져옵니다.
 * @param userId Clerk User ID
 */
export async function fetchUser(userId: string) {
  try {
    return await prisma.user.findUnique({
      where: { userId },
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

interface UpdateUserParams {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: UpdateUserParams) {
  try {
    await prisma.user.upsert({
      where: { userId },
      update: {
        username,
        name,
        bio,
        image,
      },
      create: {
        userId,
        name,
        username: username.toLowerCase(),
        bio,
        image,
        onboarded: true,
      },
    });

    if (path === '/profile/edit') {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}
