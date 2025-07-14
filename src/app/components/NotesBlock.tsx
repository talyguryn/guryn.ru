import React from 'react';
import { getNotesPosts } from '@/app/notes/utils';

const NotesBlock: React.FC<{}> = ({}) => (
  <>
    {getNotesPosts().length > 0 && (
      <div className="mb-16">
        <div className="font-bold text-3xl mb-6">Заметки</div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {getNotesPosts().map((post) => (
            <a
              className="block no-underline! hover:underline!"
              href={`/notes/${post.slug}`}
              key={post.slug}
            >
              <div>
                <div className="font-bold text-xl mb-1.5">
                  {post.metadata.title}
                </div>
                <div>{post.metadata.summary}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    )}
  </>
);

export default NotesBlock;
