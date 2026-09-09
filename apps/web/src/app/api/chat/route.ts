import { type NextRequest, NextResponse } from "next/server";

interface ProviderConfig {
  name: string;
  npm: string;
  api?: string;
  baseUrl?: string;
}

function resolveApiKey(apiKey: string): string {
  if (apiKey.startsWith("sk-") || apiKey.startsWith("xai-") || apiKey.length > 20) {
    return apiKey;
  }
  return apiKey;
}

function buildHeaders(apiKey: string, providerNpm: string): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (providerNpm === "@ai-sdk/anthropic") {
    headers["x-api-key"] = apiKey;
    headers["anthropic-version"] = "2023-06-01";
  } else {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  return headers;
}

function buildBody(
  messages: { role: string; content: string }[],
  model: string,
  providerNpm: string,
): Record<string, unknown> {
  if (providerNpm === "@ai-sdk/anthropic") {
    const system = messages.find((m) => m.role === "system");
    const chatMessages = messages.filter((m) => m.role !== "system");
    return {
      model,
      max_tokens: 4096,
      ...(system ? { system: system.content } : {}),
      messages: chatMessages.map((m) => ({ role: m.role, content: m.content })),
      stream: true,
    };
  }

  return {
    model,
    messages,
    stream: true,
  };
}

function getEndpoint(providerNpm: string, providerApi?: string): string {
  if (providerApi) return providerApi;

  if (providerNpm === "@ai-sdk/openai") return "https://api.openai.com/v1/chat/completions";
  if (providerNpm === "@ai-sdk/anthropic") return "https://api.anthropic.com/v1/messages";
  if (providerNpm === "@ai-sdk/google") return "https://generativelanguage.googleapis.com/v1beta/models";
  if (providerNpm === "@ai-sdk/groq") return "https://api.groq.com/openai/v1/chat/completions";
  if (providerNpm === "@ai-sdk/mistral") return "https://api.mistral.ai/v1/chat/completions";
  if (providerNpm === "@ai-sdk/xai") return "https://api.x.ai/v1/chat/completions";
  if (providerNpm === "@ai-sdk/deepinfra") return "https://api.deepinfra.com/v1/openai/chat/completions";
  if (providerNpm === "@ai-sdk/togetherai") return "https://api.together.xyz/v1/chat/completions";
  if (providerNpm === "@ai-sdk/perplexity") return "https://api.perplexity.ai/chat/completions";

  return "https://api.openai.com/v1/chat/completions";
}

function getResponsePath(providerNpm: string): (line: string) => { done: boolean; content?: string } {
  if (providerNpm === "@ai-sdk/anthropic") {
    return (line: string) => {
      if (!line.startsWith("data: ")) return { done: false };
      const data = line.slice(6);
      if (data === "[DONE]") return { done: true };
      try {
        const parsed = JSON.parse(data);
        if (parsed.type === "content_block_delta") {
          return { done: false, content: parsed.delta?.text };
        }
        return { done: false };
      } catch {
        return { done: false };
      }
    };
  }

  return (line: string) => {
    if (!line.startsWith("data: ")) return { done: false };
    const data = line.slice(6);
    if (data === "[DONE]") return { done: true };
    try {
      const parsed = JSON.parse(data);
      return { done: false, content: parsed.choices?.[0]?.delta?.content };
    } catch {
      return { done: false };
    }
  };
}

export async function POST(request: NextRequest) {
  try {
    const { messages, providerId, apiKey, model } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ error: "API key not provided" }, { status: 400 });
    }

    if (!providerId) {
      return NextResponse.json({ error: "Provider not specified" }, { status: 400 });
    }

    const providerConfigRaw = request.nextUrl.searchParams.get("providerConfig");
    let providerConfig: ProviderConfig | null = null;
    if (providerConfigRaw) {
      try {
        providerConfig = JSON.parse(providerConfigRaw);
      } catch {
        /* ignore */
      }
    }

    const providerNpm = providerConfig?.npm || "@ai-sdk/openai-compatible";
    const providerApi = providerConfig?.api;
    const resolvedKey = resolveApiKey(apiKey);

    const endpoint = getEndpoint(providerNpm, providerApi);
    const headers = buildHeaders(resolvedKey, providerNpm);
    const body = buildBody(
      [
        {
          role: "system",
          content:
            "You are a helpful AI assistant in a coding IDE. Respond concisely and helpfully. You can help with coding, debugging, explanations, and general questions.",
        },
        ...messages,
      ],
      model || "gpt-4o-mini",
      providerNpm,
    );

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error }, { status: response.status });
    }

    const parseResponse = getResponsePath(providerNpm);

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const result = parseResponse(line);
            if (result.done) {
              controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
              break;
            }
            if (result.content) {
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content: result.content })}\n\n`));
            }
          }
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
