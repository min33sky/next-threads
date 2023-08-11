'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../db';

/**
 * 회원 정보를 가져옵니다.
 * @param id DB ID
 */
export async function fetchUser(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user;
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

/**
 * 로그인 한 회원 정보를 가져옵니다.
 * @param userId Clerk User ID
 */
export async function fetchMyStatus(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { userId },
    });

    console.log('########## fetchUser: ', user);

    return user;
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
