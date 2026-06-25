import LoadingState from "@/components/ui/loading-state";

export default function WorkspaceLoadingState({ label }: { label: string }) {
  return <LoadingState compact className="workspace-card p-6" label={label} />;
}
