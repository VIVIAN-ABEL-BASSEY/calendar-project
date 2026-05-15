const COLORS = [
  '#4285f4', // blue
  '#0f9d58', // green
  '#f4b400', // yellow
  '#db4437', // red
  '#ab47bc', // purple
  '#00acc1', // cyan
  '#ff7043', // orange
  '#5c6bc0', // indigo
]

// generates a stable color from any string
export function getGroupColor(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  return COLORS[Math.abs(hash) % COLORS.length]
}