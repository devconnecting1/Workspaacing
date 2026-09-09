import { type NextRequest, NextResponse } from "next/server";

import { Models } from "@opencode-ai/models";

const client = Models.make();

export async function GET(request: NextRequest) {
  const provider = request.nextUrl.searchParams.get("provider");

  try {
    const allProviders = await client.providers();

    if (provider) {
      const ids = provider.split(",");
      const filtered: Record<string, unknown> = {};
      for (const id of ids) {
        if (allProviders[id]) {
          filtered[id] = allProviders[id];
        }
      }
      return NextResponse.json(filtered);
    }

    return NextResponse.json(allProviders);
  } catch {
    return NextResponse.json({ error: "Failed to fetch models" }, { status: 502 });
  }
}
