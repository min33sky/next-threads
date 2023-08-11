import ProfileHeader from '@/components/shared/ProfileHeader';
import { fetchMyStatus, fetchUser } from '@/lib/actions/user.action';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

interface Props {
  params: {
    id: string;
  };
}

export default async function ProfileDetailPage({ params: { id } }: Props) {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(id);

  console.log(['#### 프로필 페이지 유저 정보: ', userInfo]);

  if (!userInfo) return null;

  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />
    </section>
  );
}
