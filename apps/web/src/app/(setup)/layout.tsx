import type { ReactNode } from "react";

import { SetupHeader } from "./_components/setup-header";

export default function SetupLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SetupHeader />
      <main className="flex flex-1 items-center justify-center p-4 md:p-8">{children}</main>
    </div>
  );
}
