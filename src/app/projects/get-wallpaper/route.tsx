import { ImageResponse } from 'next/og';
import { getHost } from '@/utils/host';

type YoutubeApiResult = {
  image: string | null;
  title: string | null;
  subscribers: string | null;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const channel = url.searchParams.get('channel') || '@talyguryn';

  let data: YoutubeApiResult = {
    image: null,
    title: null,
    subscribers: null,
  };

  try {
    const host = getHost();
    const apiUrl = `${host}/api/get-youtube-subscribers-count?channel=${encodeURIComponent(channel)}`;

    console.log('Fetching YouTube data from API:', apiUrl);

    const response = await fetch(apiUrl);
    if (response.ok) {
      const result = await response.json();
      data = {
        image: result.image || null,
        title: result.title || null,
        subscribers: result.subscribers || null,
      };
    }
  } catch (error) {
    console.error('Failed to fetch YouTube data:', error);
  }

  return new ImageResponse(
    (
      <div tw="flex flex-col w-full h-full bg-[#FF0000] justify-center items-center p-8 relative">


        {data.subscribers && (
          <div tw="flex flex-col text-white text-center mb-6">
            <span tw="text-[260px] font-[900] tracking-tight">
              {data.subscribers}
            </span>
          </div>
        )}

        <div tw='flex items-center gap-4'>

          {data.image && (
            <img
              src={data.image}
              alt="Channel Avatar"
              tw="w-20 h-20 rounded-full object-cover m-6"
            />
          )}

          {data.title && (
            <div tw="flex flex-col text-white text-center">
              <span tw="text-5xl font-bold tracking-tight">
                {data.title}
              </span>
            </div>
          )}
        </div>

      </div>
    ),
    {
      width: 1125,
      height: 2436,
    }
  );
}
