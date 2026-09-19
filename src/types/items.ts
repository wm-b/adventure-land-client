export const Items = {
  HealthPotion: "hpot0",
  ManaPotion: "mpot0"
} as const
export type ItemType = typeof Items[keyof typeof Items]
