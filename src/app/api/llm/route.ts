import { NextRequest, NextResponse } from 'next/server'

type Role = 'user' | 'assistant' | 'system'

type ChatMessage = {
  role: Role
  content: string
}

type LLMRequestBody =
  | {
      type: 'models'
      baseUrl: string
      apiKey?: string
      model?: string
    }
  | {
      type: 'chat'
      baseUrl: string
      apiKey?: string
      model: string
      messages: ChatMessage[]
      stream?: boolean
    }

const normalizeBaseUrl = (url: string) => url.trim().replace(/\/+$/, '')

const removeV1Suffix = (url: string) => url.replace(/\/v1$/, '')

const buildHeaders = (apiKey?: string) => ({
  'Content-Type': 'application/json',
  ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
})

async function handleModels(baseUrl: string, apiKey?: string, model?: string) {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl)
  const ollamaBase = removeV1Suffix(normalizedBaseUrl)

  try {
    const ollamaRes = await fetch(`${ollamaBase}/api/tags`, {
      method: 'GET',
      headers: buildHeaders(apiKey),
      cache: 'no-store',
    })

    if (ollamaRes.ok) {
      const data = await ollamaRes.json()
      if (data?.models && Array.isArray(data.models)) {
        const models = data.models
          .map((entry: { name?: string }) => entry?.name)
          .filter((name: string | undefined): name is string => Boolean(name))

        return NextResponse.json({
          source: 'ollama',
          models,
          modelExists: model ? models.includes(model) : true,
        })
      }
    }
  } catch {
    // Fallback to OpenAI-compatible endpoint below.
  }

  try {
    const openAIRes = await fetch(`${normalizedBaseUrl}/models`, {
      method: 'GET',
      headers: buildHeaders(apiKey),
      cache: 'no-store',
    })

    if (!openAIRes.ok) {
      const errorText = await openAIRes.text()
      return NextResponse.json(
        {
          error: `Models endpoint error (${openAIRes.status}): ${errorText || 'Unknown error'}`,
        },
        { status: openAIRes.status }
      )
    }

    const data = await openAIRes.json()
    if (data?.data && Array.isArray(data.data)) {
      const models = data.data
        .map((entry: { id?: string }) => entry?.id)
        .filter((id: string | undefined): id is string => Boolean(id))

      return NextResponse.json({
        source: 'openai-compatible',
        models,
        modelExists: model ? models.includes(model) : true,
      })
    }

    return NextResponse.json({
      source: 'unknown',
      models: [],
      warning: 'Unable to parse models response. You can still enter model manually.',
      modelExists: true,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: `Connection error: ${(error as Error).message}`,
      },
      { status: 500 }
    )
  }
}

async function handleChat(
  baseUrl: string,
  apiKey: string | undefined,
  model: string,
  messages: ChatMessage[],
  stream: boolean
) {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl)
  const endpoint = `${normalizedBaseUrl}/chat/completions`

  const upstream = await fetch(endpoint, {
    method: 'POST',
    headers: buildHeaders(apiKey),
    body: JSON.stringify({ model, messages, stream }),
    cache: 'no-store',
  })

  if (stream && upstream.body) {
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('content-type') ?? 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  }

  const responseText = await upstream.text()
  return new Response(responseText, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('content-type') ?? 'application/json; charset=utf-8',
    },
  })
}

export async function POST(req: NextRequest) {
  let body: LLMRequestBody

  try {
    body = (await req.json()) as LLMRequestBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!body?.baseUrl?.trim()) {
    return NextResponse.json({ error: 'baseUrl is required' }, { status: 400 })
  }

  if (body.type === 'models') {
    return handleModels(body.baseUrl, body.apiKey, body.model)
  }

  if (body.type === 'chat') {
    if (!body.model?.trim()) {
      return NextResponse.json({ error: 'model is required' }, { status: 400 })
    }
    if (!Array.isArray(body.messages)) {
      return NextResponse.json({ error: 'messages must be an array' }, { status: 400 })
    }

    try {
      return await handleChat(
        body.baseUrl,
        body.apiKey,
        body.model,
        body.messages,
        Boolean(body.stream)
      )
    } catch (error) {
      return NextResponse.json(
        { error: `Chat request failed: ${(error as Error).message}` },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ error: 'Unknown request type' }, { status: 400 })
}