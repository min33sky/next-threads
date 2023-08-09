'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

interface PostThreadProps {
  userId: string;
}

export default function PostThread({ userId }: PostThreadProps) {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm();

  return <div>PostThread</div>;
}
