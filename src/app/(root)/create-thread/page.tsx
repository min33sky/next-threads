import PostThread from '@/components/form/PostThread';
import { fetchMyStatus } from '@/lib/actions/user.action';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function CreateThreadPage() {
  const user = await currentUser();

  console.log('##### user: ', user);

  if (!user) return null;

  const userInfo = await fetchMyStatus(user.id);

  console.log('로그인 유저 정보: ', userInfo);

  if (!userInfo?.onboarded) return redirect('/onboarding');

  return (
    <>
      <h1 className="text-heading2-bold text-light-1">Create Thread.</h1>;
      <PostThread userId={userInfo.id} />
    </>
  );
}
