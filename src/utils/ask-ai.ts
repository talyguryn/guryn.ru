import axios from 'axios';

type askAiProps = {
  systemMessage: string;
  userMessage: string;
  model?: string;
  responseFormat?: { type: string };
};

export async function askAi({
  systemMessage,
  userMessage,
  model,
  responseFormat,
}: askAiProps): Promise<string> {
  const messages = [
    { content: systemMessage, role: 'system' },
    { content: userMessage, role: 'user' },
  ];

  try {
    const gptResponse = await axios.post('/api/chatgpt', {
      messages,
      model,
      responseFormat,
    });

    return gptResponse.data.response;
  } catch (error) {
    throw new Error(`Ask AI error: ${error}`);
  }
}
