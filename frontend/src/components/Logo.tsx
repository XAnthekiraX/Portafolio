interface LogoProps {
  showText?: boolean;
  name?: string;
}

export function Logo({ showText = true, name = "Portafolio" }: LogoProps) {
  const initial = name.charAt(0).toUpperCase();

  return (
    <a href="#" className="flex items-center gap-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-dark-950">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
        <span className="font-display text-lg font-bold text-white">{initial}</span>
      </div>
      {showText && (
        <span className="hidden font-display text-lg font-bold sm:block">
          {name}
        </span>
      )}
    </a>
  );
}
