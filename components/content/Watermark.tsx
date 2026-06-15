// Overlay on ALL slides and videos. Cannot be removed by the student.

export function Watermark({ name, email }: { name: string; email: string }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-50 overflow-hidden select-none"
      aria-hidden="true"
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute whitespace-nowrap text-white/10 font-mono text-sm rotate-[-35deg]"
          style={{
            top: `${(i * 14) - 5}%`,
            left: '-10%',
            width: '120%',
          }}
        >
          {name} · {email} · {name} · {email} · {name} · {email}
        </div>
      ))}
    </div>
  );
}
