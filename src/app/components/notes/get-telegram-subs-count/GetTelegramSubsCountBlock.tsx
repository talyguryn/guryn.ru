'use client';

import { LoaderCircle } from 'lucide-react';
import React from 'react';

const GetTelegramSubsCountBlock = () => {
  const [channel, setChannel] = React.useState('solar_activity_alerts');
  const [result, setResult] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<any>(null);

  const fetchSubsCount = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/get-telegram-subscribers-count?channel=${channel}`
      );
      const jsonData = await res.json();
      setData(jsonData);
      if (res.ok) {
        if (!jsonData.subscribers) {
          setResult('🙁');
          setLoading(false);
          return;
        }

        setResult(
          jsonData.subscribers !== undefined
            ? Number(jsonData.subscribers).toLocaleString('ru-RU')
            : '0'
        );
      } else {
        setError(jsonData.error || 'Error fetching data');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-2 p-4 rounded-lg bg-gray-50">
      <div>
        <span className="text-gray-400">t.me/</span>
        <input
          type="text"
          value={channel}
          placeholder=""
          onChange={(e) => setChannel(e.target.value)}
          className="inline-block rounded mr-2"
        />
      </div>
      {loading && (
        <div>
          <LoaderCircle className="animate-spin" size={48} strokeWidth={2.5} />
        </div>
      )}
      {result && !loading && (
        <div className="text-5xl font-bold ">{result}</div>
      )}
      {error && <div style={{ marginTop: '16px', color: 'red' }}>{error}</div>}
      {/* <pre>{data && JSON.stringify(data, null, 2)}</pre> */}
      <button
        onClick={fetchSubsCount}
        className="rounded bg-blue-200 text-blue-900 cursor-pointer mt-4 px-4 py-2 hover:bg-blue-300 hover:text-blue-950"
      >
        {result ? 'Обновить' : 'Показать'} количество подписчиков
      </button>
    </div>
  );
};

export default GetTelegramSubsCountBlock;
