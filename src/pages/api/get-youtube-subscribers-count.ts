import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type UnknownRecord = Record<string, unknown>;

type YoutubeApiResult = {
  uri: string;
  link: string | null;
  title: string | null;
  description: string | null;
  image: string | null;
  updatedAt: string;
  subscribers: number | null;
  subscribersText: string | null;
  videos: number | null;
  videosText: string | null;
  views: number | null;
  viewsText: string | null;
  joinedAt: string | null;
};

function normalizeChannelInput(channel: string): {
  path: string;
  input: string;
} {
  const input = channel.trim();

  if (/^https?:\/\//i.test(input)) {
    try {
      const parsed = new URL(input);
      const pieces = parsed.pathname.split('/').filter(Boolean);

      if (pieces.length > 0) {
        if (pieces[0].startsWith('@')) {
          return { path: pieces[0], input };
        }
        if (pieces[0] === 'channel' && pieces[1]) {
          return { path: `channel/${pieces[1]}`, input };
        }
        if (pieces[0] === 'c' && pieces[1]) {
          return { path: `c/${pieces[1]}`, input };
        }
        if (pieces[0] === 'user' && pieces[1]) {
          return { path: `user/${pieces[1]}`, input };
        }
      }
    } catch {
      // Fall through to plain input parsing.
    }
  }

  if (input.startsWith('@')) {
    return { path: input, input };
  }

  if (input.startsWith('UC')) {
    return { path: `channel/${input}`, input };
  }

  return { path: `@${input}`, input };
}

function extractInitialData(html: string): UnknownRecord | null {
  const match = html.match(/var ytInitialData\s*=\s*(\{[\s\S]*?\});<\/script>/);
  if (!match?.[1]) {
    return null;
  }

  try {
    return JSON.parse(match[1]) as UnknownRecord;
  } catch {
    return null;
  }
}

function findObjectByKey(root: unknown, key: string): UnknownRecord | null {
  const queue: unknown[] = [root];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || typeof current !== 'object') {
      continue;
    }

    const record = current as UnknownRecord;
    if (key in record && record[key] && typeof record[key] === 'object') {
      return record[key] as UnknownRecord;
    }

    if (Array.isArray(current)) {
      queue.push(...current);
    } else {
      queue.push(...Object.values(record));
    }
  }

  return null;
}

function getString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : null;
}

function getJoinedDate(value: unknown): string | null {
  if (typeof value === 'string') {
    return value.trim() || null;
  }

  if (value && typeof value === 'object') {
    const content = (value as UnknownRecord).content;
    return getString(content);
  }

  return null;
}

function parseCount(text: string | null): number | null {
  if (!text) {
    return null;
  }

  const normalized = text.replace(/,/g, '').replace(/\s+/g, ' ').trim();
  const match = normalized.match(/([\d.]+)\s*([KMB])?/i);

  if (!match?.[1]) {
    return null;
  }

  const base = Number.parseFloat(match[1]);
  if (!Number.isFinite(base)) {
    return null;
  }

  const suffix = (match[2] || '').toUpperCase();
  const multipliers: Record<string, number> = {
    K: 1_000,
    M: 1_000_000,
    B: 1_000_000_000,
  };

  return Math.round(base * (multipliers[suffix] || 1));
}

function pickAvatarUrl(
  metadata: UnknownRecord | null,
  initialData: UnknownRecord
): string | null {
  const metadataAvatar = metadata?.avatar as UnknownRecord | undefined;
  const thumbnails = metadataAvatar?.thumbnails as unknown[] | undefined;

  if (Array.isArray(thumbnails) && thumbnails.length > 0) {
    const last = thumbnails[thumbnails.length - 1] as UnknownRecord;
    return getString(last.url);
  }

  const microformat = findObjectByKey(initialData, 'microformatDataRenderer');
  const thumb = microformat?.thumbnail as UnknownRecord | undefined;
  const microThumbnails = thumb?.thumbnails as unknown[] | undefined;
  if (Array.isArray(microThumbnails) && microThumbnails.length > 0) {
    const first = microThumbnails[0] as UnknownRecord;
    return getString(first.url);
  }

  return null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<YoutubeApiResult | { error: string; channel?: string }>
) {
  const channel = req.query.channel as string;

  if (!channel) {
    return res.status(400).json({ error: 'Missing channel parameter' });
  }

  try {
    const normalized = normalizeChannelInput(channel);
    const url = `https://www.youtube.com/${normalized.path}/about?hl=en`;

    const { data: html } = await axios.get<string>(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 15_000,
    });

    const initialData = extractInitialData(html);
    if (!initialData) {
      return res.status(502).json({
        channel: normalized.input,
        error: 'Failed to parse YouTube initial data',
      });
    }

    const about = findObjectByKey(initialData, 'aboutChannelViewModel');
    const metadata = findObjectByKey(initialData, 'channelMetadataRenderer');

    const title = getString(metadata?.title) || null;
    const description =
      getString(about?.description) || getString(metadata?.description) || null;
    const link =
      getString(about?.canonicalChannelUrl) ||
      getString(metadata?.channelUrl) ||
      `https://www.youtube.com/${normalized.path}`;
    const image = pickAvatarUrl(metadata, initialData);

    const subscribersText = getString(about?.subscriberCountText);
    const videosText = getString(about?.videoCountText);
    const viewsText = getString(about?.viewCountText);
    const joinedAt = getJoinedDate(about?.joinedDateText);

    const result: YoutubeApiResult = {
      uri: normalized.input,
      link,
      title,
      description,
      image,
      updatedAt: new Date().toISOString(),
      subscribers: parseCount(subscribersText),
      subscribersText,
      videos: parseCount(videosText),
      videosText,
      views: parseCount(viewsText),
      viewsText,
      joinedAt,
    };

    return res.status(200).json(result);
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : 'Failed to fetch YouTube channel data';

    return res.status(500).json({
      channel,
      error: errorMessage,
    });
  }
}
