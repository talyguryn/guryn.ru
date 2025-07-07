import { ImageResponse } from 'next/og';

export function GET(request: Request) {
  let url = new URL(request.url);
  let title = url.searchParams.get('title') || '';

  return new ImageResponse(
    (
      <div tw="flex flex-col w-full h-full bg-white">
        <div tw="flex flex-col w-full h-full py-12 p-8 px-12 justify-between">
          <span tw="flex flex-col text-5xl font-bold tracking-tight text-left">
            {title}
          </span>

          <span>
            <span tw="text-2xl font-semibold tracking-tight text-left">
              guryn.ru
            </span>
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
