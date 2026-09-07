import Link from "next/link";

interface AppLogoProps {
  href?: string;
  className?: string;
}

export default function AppLogo({
  href = "/",
  className = "",
}: AppLogoProps) {
  return (
    <Link
      href={href}
      className={`font-mono font-bold text-lg sm:text-xl text-primary tracking-widest inline-flex items-center gap-0.5 select-none ${className}`}
    >
      [TOOLNOTCH]<span className="text-primary">*</span>
    </Link>
  );
}
