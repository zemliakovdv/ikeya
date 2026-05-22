// app/help/[slug]/page.js

import { notFound } from 'next/navigation';
import HelpLayout from '@/components/help/HelpLayout';
import { getLegalPageBySlug } from '@/lib/api/content';

export async function generateMetadata({ params }) {
  const page = await getLegalPageBySlug(params.slug);
  if (!page) return {};

  return {
    title: page.attributes.title,
  };
}

export default async function LegalPage({ params }) {
  const page = await getLegalPageBySlug(params.slug);

  if (!page) notFound();

  const { title, body } = page.attributes;

  return (
    <HelpLayout breadcrumbs={[{ name: title, href: `/help/${params.slug}` }]}>
      <div className="help-content__inner help-article">
        <h1>{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: body }} />
      </div>
    </HelpLayout>
  );
}