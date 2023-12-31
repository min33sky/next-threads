import { ClerkProvider } from '@clerk/nextjs';
import '../globals.css';
import type { Metadata } from 'next';
import Topbar from '@/components/shared/Topbar';
import LeftSidebar from '@/components/shared/LeftSidebar';
import Bottombar from '@/components/shared/Bottombar';
import RightSidebar from '@/components/shared/RightSidebar';

export const metadata: Metadata = {
  title: 'Threads',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="ko">
        <body className="antialiased">
          <Topbar />

          <main className="flex flex-row">
            <LeftSidebar />
            <section
              className="flex flex-col min-h-screen flex-1 items-center bg-dark-1
                    px-6 pb-10 pt-28 max-md:pb-32 sm:px-10"
            >
              <div className="w-full max-w-4xl">{children}</div>
            </section>
            <RightSidebar />
          </main>

          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  );
}
