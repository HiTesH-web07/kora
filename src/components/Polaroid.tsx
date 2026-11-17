export function Polaroid({ src, alt, caption, rotate = 0, className = "", tape = true, position = "center", ratio = "aspect-[4/5]" }: {
  src: string; alt: string; caption: string; rotate?: number; className?: string; tape?: boolean; position?: string; ratio?: string;
}) {
  return (
    <figure className={`polaroid relative ${className}`} style={{ transform: `rotate(${rotate}deg)` }}>
      {tape && <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-[-4deg]" aria-hidden="true" />}
      <div className={`${ratio} overflow-hidden bg-cream`}>
        <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: position }} />
      </div>
      <figcaption className="hand mt-2 text-center text-2xl text-burgundy">{caption}</figcaption>
    </figure>
  );
}
