import { fetchCommunities } from '@/lib/actions/community.actions';
import { fetchUser } from '@/lib/actions/user.action';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

interface CommunitiesPageProps {
  searchParams: {
    [key: string]: string | undefined;
  };
}

export default async function CommunitiesPage({
  searchParams,
}: CommunitiesPageProps) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) return redirect('/onboarding');

  console.log('q: ', searchParams);

  const result = await fetchCommunities({
    searchString: searchParams.q,
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 25,
  });

  console.log('!@#!@#!@# 커뮤니티 컴색 결과: ', result);

  return (
    <div>
      <h1 className="head-text">Communities</h1>

      <div className="mt-5">{/* <Searchbar routeType='communities' /> */}</div>
    </div>
  );
}
