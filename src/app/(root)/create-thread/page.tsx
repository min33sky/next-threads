import PostThread from '@/components/form/PostThread';
import { fetchUser } from '@/lib/actions/user.action';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function CreateThreadPage() {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) return redirect('/onboarding');

  return (
    <>
      <h1 className="text-heading2-bold text-light-1">Create Thread.</h1>;
      <PostThread userId={userInfo.id} />
    </>
  );
}
