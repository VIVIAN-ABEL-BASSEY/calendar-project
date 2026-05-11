export default function Spinner({ size = 24 }: { size?: number }) {
  return (
    <div
      style={{
        width:  size,
        height: size,
        border: `2px solid var(--color-border)`,
        borderTop: `2px solid var(--color-primary)`,
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
        flexShrink: 0,
      }}
    />
  )
}