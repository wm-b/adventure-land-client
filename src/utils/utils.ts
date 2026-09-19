import AL, { Character, Entity } from "alclient"
import { Items } from "../types/items.js"

export const Try = async (fn: () => Promise<unknown>) => {
  try {
    await fn()
  } catch (error) {
    console.error("Error during attack:", error)
  }
}

export const checkCanMoveTo = ({
  character,
  entity
}: {
  character: Character
  entity: Entity
}) => {
  return AL.Pathfinder.canWalkPath(
    { map: character.map, x: character.x, y: character.y },
    { map: entity.map, x: entity.x, y: entity.y }
  )
}

export const getNearestMonster = ({
  character,
  maxAtk,
  minXp,
  targetName,
  matchNonHostile,
  doPathCheck,
  monsterType
}: {
  character: Character
  maxAtk?: number
  minXp?: number
  targetName?: string
  matchNonHostile?: boolean
  doPathCheck?: boolean
  monsterType?: string
}) =>
  character.getEntities().reduce<{
    minimumDistanceFound: number
    target: Entity | null
  }>(
    (acc, entity) => {
      const { minimumDistanceFound } = acc

      const predicates = {
        matchesType: !monsterType || entity.type === monsterType,
        meetsExceedsMinXp: !minXp || entity.xp >= minXp,
        meetsBelowMaxAtk: !maxAtk || entity.attack <= maxAtk,
        matchesName: !targetName || entity.target === targetName,
        matchesNonHostile: !matchNonHostile || entity.target !== character.name,
        pathCheck: !doPathCheck || checkCanMoveTo({ character, entity })
      }

      if (!Object.values(predicates).every(Boolean)) return acc

      var distanceFromEntity = AL.Tools.distance(
        { x: character.x, y: character.y, map: character.map },
        { x: entity.x, y: entity.y, map: entity.map }
      )
      if (distanceFromEntity < minimumDistanceFound)
        return {
          minimumDistanceFound: distanceFromEntity,
          target: entity
        }

      return acc
    },
    {
      minimumDistanceFound: Number.MAX_VALUE,
      target: null
    }
  ).target

export const checkUseHpOrMp = async (character: Character) => {
  if (
    character.max_hp - character.hp > 200 &&
    character.getCooldown("use_hp") <= 0
  )
    await Try(() => character.usePotion(0))
  if (
    character.max_mp - character.mp > 300 &&
    character.getCooldown("use_mp") <= 0
  )
    await Try(() => character.usePotion(1))
}

export const basicAttack = async (character: Character, target: Entity) => {
  if (character.getCooldown("attack") <= 0)
    await Try(() => character.basicAttack(target.id))
}

export const lootChests = async (character: Character) =>
  Promise.all(
    Array.from(character.chests.keys()).map((chestId) =>
      Try(() => character.openChest(chestId))
    )
  )

export const restockPotions = async (character: Character) => {
  // character.getEntities({type: ""})

  const healthPotions = Array.from(character.getItems().values()).find(
    (item) => item.id === Items.HealthPotion
  )
  const manaPotions = Array.from(character.getItems().values()).find(
    (item) => item.id === Items.ManaPotion
  )

  if (!healthPotions?.q || healthPotions.q < 10)
    await Try(() =>
      character.buy(Items.HealthPotion, 10 - (healthPotions?.q ?? 0))
    )
  if (!manaPotions?.q || manaPotions.q < 10)
    await Try(() => character.buy(Items.ManaPotion, 10 - (manaPotions?.q ?? 0)))
}
