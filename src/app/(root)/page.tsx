import ThreadCard from '@/components/card/ThreadCard';
import { fetchPosts } from '@/lib/actions/thread.action';
import { currentUser } from '@clerk/nextjs';

export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function Home() {
  const user = await currentUser();
  if (!user) return null;

  const result = await fetchPosts(1, 30);

  console.log('result: ', result);

  return (
    <main>
      <h1 className="text-white">Hello Main Page</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {result.posts.map((post) => (
              <ThreadCard
                key={post.id}
                id={post.id}
                currentUserId={user?.id}
                parentId={post.parentThreadId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>
    </main>
  );
}
