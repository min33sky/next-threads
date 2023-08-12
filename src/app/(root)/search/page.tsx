import UserCard from '@/components/card/UserCard';
import { fetchUser, fetchUsers } from '@/lib/actions/user.action';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

interface SearchPageProps {
  searchParams: {
    [key: string]: string | undefined;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) return redirect('/onboarding');

  const result = await fetchUsers({
    userId: user.id,
    searchString: 'typeme', // ! 테ㅔㅔㅔㅔㅔㅔㅔㅔㅔㅔㅔㅔㅔㅔ스트용
    pageNumber: 1,
    pageSize: 25,
  });

  console.log('!@#!@#!@# 검색 결과: ', result);

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      {/* SearchBar */}

      <div className="mt-14 flex flex-col gap-9">
        {result.users.length === 0 ? (
          <p className="no-result">No Result</p>
        ) : (
          <>
            {result.users.map((person) => (
              <UserCard
                key={person.id}
                id={person.id}
                name={person.name}
                username={person.username}
                imgUrl={person.image}
                personType="User"
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
}
