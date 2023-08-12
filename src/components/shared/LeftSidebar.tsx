'use client';

import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';
import { SignOutButton, SignedIn, useAuth } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function LeftSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const { userId } = useAuth();

  return (
    <section
      className="custom-scrollbar sticky left-0 top-0 z-20 flex h-screen w-fit flex-col
              justify-between overflow-auto border-r border-r-dark-4 bg-dark-2
              pb-5 pt-28 max-md:hidden"
    >
      <div className="flex flex-col w-full flex-1 gap-6 px-6">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          // TODO: MongoID를 받아야함
          if (link.route === '/profile') link.route = `${link.route}/${userId}`;

          return (
            <Link
              href={link.route}
              key={link.label}
              className={cn(
                'relative flex justify-start gap-4 rounded-lg p-4',
                isActive && 'bg-primary-500',
              )}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className="text-light-1 max-lg:hidden">{link.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 px-6">
        <SignedIn>
          <SignOutButton signOutCallback={() => router.push('/sign-in')}>
            <div className="flex cursor-pointer gap-4 p-4">
              <Image
                src="/assets/logout.svg"
                alt="logout"
                width={24}
                height={24}
              />

              <p className="text-light-2 max-lg:hidden">Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
}
