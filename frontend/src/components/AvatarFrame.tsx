import { Code2 } from "lucide-react";

interface AvatarFrameProps {
  avatarUrl: string;
  name: string;
}

export function AvatarFrame({ avatarUrl, name }: AvatarFrameProps) {
  return (
    <div className="group relative h-64 w-64 md:h-80 md:w-80">
      <div className="absolute inset-0 rotate-6 rounded-3xl border border-dark-700 transition-transform duration-500 group-hover:rotate-3" />
      <div className="absolute inset-0 -rotate-6 rounded-3xl border border-accent/30 transition-transform duration-500 group-hover:-rotate-3" />
      <div className="absolute inset-2 overflow-hidden rounded-2xl border border-dark-700 bg-dark-800">
        <img
          src={avatarUrl}
          alt={name}
          className="h-full w-full object-cover saturate-0 transition-all duration-500 group-hover:saturate-100"
        />
      </div>
      <div className="absolute -bottom-4 -left-4 flex items-center gap-3 rounded-xl border border-dark-700 bg-dark-900 p-3 shadow-xl shadow-cyan-500/20">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
          <Code2 className="h-5 w-5 text-accent" />
        </div>
        <div className="text-left">
          <p className="font-mono text-xs text-dark-400">Stack</p>
          <p className="text-sm font-bold text-dark-100">React / Node</p>
        </div>
      </div>
    </div>
  );
}
