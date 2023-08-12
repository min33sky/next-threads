'use server';

import { prisma } from '../db';

/**
 * TODO:
 * [v] 커뮤니티 생성 성공
 * [v] 커뮤니티 삭제 성공
 * [] 해당 커뮤니티에 글 등록 성공
 *
 */

export async function createCommunity(
  id: string, // clerk id
  name: string,
  username: string,
  image: string,
  bio: string,
  createdById: string, // Change the parameter name to reflect it's an id
) {
  try {
    // Find the user with the provided unique id
    const user = await prisma.user.findUnique({
      where: { userId: createdById },
    });

    if (!user) throw new Error('User not found'); // Handle the case if the user with the id is not found

    const newCommunity = await prisma.community.create({
      data: {
        communityId: id, // clerk id
        name,
        username,
        image,
        bio,
        ownerId: user.id, // mongodb id
      },
    });

    return newCommunity;
  } catch (error: any) {
    throw new Error(`Failed to create community: ${error.message}`);
  }
}

export async function fetchCommunityDetails(id: string) {
  try {
    const communityDetails = await prisma.community.findUnique({
      where: { communityId: id },
      include: {
        members: true,
      },
    });

    return communityDetails;
  } catch (error: any) {
    throw new Error(`Failed to fetch community details: ${error.message}`);
  }
}

export async function fetchCommunityPosts(id: string) {
  try {
    const communityPosts = await prisma.community.findUnique({
      where: { communityId: id },
      include: {
        threads: {
          include: {
            author: true,
            children: {
              include: {
                author: true,
              },
            },
          },
        },
      },
    });

    return communityPosts;
  } catch (error: any) {
    throw new Error(`Failed to fetch community posts: ${error.message}`);
  }
}

export async function fetchCommunities({
  searchString = '',
  pageNumber = 1,
  pageSize = 20,
  sortBy = 'desc',
}: {
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: 'asc' | 'desc';
}) {
  try {
    // Calculate the number of communities to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Find all communities that match the search string
    const communities = await prisma.community.findMany({
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
      },
      include: {
        members: true,
      },
      skip: skipAmount,
      take: pageSize,
      orderBy: {
        createdAt: sortBy,
      },
    });

    // Count the total number of communities that match the search criteria (without pagination).
    const totalCommunitiesCount = await prisma.community.count({
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
      },
    });

    // Check if there are more communities beyond the current page.
    const hasMore = totalCommunitiesCount > skipAmount + communities.length;

    return { communities, hasMore, totalCommunitiesCount };
  } catch (error: any) {
    throw new Error(`Failed to fetch communities: ${error.message}`);
  }
}

export async function addMemberToCommunity(
  communityId: string,
  memberId: string,
) {
  try {
    // Find the community by its unique id
    const community = await prisma.community.findUnique({
      where: { communityId },
    });

    if (!community) throw new Error('Community not found');

    // Find the user by thier unique id
    const user = await prisma.user.findUnique({
      where: { userId: memberId },
    });

    if (!user) throw new Error('User not found');

    // Check if the user is already a member of the community
    if (community.memberIds.includes(user.id))
      throw new Error('User is already a member of the community');

    // Add the user's id to the members array in the community
    await prisma.community.update({
      where: { communityId },
      data: {
        memberIds: {
          push: user.id,
        },
      },
    });

    return community;
  } catch (error: any) {
    throw new Error(`Failed to add member to community: ${error.message}`);
  }
}

export async function removeUserFromCommunity(
  userId: string,
  communityId: string,
) {
  try {
    const user = await prisma.user.findUnique({
      where: { userId },
    });

    if (!user) throw new Error('User not found');

    const community = await prisma.community.findUnique({
      where: { communityId },
    });

    if (!community) throw new Error('Community not found');

    // Remove the user's id from the members array in the community
    await prisma.community.update({
      where: { communityId },
      data: {
        memberIds: {
          set: community.memberIds.filter((id) => id !== user.id),
        },
      },
    });

    return community;
  } catch (error: any) {
    throw new Error(`Failed to remove user from community: ${error.message}`);
  }
}

export async function updateCommunityInfo(
  communityId: string,
  name: string,
  username: string,
  image: string,
) {
  try {
    // Find the coummnity by its id and update the information
    const existingCommunity = await prisma.community.findUnique({
      where: { communityId },
    });

    if (!existingCommunity) throw new Error('Community not found');

    const updatedCommunity = await prisma.community.update({
      where: { communityId },
      data: {
        name,
        username,
        image,
      },
    });

    return updatedCommunity;
  } catch (error: any) {
    throw new Error(`Failed to update community info: ${error.message}`);
  }
}

export async function deleteCommunity(communityId: string) {
  try {
    // Find the community by its id and delete it
    const deletedCommunity = await prisma.community.delete({
      where: { communityId },
    });

    if (!deletedCommunity) throw new Error('Community not found');

    // Delete all threads associated with the community
    await prisma.thread.deleteMany({
      where: { communityId },
    });

    // Find all users who are part of the community

    // Remove the community from the 'communities' array for each user
    const users = await prisma.user.findMany({
      where: {
        communities: {
          some: {
            communityId,
          },
        },
      },
      include: {
        communities: true,
      },
    });

    await Promise.all(
      users.map(async (user) => {
        await prisma.user.update({
          where: { userId: user.userId },
          data: {
            communityIds: {
              set: user.communities
                .filter((community) => community.communityId !== communityId)
                .map((community) => community.communityId),
            },
          },
        });
      }),
    );
  } catch (error: any) {
    throw new Error(`Failed to delete community: ${error.message}`);
  }
}
