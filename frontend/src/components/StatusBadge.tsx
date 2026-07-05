interface StatusBadgeProps {
  isAvailable: boolean;
}

export function StatusBadge({ isAvailable }: StatusBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-dark-700 bg-dark-800 px-3 py-1 font-mono text-sm text-dark-400">
      <span className={`h-2 w-2 animate-pulse-dot rounded-full ${isAvailable ? "bg-green-500" : "bg-red-500"}`} />
      {isAvailable ? "Disponible para proyectos" : "No disponible"}
    </div>
  );
}
