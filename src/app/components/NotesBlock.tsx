import React from 'react';
import { getNotesPosts } from '@/app/notes/utils';
import NoteCard from './NoteCard';
import { pluralize } from '@/utils/texts';

interface NotesBlockProps {
  count?: number;
}

const NotesBlock: React.FC<NotesBlockProps> = ({ count = 3 }) => (
  <>
    {getNotesPosts().length > 0 && (
      <div className="mb-16">
        <div className="font-bold text-3xl mb-6">Заметки</div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
          {getNotesPosts()
            .slice(0, count)
            .map((post) => (
              <NoteCard key={post.slug} post={post} />
            ))}
        </div>

        {getNotesPosts().length > 3 && (
          <div className="mt-2">
            <a href="/notes" className="underlined">
              Показать все {getNotesPosts().length}{' '}
              {pluralize(getNotesPosts().length, [
                'заметка',
                'заметки',
                'заметок',
              ])}
            </a>
          </div>
        )}
      </div>
    )}
  </>
);

export default NotesBlock;
