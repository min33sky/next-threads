'use client';

import Link from 'next/link';
import { useEffect } from 'react';

/**
 * Error component.
 * https://nextjs.org/docs/app/api-reference/file-conventions/error
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="font-semibold text-sky-700 dark:text-sky-500">
          {/* There was a problem loading this page. [Error Name: {error.name}] */}
          페이지를 불러오는 중 문제가 발생했습니다.
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-200">
          {error.message || 'Something went wrong. 😕'}
        </h1>
        <p className="mt-6 leading-7 text-slate-600 dark:text-slate-100">
          {/* Please try again later or contact support if the problem persists. */}
          문제가 지속되면 나중에 다시 시도해주세요.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            onClick={reset}
            className="bg-sky-400 px-3 py-2 rounded-md hover:bg-sky-500 transition-colors"
          >
            {/* Try again */}
            다시 시도하기
          </button>
          <Link
            href={'/'}
            className="border border-sky-500 px-3 py-2 rounded-md transition-colors hover:bg-sky-50 hover:text-sky-700"
          >
            {/* Go back to main page */}
            메인 페이지로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}
