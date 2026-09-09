import { create } from "zustand";

import { type Conversation, currentUser, conversations as seedConversations } from "./data";

export type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

type ChatStore = {
  conversations: Conversation[];
  selected: number | null;
  messages: ChatMessage[];
  isLoading: boolean;
  selectedModel: string;
  connectedProviders: Record<string, { name: string; npm: string; api?: string; baseUrl?: string }>;

  selectConversation: (id: number) => void;
  createConversation: () => void;
  addMessage: (message: ChatMessage) => void;
  updateLastAssistantMessage: (content: string) => void;
  setLoading: (loading: boolean) => void;
  setSelectedModel: (model: string) => void;
  loadConnectedProviders: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
};

let nextId = 10_000;

const PROVIDER_ENDPOINTS: Record<string, string> = {
  "@ai-sdk/openai": "https://api.openai.com/v1/chat/completions",
  "@ai-sdk/anthropic": "https://api.anthropic.com/v1/messages",
  "@ai-sdk/google": "https://generativelanguage.googleapis.com/v1beta/models",
  "@ai-sdk/groq": "https://api.groq.com/openai/v1/chat/completions",
  "@ai-sdk/mistral": "https://api.mistral.ai/v1/chat/completions",
  "@ai-sdk/xai": "https://api.x.ai/v1/chat/completions",
  "@ai-sdk/deepinfra": "https://api.deepinfra.com/v1/openai/chat/completions",
  "@ai-sdk/togetherai": "https://api.together.xyz/v1/chat/completions",
  "@ai-sdk/perplexity": "https://api.perplexity.ai/chat/completions",
};

function getEndpoint(npm: string, api?: string, baseUrl?: string): string {
  if (api) return api;
  if (baseUrl) return `${baseUrl.replace(/\/$/, "")}/v1/chat/completions`;
  return PROVIDER_ENDPOINTS[npm] ?? "https://api.openai.com/v1/chat/completions";
}

