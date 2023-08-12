'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../db';
import { notFound } from 'next/navigation';
import { Prisma } from '@prisma/client';

/**
 * 회원 정보를 가져옵니다.
 * @param userId Clerk USER ID
 */
export async function fetchUser(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { userId },
      include: {
        threads: true,
      },
    });

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

/**
 * 해당 유저가 작성한 글을 가져옵니다.
 * @param id 유저 DB ID
 */
export async function fetchUserPosts(id: string) {
  try {
    // Find all threads authored by the use with the given userId
    const threads = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        threads: {
          include: {
            author: true,
            community: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            children: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return threads;
  } catch (error: any) {
    throw new Error(`Failed to fetch user posts: ${error.message}`);
  }
}
