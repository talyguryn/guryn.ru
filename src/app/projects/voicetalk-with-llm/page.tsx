'use client'

import { useEffect, useRef, useState } from "react"

interface Message {
  role: "user" | "assistant"
  content: string
}

const SILENCE_MS = 5000
const LLM_PROXY_ENDPOINT = '/api/llm'

// Simple markdown renderer
const MarkdownText = ({ text }: { text: string }) => {
  const renderMarkdown = (content: string) => {
    if (!content) return ''

    return content
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-800 text-white p-2 rounded my-2 overflow-x-auto"><code>$1</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-gray-200 px-1 rounded text-sm">$1</code>')
      // Bold
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 underline" target="_blank">$1</a>')
      // Line breaks
      .replace(/\n/g, '<br/>')
  }

  return (
    <span dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }} />
  )
}

export default function VoiceTalkWithLLM() {
  const safeGetFromStorage = (key: string, fallback: string) => {
    if (typeof window === "undefined") return fallback
    try {
      return localStorage.getItem(key) ?? fallback
    } catch {
      return fallback
    }
  }

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [listening, setListening] = useState(false)
  const [loading, setLoading] = useState(false)
  const [assistantTyping, setAssistantTyping] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [connectionStatus, setConnectionStatus] = useState('checking') // 'checking', 'connected', 'error'
  const [connectionError, setConnectionError] = useState('')
  const [voiceMode, setVoiceMode] = useState(false) // Toggle for continuous voice interaction
  const [speakEnabled, setSpeakEnabled] = useState(true) // Toggle to enable/disable speech
  const [speechRate, setSpeechRate] = useState(() => safeGetFromStorage('speech_rate', '1'))
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false)

  // Settings state
  const [apiKey, setApiKey] = useState(() => safeGetFromStorage('llm_api_key', ''))
  const [baseUrl, setBaseUrl] = useState(() => safeGetFromStorage('llm_base_url', 'http://localhost:11434/v1'))
  const [model, setModel] = useState(() => safeGetFromStorage('llm_model', 'gemma:2b'))

  const finalTextRef = useRef("")
  const inputRef = useRef("")
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const messagesRef = useRef<Message[]>([])
  const recognitionRef = useRef<any>(null)

  const handleSettingsSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    localStorage.setItem('llm_api_key', apiKey)
    localStorage.setItem('llm_base_url', baseUrl)
    localStorage.setItem('llm_model', model)
    localStorage.setItem('speech_rate', speechRate)
    setShowSettings(false)
    checkAvailableModels()
  }

  const checkAvailableModels = async () => {
    setConnectionStatus('checking')
    setConnectionError('')

    try {
      const proxyRes = await fetch(LLM_PROXY_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'models',
          baseUrl,
          apiKey,
          model,
        }),
      })

      const data = await proxyRes.json()

      if (!proxyRes.ok) {
        throw new Error(data?.error || 'Не удалось получить список моделей')
      }

      if (data.models && Array.isArray(data.models)) {
        const models: string[] = data.models
        setAvailableModels(models)
        setConnectionStatus('connected')

        if (model && models.length > 0 && !models.includes(model)) {
          setConnectionError(`Модель "${model}" не найдена. Доступные: ${models.join(', ')}`)
          setModel(models[0])
          localStorage.setItem('llm_model', models[0])
        } else if (data.warning) {
          setConnectionError(data.warning)
        }
        return
      }

      setConnectionStatus('connected')
      setConnectionError('Не удалось получить список моделей. Введите имя модели вручную.')

    } catch (err) {
      console.error('Failed to check models:', err)
      setConnectionStatus('error')
      setConnectionError(`Ошибка подключения: ${(err as Error).message}. Проверьте Base URL в настройках.`)
    }
  }

  useEffect(() => {
    checkAvailableModels()
  }, [baseUrl])

  useEffect(() => {
    if (typeof window === "undefined") return
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return

    const rec: typeof SpeechRecognition = new SpeechRecognition()
    rec.lang = "ru-RU"
    rec.interimResults = true
    recognitionRef.current = rec
    setHasSpeechSupport(true)

    return () => {
      rec.abort?.()
      recognitionRef.current = null
      setHasSpeechSupport(false)
    }
  }, [])

  useEffect(() => {
    const recognition = recognitionRef.current
    if (!recognition) return

    recognition.onstart = () => {
      finalTextRef.current = ""
      setListening(true)
    }

    recognition.onresult = (e: any) => {
      let interim = ""
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) finalTextRef.current += t
        else interim += t
      }
      const updated = finalTextRef.current + interim
      setInput(updated)
      inputRef.current = updated
      startSilenceTimer()
    }

    recognition.onerror = () => setListening(false)
    recognition.onend = () => setListening(false)

    return () => clearSilenceTimer()
  }, [])

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
  }

  const startSilenceTimer = () => {
    const recognition = recognitionRef.current
    if (!recognition) return
    clearSilenceTimer()
    if (!inputRef.current.trim()) return
    silenceTimerRef.current = setTimeout(() => {
      recognition?.stop()
      send(inputRef.current)
    }, SILENCE_MS)
  }

  const speak = (text: string) => {
    if (!speakEnabled) return
    if (!text || !text.trim()) return
    if (!("speechSynthesis" in window)) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = "ru-RU"
    utter.rate = parseFloat(speechRate)
    utter.onend = () => {
      if (voiceMode) {
        startListening()
      }
    }
    window.speechSynthesis.speak(utter)
  }

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
  }

  const send = async (textOverride?: string) => {
    const text = typeof textOverride === 'string' ? textOverride : input
    const payload = text.trim()
    if (!payload || loading) return

    const userMessage: Message = { role: "user", content: payload }
    const history = [...messagesRef.current, userMessage]
    setMessages(history)
    messagesRef.current = history
    setInput("")
    inputRef.current = ""
    setLoading(true)
    clearSilenceTimer()

    try {
      let useStream = true
      let streamFailed = false

      if (useStream) {
        try {
          const res = await fetch(LLM_PROXY_ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: 'chat',
              baseUrl,
              apiKey,
              model,
              messages: history,
              stream: true,
            }),
          })

          if (!res.ok || !res.body) {
            streamFailed = true
            useStream = false
          } else {

            let assistantText = ""
            setAssistantTyping(true)
            // @ts-ignore
            setMessages((prev) => {
              const next = [...prev, { role: "assistant", content: "" }]
              // @ts-ignore
              messagesRef.current = next
              return next
            })

            const reader = res.body.getReader()
            const decoder = new TextDecoder()

            const updateAssistant = (text: string) => {
              setMessages((prev) => {
                const next: Message[] = [...prev]
                const idx = next.length - 1
                if (idx >= 0 && next[idx].role === "assistant") {
                  next[idx] = { ...next[idx], content: text }
                  messagesRef.current = next
                }
                return next
              })
            }

            let done = false
            let buffer = ""
            while (!done) {
              const chunk = await reader.read()
              done = chunk.done
              buffer += decoder.decode(chunk.value || new Uint8Array(), { stream: !done })
              const parts = buffer.split("\n\n")
              buffer = parts.pop() ?? ""
              for (const part of parts) {
                const line = part.trim()
                if (!line.startsWith("data:")) continue
                const payloadStr = line.slice(5).trim()
                if (payloadStr === "[DONE]") {
                  done = true
                  break
                }
                if (!payloadStr) continue
                try {
                  const json = JSON.parse(payloadStr)
                  const delta = json?.choices?.[0]?.delta?.content ?? ""
                  if (delta) {
                    assistantText += delta
                    updateAssistant(assistantText)
                  }
                } catch (e) {
                  console.error("Failed to parse chunk:", e, payloadStr)
                }
              }
            }

            setAssistantTyping(false)
            speak(assistantText)
          }
        } catch (streamErr) {
          console.warn("Stream failed, retrying without stream:", streamErr)
          streamFailed = true
          useStream = false
        }
      }

      if (!useStream) {
        const res = await fetch(LLM_PROXY_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: 'chat',
            baseUrl,
            apiKey,
            model,
            messages: history,
            stream: false,
          }),
        })

        const data = await res.json()
        console.log("Non-stream response:", data)

        // Check for error response
        if (data.error) {
          throw new Error(data.error.message || JSON.stringify(data.error))
        }

        let content = ""
        if (data.choices && data.choices[0]) {
          content = data.choices[0].message?.content || data.choices[0].text || ""
        } else if (data.message) {
          content = data.message.content || data.message
        } else if (data.response) {
          content = data.response
        } else {
          content = "Unexpected response format: " + JSON.stringify(data)
        }

        const assistantMsg = { role: "assistant", content: content }
        // @ts-ignore
        setMessages((prev) => {
          const next = [...prev, assistantMsg]
          // @ts-ignore
          messagesRef.current = next
          return next
        })
        setAssistantTyping(false)
        speak(content)
      }
    } catch (err) {
      console.error("LLM Error:", err)
      const errorMsg = `Ошибка: ${(err as Error).message}`
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant" as const,
          content: errorMsg,
        },
      ])
      messagesRef.current = [
        ...messagesRef.current,
        {
          role: "assistant",
          content: errorMsg,
        },
      ]
      setAssistantTyping(false)
    } finally {
      setLoading(false)
    }
  }

  const startListening = () => {
    const recognition = recognitionRef.current
    if (!recognition) return
    finalTextRef.current = ""
    clearSilenceTimer()
    try {
      recognition.start()
    } catch (e) {
      // if already started, ignore
    }
  }

  const toggleListening = () => {
    const recognition = recognitionRef.current
    if (!recognition) return
    if (listening) {
      recognition.stop()
      clearSilenceTimer()
      return
    }
    startListening()
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-4 rounded shadow">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl">Voice ↔ LLM Dialog</h1>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
          >
            ⚙️ Settings
          </button>
        </div>

        {showSettings && (
          <div className="mb-4 p-4 border rounded bg-gray-50">
            <h2 className="text-lg font-bold mb-2">Settings</h2>
            <form onSubmit={handleSettingsSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Base URL:
                </label>
                <input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  className="w-full border p-2 rounded"
                  placeholder="http://localhost:11434/v1 or https://api.openai.com/v1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Model:
                </label>
                {availableModels.length > 0 ? (
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full border p-2 rounded"
                  >
                    {availableModels.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full border p-2 rounded"
                    placeholder="gemma:2b"
                  />
                )}
                {connectionError && (
                  <p className="text-xs text-orange-600 mt-1">{connectionError}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  API Key (optional):
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full border p-2 rounded"
                  placeholder="Leave empty for local Ollama"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="speakToggle"
                  checked={speakEnabled}
                  onChange={(e) => setSpeakEnabled(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="speakToggle" className="text-sm cursor-pointer">
                  Проговаривать ответ ассистента
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Скорость проговаривания: <span className="font-bold">{speechRate}x</span>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(e.target.value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0.5x</span>
                  <span>2x</span>
                </div>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save Settings
              </button>
            </form>
          </div>
        )}

        {!hasSpeechSupport && <div className="text-sm text-red-600 mb-2">Web Speech API недоступен</div>}

        {connectionStatus === 'checking' && (
          <div className="text-sm text-blue-600 mb-2">🔄 Проверка подключения...</div>
        )}

        {connectionStatus === 'error' && (
          <div className="text-sm text-red-600 mb-2 p-3 bg-red-50 rounded">
            ❌ {connectionError}
            <button
              onClick={() => setShowSettings(true)}
              className="ml-2 underline"
            >
              Открыть настройки
            </button>
          </div>
        )}

        <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "text-right" : ""}>
              <div
                className={`inline-block px-3 py-1 rounded ${m.role === "user" ? "bg-blue-100" : "bg-gray-200"
                  }`}
              >
                <b>{m.role}:</b> {m.content ? <MarkdownText text={m.content} /> : (assistantTyping && m.role === "assistant" ? "..." : "")}
              </div>
            </div>
          ))}
        </div>

        {connectionStatus !== 'error' && (
          <>
            <textarea
              className="w-full border p-2 rounded mb-2"
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                inputRef.current = e.target.value
              }}
              placeholder="Скажите или введите запрос"
            />

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setVoiceMode(!voiceMode)
                  if (!voiceMode) {
                    toggleListening()
                  } else {
                    if (listening) recognitionRef.current?.stop()
                  }
                }}
                disabled={!hasSpeechSupport}
                className={`px-4 py-2 rounded text-white ${voiceMode ? "bg-purple-600" : "bg-blue-500"
                  } disabled:opacity-50`}
              >
                {voiceMode ? "🔊 Режим диалога активен" : "💬 Включить режим диалога"}
              </button>

              <button
                onClick={stopSpeaking}
                className="bg-red-500 text-white px-4 py-2 rounded"
                title="Остановить проговаривание"
              >
                ⏹ Стоп
              </button>

              <button
                onClick={() => send()}
                disabled={loading}
                className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {loading ? "Ждем ответ..." : "Отправить"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
