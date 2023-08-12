'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../db';

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  try {
    // Calculate the number of posts to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a query to fetch the posts that have no parent (top-level threads) (a thread that is not a comment/reply).
    const posts = await prisma.thread.findMany({
      where: {
        parentThread: null,
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
        parentThread: null,
      },
    });

    const hasNext = totalPostsCount > skipAmount + posts.length;

    console.log('아 시발 진짜: ', posts);

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
    if (communityId) {
      const existingCommunity = await prisma.community.findUnique({
        where: {
          communityId,
        },
      });

      if (!existingCommunity) {
        throw new Error('Community does not exist.');
      }

      await prisma.thread.create({
        data: {
          text,
          authorId: author,
          communityId: existingCommunity.id,
        },
      });
    } else {
      await prisma.thread.create({
        data: {
          text,
          authorId: author,
        },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }
}

export async function fetchThreadById(threadId: string) {
  try {
    const thread = await prisma.thread.findUnique({
      where: {
        id: threadId,
      },
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
                    id: true,
                    userId: true,
                    name: true,
                    image: true,
                  },
                },
                parentThreadId: true,
              },
            },
          },
        },
      },
    });

    return thread;
  } catch (error: any) {
    throw new Error(`Failed to fetch thread: ${error.message}`);
  }
}

interface AddCommentToThreadParams {
  threadId: string;
  commentText: string;
  userId: string;
  path: string;
}

export async function addCommentToThread({
  commentText,
  path,
  threadId,
  userId,
}: AddCommentToThreadParams) {
  try {
    // Find the original thread by its ID.
    const originalThread = await prisma.thread.findUnique({
      where: {
        id: threadId,
      },
    });

    if (!originalThread) {
      throw new Error('Thread not found');
    }

    // Create the new commnet thread.
    await prisma.thread.create({
      data: {
        text: commentText,
        authorId: userId,
        parentThreadId: threadId, // Set the parentId to the original thread's ID.
      },
    });

    revalidatePath(path);
  } catch (error: any) {}
}
