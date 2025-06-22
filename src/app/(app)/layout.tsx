import { AppShell } from "@/components/app-shell";
import { AppStateProvider } from "@/context/app-state-context";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppStateProvider>
      <AppShell>{children}</AppShell>
    </AppStateProvider>
  );
}
