export function Spinner({ label = 'Loading', className = '' }: { label?: string; className?: string }) {
  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
    />
  );
}
