import React from 'react';
import { OrnamentDivider } from '../animation/OrnamentDivider';

interface SectionHeadingProps {
  id: string;
  title: string;
  subtitle?: string;
}

export function SectionHeading({ id, title, subtitle }: SectionHeadingProps) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 id={id} className="font-serif text-[2.6rem] font-medium leading-tight text-brown outline-none md:text-6xl">
        {title}
      </h2>
      <OrnamentDivider className="mt-4" />
      {subtitle && <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-brown-soft md:text-lg">{subtitle}</p>}
    </div>);

}