import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const channel = req.query.channel as string;

  if (!channel) {
    return res.status(400).json({ error: 'Missing channel parameter' });
  }

  try {
    const url = `https://t.me/${channel}`;
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36',
      },
    });

    const $ = cheerio.load(html);

    // Basic metadata
    const title = $('.tgme_page_title span').text().trim() || null;

    // Preserve line breaks in description
    let descriptionHtml = $('.tgme_page_description').html() || '';
    const description = descriptionHtml
      .replace(/<br\s*\/?>/gi, '\n') // convert <br> to newline
      .replace(/<\/?[^>]+>/g, '') // strip remaining HTML tags
      .trim();

    const image =
      $('.tgme_page_photo_image').attr('src') ||
      $('meta[property="og:image"]').attr('content') ||
      null;

    // Subscribers or members
    const extraText = $('.tgme_page_extra').text().trim();
    const match = extraText.match(/([\d\s]+)\s+(subscribers|members)/i);
    const subscribers = match
      ? parseInt(match[1].replace(/\s+/g, ''), 10)
      : null;

    const updatedAt = new Date().toISOString();

    // Construct response
    const result = {
      uri: channel,
      link: url,
      title,
      description: description || null,
      image,
      updatedAt,
    };

    if (subscribers !== null) {
      (result as any).subscribers = subscribers;
    }

    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({
      channel,
      error: err.message || 'Failed to fetch Telegram channel data',
    });
  }
}