function buildHeaders(apiKey: string, npm: string): Record<string, string> {
  if (npm === "@ai-sdk/anthropic") {
    return { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" };
  }
  return { Authorization: `Bearer ${apiKey}`, "content-type": "application/json" };
}

function buildBody(messages: { role: string; content: string }[], model: string, npm: string) {
  if (npm === "@ai-sdk/anthropic") {
    const system = messages.find((m) => m.role === "system");
    const chat = messages.filter((m) => m.role !== "system");
    return {
      model,
      max_tokens: 4096,
      ...(system ? { system: system.content } : {}),
      messages: chat.map((m) => ({ role: m.role, content: m.content })),
      stream: true,
    };
  }
  return { model, messages, stream: true };
}

function parseLine(line: string, npm: string): { done: boolean; content?: string } {
  if (!line.startsWith("data: ")) return { done: false };
  const data = line.slice(6);
  if (data === "[DONE]") return { done: true };
  try {
    const parsed = JSON.parse(data);
    if (npm === "@ai-sdk/anthropic") {
      return { done: false, content: parsed.delta?.text };
    }
    return { done: false, content: parsed.choices?.[0]?.delta?.content };
  } catch {
    return { done: false };
  }
}

const useChatStore = create<ChatStore>((set, get) => ({
  conversations: seedConversations,
  selected: seedConversations[0]?.id ?? null,
  messages: [],
  isLoading: false,
  selectedModel: "",
  connectedProviders: {},

  selectConversation: (id) => set({ selected: id, messages: [] }),

  createConversation: () => {
    const id = ++nextId;
    const now = new Date().toISOString();
    const newConv: Conversation = {
      id,
      group: "Today",
      name: currentUser.name,
      subject: "Nova conversa",
      subjectKey: "chat.newConversation",
      preview: "",
      previewKey: "",
      time: now,
      isUnread: false,
      isOnline: true,
      unreadCount: 0,
      contact: {
        name: currentUser.name,
        role: "Assistente AI",
        roleKey: "",
        company: "",
        email: "",
        phone: "",
        website: "",
        location: "",
        timezone: "",
        status: "Active",
        statusKey: "",
        qualifiedAt: now,
        tags: [],
        tagKeys: [],
      },
      messages: [],
    };
    set((state) => ({
      conversations: [newConv, ...state.conversations],
      selected: id,
      messages: [],
    }));
  },

  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),

  updateLastAssistantMessage: (content) =>
    set((state) => {
      const msgs = [...state.messages];
      const last = msgs[msgs.length - 1];
      if (last && last.role === "assistant") {
        msgs[msgs.length - 1] = { ...last, content };
      }
      return { messages: msgs };
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setSelectedModel: (model) => set({ selectedModel: model }),

  loadConnectedProviders: async () => {
    try {
      const { configStorage, credentialsStorage } = await import("@/lib/storage");
      const config = await configStorage.read();
      const providers: Record<string, { name: string; npm: string; api?: string; baseUrl?: string }> = {};

      for (const [id, provConfig] of Object.entries(config.providers)) {
        const cred = await credentialsStorage.get(id);
        if (cred) {
          providers[id] = {
            name: provConfig.name,
            npm: provConfig.npm,
            api: provConfig.api,
            baseUrl: provConfig.baseUrl,
          };
        }
      }

      const customProviders = await configStorage.getCustomProviders();
      for (const [id, custom] of Object.entries(customProviders)) {
        const cred = await credentialsStorage.get(id);
        if (cred) {
          providers[id] = {
            name: custom.name,
            npm: custom.npm ?? "@ai-sdk/openai-compatible",
            baseUrl: custom.baseUrl,
          };
        }
      }

      set({ connectedProviders: providers });

      if (!get().selectedModel && Object.keys(providers).length > 0) {
        const cfg = await configStorage.read();
        const enabled = cfg.enabledModels;
        if (enabled.length > 0) {
          set({ selectedModel: enabled[0] });
        }
      }
    } catch {
      /* ignore */
    }
  },

  sendMessage: async (content) => {
    const state = get();
    if (!content.trim() || state.isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      content,
    };
    set((s) => ({ messages: [...s.messages, userMessage], isLoading: true }));

    try {
      const allMessages = [...get().messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const modelId = get().selectedModel;
      const providers = get().connectedProviders;

      let providerId = "";
      let apiKey = "";
      let modelName = modelId;

      const slashIndex = modelId.indexOf("/");
      if (slashIndex > 0) {
        providerId = modelId.substring(0, slashIndex);
        modelName = modelId.substring(slashIndex + 1);
      }

      const { credentialsStorage } = await import("@/lib/storage");
      if (providerId) {
        const cred = await credentialsStorage.get(providerId);
        if (cred) apiKey = cred;
      }

      if (!apiKey) {
        const allCreds = await credentialsStorage.list();
        if (allCreds.length > 0) {
          const firstCred = await credentialsStorage.get(allCreds[0]);
          if (firstCred) {
            apiKey = firstCred;
            if (!providerId) providerId = allCreds[0];
          }
        }
      }

      if (!apiKey) {
        throw new Error("Nenhuma API key configurada. Conecte um provedor em Configurações.");
      }

      const providerConfig = providers[providerId];
      const npm = providerConfig?.npm ?? "@ai-sdk/openai-compatible";
      const endpoint = getEndpoint(npm, providerConfig?.api, providerConfig?.baseUrl);
      const headers = buildHeaders(apiKey, npm);
      const body = buildBody(
        [
          {
            role: "system",
            content: "You are a helpful AI assistant in a coding IDE. Respond concisely and helpfully.",
          },
          ...allMessages,
        ],
        modelName || "gpt-4o-mini",
        npm,
      );

      const response = await fetch(endpoint, { method: "POST", headers, body: JSON.stringify(body) });

      if (!response.ok) {
        const text = await response.text();
        try {
          const errData = JSON.parse(text);
          throw new Error(errData.error?.message ?? errData.error ?? `HTTP ${response.status}`);
        } catch (e) {
          if (e instanceof Error && e.message !== `HTTP ${response.status}`) throw e;
          throw new Error(`Erro ${response.status}: provedor indisponível`);
        }
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Sem stream na resposta");

      const decoder = new TextDecoder();
      let assistantContent = "";
      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: "",
      };
      set((s) => ({ messages: [...s.messages, assistantMessage] }));

      let buffer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const result = parseLine(line, npm);
          if (result.done) break;
          if (result.content) {
            assistantContent += result.content;
            get().updateLastAssistantMessage(assistantContent);
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      const msg = error instanceof Error ? error.message : "erro desconhecido";
      set((s) => ({
        messages: [
          ...s.messages,
          {
            id: Date.now() + 2,
            role: "assistant",
            content: `Erro: ${msg}`,
          },
        ],
      }));
    } finally {
      set({ isLoading: false });
    }
  },
}));

export function useChat() {
  return useChatStore();
}
