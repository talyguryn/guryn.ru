import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  if (!process.env.AI_API_KEY || !process.env.AI_API_ENDPOINT) {
    return res.status(500).json({ error: 'Missing API key or endpoint' });
  }

  const { messages, model, responseFormat } = req.body;

  console.log('[GPT] Messages:', messages);

  try {
    const response = await axios.post(
      process.env.AI_API_ENDPOINT,
      {
        model: model || process.env.AI_API_DEFAULT_MODEL,
        messages: messages,
        response_format: responseFormat || undefined,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
        },
      }
    );

    const gptResponse = response.data.choices[0].message.content.trim();
    console.log('[GPT] Response:', gptResponse);

    return res.status(200).json({ response: gptResponse });
  } catch (error) {
    console.error('Error calling AI API:', error);

    return res.status(500).json({ error: 'Error calling AI API' });
  }
}
