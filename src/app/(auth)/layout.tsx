import '../globals.css';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata = {
  title: 'Threads.',
  description: 'A Next.JS 13 Meta Threads Application',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="ko">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
