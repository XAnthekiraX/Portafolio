interface LogoProps {
  showText?: boolean;
}

export function Logo({ showText = true }: LogoProps) {
  return (
    <a href="#" className="flex items-center gap-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-dark-950">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
        <span className="font-display text-lg font-bold text-white">A</span>
      </div>
      {showText && (
        <span className="hidden font-display text-lg font-bold sm:block">
          Alex Doe
        </span>
      )}
    </a>
  );
}
