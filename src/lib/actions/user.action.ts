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

interface FetchUsersParams {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: 'asc' | 'desc';
}
// Almost similar to Thead (search + pagination) and Community (search + pagination)
export async function fetchUsers({
  userId,
  pageNumber = 1,
  pageSize = 20,
  searchString = '',
  sortBy = 'desc',
}: FetchUsersParams) {
  try {
    // Calculate the number of users to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // If the search string is not empty, add the $or operator to match either username or name fields.
    // const searchQuery = searchString
    //   ? {
    //       OR: [
    //         {
    //           username: {
    //             contains: searchString,
    //             mode: 'insensitive',
    //           },
    //         },
    //         {
    //           name: {
    //             contains: searchString,
    //             mode: 'insensitive',
    //           },
    //         },
    //       ],
    //     }
    //   : {};

    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              contains: searchString,
              mode: 'insensitive',
            },
          },
          {
            name: {
              contains: searchString,
              mode: 'insensitive',
            },
          },
        ],
        NOT: {
          userId,
        },
      },
      // Order the users by the date they were created in descending order.
      orderBy: {
        createdAt: sortBy,
      },
      // Skip the first X users.
      skip: skipAmount,
      // Only take X users.
      take: pageSize,
    });

    // Count the total number of users that match the search criteria (without pagination).
    const totalUsersCount = await prisma.user.count({
      where: {
        OR: [
          {
            username: {
              contains: searchString,
              mode: 'insensitive',
            },
          },
          {
            name: {
              contains: searchString,
              mode: 'insensitive',
            },
          },
        ],
        NOT: {
          userId,
        },
      },
    });

    // Check if there are more users beyond the current page.
    const hasNext = totalUsersCount > skipAmount + users.length;

    return {
      users,
      hasNext,
      totalUsersCount,
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
}

export async function getActivity(userId: string) {
  try {
    // Find all threads created by the user
    const userThreads = await prisma.thread.findMany({
      where: {
        authorId: userId,
      },
      include: {
        children: true,
      },
    });

    // Collect all the child thread ids (replies) from the 'children' field of each user thread
    const childThreadIds = userThreads.reduce((acc, thread) => {
      return [...acc, ...thread.children.map((child) => child.id)];
    }, [] as string[]);

    // console.log('############### userThreadIds: ', childThreadIds);

    // Find and return the child threads (replies) excluding the ones created by the same user
    const replies = await prisma.thread.findMany({
      where: {
        id: {
          in: childThreadIds,
        },
        authorId: {
          not: userId,
        },
      },
      include: {
        author: true,
      },
    });

    return replies;
  } catch (error: any) {
    throw new Error(`Failed to fetch user activity: ${error.message}`);
  }
}
