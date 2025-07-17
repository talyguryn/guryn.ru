import { notFound } from 'next/navigation';
import { CustomMDX } from '@/app/components/mdx';
import { formatDate, getNotesPosts } from '@/app/notes/utils';
import { baseUrl } from '@/app/sitemap';

type PageParams = {
  slug: string;
};

export async function generateStaticParams() {
  let posts = getNotesPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  let post = getNotesPosts().find((post) => post.slug === slug);
  if (!post) {
    return;
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;
  let ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/notes/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Notes({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;

  let post = getNotesPosts().find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NotesPosting',
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${baseUrl}/notes/${post.slug}`,
            author: {
              '@type': 'Person',
              name: 'Виталий Гурын',
            },
          }),
        }}
      />

      <h1 className="title font-semibold text-2xl tracking-tighter">
        {post.metadata.title}
      </h1>
      <div className="flex justify-between items-center mb-8 text-sm text-neutral-600 dark:text-neutral-400">
        {formatDate(post.metadata.publishedAt)}
      </div>
      <article className="prose">
        <CustomMDX source={post.content} />
      </article>

      <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 mt-8 flex flex-col">
        <span>
          Подпишитесь на мой Бусти, чтобы комментировать и получать уведомления
          о новых заметках.
        </span>
        <a
          className="not-underlined p-4 pb-4.5 mt-4 text-center bg-[#f15f2c] hover:bg-[#d45124] text-white rounded-lg"
          href="https://boosty.to/talyguryn"
          target="_blank"
          rel="noopener noreferrer"
        >
          Подписаться на Бусти
        </a>
      </div>
    </section>
  );
}
