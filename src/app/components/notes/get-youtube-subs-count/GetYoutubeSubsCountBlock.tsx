'use client';

import { LoaderCircle } from 'lucide-react';
import React from 'react';

type YoutubeApiResponse = {
  subscribers?: number | null;
  subscribersText?: string | null;
  title?: string | null;
  description?: string | null;
  link?: string | null;
  image?: string | null;
  videosText?: string | null;
  viewsText?: string | null;
  joinedAt?: string | null;
  error?: string;
};

const GetYoutubeSubsCountBlock = () => {
  const [channel, setChannel] = React.useState('@talyguryn');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<YoutubeApiResponse | null>(null);

  const fetchSubsCount = async () => {
    setLoading(true);
    setError(null);

    try {
      const query = encodeURIComponent(channel.trim());
      const res = await fetch(`/api/get-youtube-subscribers-count?channel=${query}`);
      const jsonData: YoutubeApiResponse = await res.json();

      if (!res.ok) {
        setData(null);
        setError(jsonData.error || 'Error fetching data');
        return;
      }

      setData(jsonData);
    } catch {
      setData(null);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const subscribers =
    data?.subscribers != null
      ? Number(data.subscribers).toLocaleString('ru-RU')
      : data?.subscribersText || '—';

  return (
    <div className="flex flex-col gap-3 mt-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
      <div>
        <input
          type="text"
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          placeholder="@talyguryn или https://www.youtube.com/@talyguryn"
          className="w-full rounded mr-2"
        />
      </div>

      {loading && (
        <div>
          <LoaderCircle className="animate-spin" size={48} strokeWidth={2.5} />
        </div>
      )}

      {!loading && data && (
        <div className="flex flex-col gap-3">
          <div className="text-4xl font-bold">{subscribers}</div>

          {data.title && <div className="text-lg font-semibold">{data.title}</div>}

          {data.image && (
            <img
              src={data.image}
              alt={data.title || 'YouTube channel avatar'}
              className="w-20 h-20 rounded-full object-cover"
            />
          )}

          {data.description && <div className="text-sm opacity-80">{data.description}</div>}

          <div className="text-sm opacity-80">
            {data.videosText && <div>Видео: {data.videosText}</div>}
            {data.viewsText && <div>Просмотры: {data.viewsText}</div>}
            {data.joinedAt && <div>Регистрация: {data.joinedAt}</div>}
          </div>

          {data.link && (
            <a href={data.link} target="_blank" rel="noopener noreferrer" className="underline text-blue-600 dark:text-blue-300">
              Открыть канал
            </a>
          )}
        </div>
      )}

      {error && <div style={{ marginTop: '8px', color: 'red' }}>{error}</div>}

      <button
        onClick={fetchSubsCount}
        className="rounded bg-blue-200 text-blue-900 cursor-pointer mt-2 px-4 py-2 hover:bg-blue-300 hover:text-blue-950 dark:bg-blue-700 dark:text-blue-100 hover:dark:bg-blue-800 hover:dark:text-blue-100"
      >
        {data ? 'Обновить' : 'Показать'} данные канала
      </button>
    </div>
  );
};

export default GetYoutubeSubsCountBlock;