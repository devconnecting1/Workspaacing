import { Chat } from "@/app/(main)/chat/_components/chat";

export default function Page() {
  return (
    <div className="mx-auto h-full w-full max-w-5xl overflow-hidden rounded-lg border bg-background shadow-sm">
      <Chat />
    </div>
  );
}
