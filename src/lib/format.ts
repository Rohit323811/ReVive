/** Format kilograms in a human-friendly way: g below 1 kg, t above 1000 kg. */
export function formatKg(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} t`
  if (kg >= 1) return `${kg % 1 === 0 ? kg.toFixed(0) : kg.toFixed(1)} kg`
  const g = Math.round(kg * 1000)
  return `${g.toLocaleString()} g`
}

export function formatUsd(usd: number): string {
  return usd % 1 === 0 ? `$${usd.toFixed(0)}` : `$${usd.toFixed(2)}`
}

export function formatMinutes(min: number): string {
  if (min < 60) return `${min} min`
  const h = min / 60
  return h % 1 === 0 ? `${h} h` : `${h.toFixed(1).replace(/\.0$/, '')} h`
}
