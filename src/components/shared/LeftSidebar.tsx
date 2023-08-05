import { sidebarLinks } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function LeftSidebar() {
  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex flex-col w-full flex-1 gap-6 px-6">
        {sidebarLinks.map((link) => (
          <Link href={link.route} key={link.label} className="leftsidebar_link">
            <Image src={link.imgURL} alt={link.label} width={24} height={24} />
            <p className="text-light-1 max-lg:hidden">{link.label}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
