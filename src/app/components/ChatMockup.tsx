import Image from 'next/image';

export type ChatProps = {
  chatTitle?: string;
  messages: {
    role: 'user' | 'assistant';
    user?: {
      image?: string;
      name?: string;
    };
    message: {
      text: string;
      media?: string[];
      cover?: string;
      reactions?: { emoji: string; count: number }[];
    };
    date?: Date;
  }[];
  actionButtons?: {
    label: string;
    action?: () => void;
    url?: string;
    type: 'primary' | 'secondary';
  }[];
};

function formatDate(date: Date, format: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default function ChatMockup({
  chatTitle,
  messages,
  actionButtons,
}: ChatProps) {
  return (
    <div className="max-w-2xl mx-auto my-4 bg-gray-100 dark:bg-gray-900 p-4 rounded-sm">
      {/* Chat title if exists */}
      {chatTitle && (
        <div className="font-semibold mb-4 text-center text-gray-800 dark:text-gray-100">
          {chatTitle}
        </div>
      )}
      {/* Chat messages */}
      <div className="space-y-4">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={idx}
              className={`flex items-start gap-2 ${
                isUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {!isUser && msg.user?.image && (
                <Image
                  src={msg.user.image}
                  alt={msg.user.name || 'User'}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <div
                className={`max-w-xs sm:max-w-md rounded-xl px-4 py-2 shadow ${
                  isUser
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                }`}
              >
                {msg.user?.name && !isUser && (
                  <div className="text-sm font-bold mb-2">{msg.user.name}</div>
                )}

                {msg.message.media && msg.message.media.length > 0 && (
                  <div className="mt-2 flex flex-col gap-2">
                    {(() => {
                      const images = msg.message.media;
                      const proportions =
                        (msg.message as any).mediaProportions || [];

                      // Chunk media into rows of max 3 images
                      const rows: string[][] = [];
                      for (let i = 0; i < images.length; i += 3) {
                        rows.push(images.slice(i, i + 3));
                      }

                      return rows.map((row, rowIdx) => {
                        const rowHeight = 120;

                        // Calculate widths using proportions
                        const rowProportions = row.map((_, i) => {
                          const prop = proportions[rowIdx * 3 + i];
                          return prop?.width && prop?.height
                            ? prop
                            : { width: 4, height: 3 }; // fallback
                        });

                        const widths = rowProportions.map((p) =>
                          Math.round(rowHeight * (p.width / p.height))
                        );
                        const totalWidth = widths.reduce((a, b) => a + b, 0);

                        return (
                          <div key={rowIdx} className="flex gap-2">
                            {row.map((url, i) => (
                              <div
                                key={i}
                                className="relative"
                                style={{
                                  flex: `${widths[i]} ${widths[i]} 0`,
                                  maxWidth: `${widths[i]}px`,
                                  minWidth: 0,
                                }}
                              >
                                <Image
                                  src={url}
                                  alt={`Media ${rowIdx * 3 + i + 1}`}
                                  width={widths[i]}
                                  height={rowHeight}
                                  className="rounded-lg object-cover w-full"
                                  style={{
                                    height: `${rowHeight}px`,
                                  }}
                                  sizes="(max-width: 640px) 100vw, 33vw"
                                />
                              </div>
                            ))}
                          </div>
                        );
                      });
                    })()}
                  </div>
                )}

                <div className="break-words chat-message">
                  <style>{`.chat-message p {margin: 0 0 0.2em 0}`}</style>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: require('marked').marked.parse(msg.message.text),
                    }}
                  />
                </div>

                {msg.message.cover && (
                  <div className="mt-2 border rounded-sm border-gray-200">
                    <img
                      src={msg.message.cover}
                      alt="Cover"
                      width={300}
                      height={169}
                      className="rounded-lg"
                    />
                  </div>
                )}

                {msg.message.reactions && msg.message.reactions.length > 0 && (
                  <div className="flex gap-2 mt-2 text-sm">
                    {msg.message.reactions.map((reaction, i) => (
                      <div
                        key={i}
                        className="text-white bg-blue-500 dark:bg-blue-600 px-3 py-1 rounded-full flex items-center gap-1"
                      >
                        <span>{reaction.emoji}</span>
                        <span>{reaction.count}</span>
                      </div>
                    ))}
                  </div>
                )}

                {msg.date && (
                  <div className="text-xs text-gray-300 mt-1 text-right">
                    {formatDate(new Date(msg.date), 'p')}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* show buttons if actionButtons exist */}
      {actionButtons && actionButtons.length > 0 && (
        <div className="flex flex-col gap-2 mt-6">
          {actionButtons.map((button, i) => (
            <a
              key={i}
              href={button.url}
              target="_blank"
              className={`px-4 py-2 rounded-sm text-sm text-center font-medium not-underlined ${
                button.type === 'primary'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {button.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
