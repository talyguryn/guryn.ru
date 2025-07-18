import { ImageResponse } from 'next/og';
import { getHost } from '@/utils/host';

export async function GET(request: Request) {
  let url = new URL(request.url);
  let title = url.searchParams.get('title') || '';

  return new ImageResponse(
    (
      <div tw="flex flex-col w-full h-full bg-white py-4 px-8 justify-center relative">
        <span tw="flex items-center mt-8 absolute left-8 top-0">
          <img
            src={`${getHost()}/ava.png`}
            alt="Logo"
            tw="w-12 h-12 mr-4 inline-block rounded-full object-cover"
          />
          {/* <span tw="text-[24px] tracking-tight text-left">Виталий Гурын</span> */}
        </span>
        <span tw="flex flex-col text-[84px] tracking-tight leading-1.2 text-left">
          {title}
        </span>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
