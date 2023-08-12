import ThreadCard from '@/components/card/ThreadCard';
import Comment from '@/components/form/Comment';
import { fetchThreadById } from '@/lib/actions/thread.action';
import { fetchUser } from '@/lib/actions/user.action';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

export const revalidate = 0;

interface Props {
  params: {
    id: string;
  };
}

export default async function ThreadDetailPage({ params: { id } }: Props) {
  if (!id) return null;

  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) return redirect('/onboarding');

  const thread = await fetchThreadById(id);

  // console.log('thread: ', thread);

  if (!thread) return null;

  return (
    <section className="relative">
      <div>
        <ThreadCard
          id={thread?.id}
          currentUserId={user.id}
          parentId={thread.parentThreadId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      </div>

      <div className="mt-7">
        <Comment
          threadId={id}
          currentUserId={userInfo.id}
          currentUserImg={userInfo.image}
        />
      </div>

      <div className="mt-10 space-y-8">
        {thread.children.map((childItem, idx) => (
          <ThreadCard
            key={childItem.id}
            id={childItem.id}
            currentUserId={user.id}
            parentId={childItem.parentThreadId}
            content={childItem.text}
            author={childItem.author}
            community={childItem.community}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
}
