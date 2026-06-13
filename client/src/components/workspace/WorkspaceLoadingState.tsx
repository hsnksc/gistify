export default function WorkspaceLoadingState({ label }: { label: string }) {
  return (
    <section className="workspace-card p-6 text-sm leading-7 text-muted-foreground">
      {label}
    </section>
  );
}
