import { fetchUserPosts } from '@/lib/actions/user.action';
import { redirect } from 'next/navigation';
import React from 'react';
import ThreadCard from '../card/ThreadCard';

interface Result {
  name: string;
  image: string;
  id: string;
  threads: {
    _id: string;
    text: string;
    parentId: string | null;
    author: {
      name: string;
      image: string;
      id: string;
    };
    // community: {
    //   id: string;
    //   name: string;
    //   image: string;
    // } | null;
    createdAt: string;
    children: {
      author: {
        image: string;
      };
    }[];
  }[];
}

interface Props {
  currentUserId: string; // clerk id
  accountId: string; // db id
  accountType: string;
}

export default async function ThreadsTab({
  currentUserId,
  accountId,
  accountType,
}: Props) {
  let result = await fetchUserPosts(accountId);

  if (!result) return redirect('/)');

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.threads.map((thread) => (
        <ThreadCard
          key={thread.id}
          id={thread.id}
          currentUserId={currentUserId}
          parentId={thread.parentThreadId}
          content={thread.text}
          author={thread.author} // TODO
          community={thread.community} // TODO
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      ))}
    </section>
  );
}
