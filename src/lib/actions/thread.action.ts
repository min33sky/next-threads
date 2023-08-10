'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../db';
import { skip } from 'node:test';

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  try {
    // Calculate the number of posts to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a query to fetch the posts that have no parent (top-level threads) (a thread that is not a comment/reply).
    const posts = await prisma.thread.findMany({
      where: {
        parentThreadId: undefined,
      },
      // Include the author of the post in the query.
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
          select: {
            author: {
              select: {
                image: true,
              },
            },
          },
        },
      },
      // Order the posts by the date they were created in descending order.
      orderBy: {
        createdAt: 'desc',
      },
      // Skip the first X posts.
      skip: skipAmount,
      // Only fetch the first X posts.
      take: pageSize,
    });

    // Count the total number of top-level posts (threads) i.e., threads that are not comments.
    const totalPostsCount = await prisma.thread.count({
      where: {
        parentThreadId: undefined,
      },
    });

    const hasNext = totalPostsCount > skipAmount + posts.length;

    return {
      posts,
      totalPostsCount,
      hasNext,
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch posts: ${error.message}`);
  }
}

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
