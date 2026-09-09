import { NextResponse } from "next/server";

const REPO_API = "https://api.github.com/repos/anomalyco/models.dev/contents/labs?ref=dev";

interface GitHubEntry {
  name: string;
  path: string;
  type: string;
}

async function fetchLabDescriptions(): Promise<Record<string, string>> {
  const res = await fetch(REPO_API, {
    headers: { Accept: "application/vnd.github.v3+json" },
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    return {};
  }

  const entries: GitHubEntry[] = await res.json();
  const dirs = entries.filter((e) => e.type === "dir");

  const results: Record<string, string> = {};

  await Promise.all(
    dirs.map(async (dir) => {
      try {
        const labId = dir.name;
        const fileUrl = `https://api.github.com/repos/anomalyco/models.dev/contents/labs/${labId}/lab.toml?ref=dev`;
        const rawRes = await fetch(fileUrl, {
          headers: { Accept: "application/vnd.github.v3.raw" },
          next: { revalidate: 86400 },
        });
        if (!rawRes.ok) return;
        const text = await rawRes.text();
        const descMatch = text.match(/^description\s*=\s*"(.+?)"/m);
        if (descMatch?.[1]) {
          results[labId] = descMatch[1];
        }
      } catch {
        /* skip */
      }
    }),
  );

  return results;
}

export async function GET() {
  const data = await fetchLabDescriptions();
  return NextResponse.json(data);
}
