import AL from "alclient"
import {
  basicAttack,
  checkUseHpOrMp,
  getNearestMonster,
  lootChests,
  restockPotions
} from "./utils/utils.js"
import { Character } from "alclient"

const minXp = 100
const maxAtk = 120

const initialise = async () => {
  await Promise.all([
    AL.Game.loginJSONFile("./credentials.json"),
    AL.Game.getGData()
  ])
  await AL.Pathfinder.prepare(AL.Game.G)
  const mage = await AL.Game.startMage("Inceris", "EU", "IV")

  setInterval(() => attackFn(mage), 250)
}

const attackFn = async (character: Character) => {
  if (character.rip || character.moving)
    return console.info("Character is dead or moving")

  await lootChests(character)
  await restockPotions(character)
  await checkUseHpOrMp(character)

  const target =
    character.getTargetEntity() ||
    getNearestMonster({
      character,
      minXp,
      maxAtk
    })
  if (!target) return console.log("No target found")
  character.target = target.name

  if (character.range < AL.Tools.distance(character, target))
    return character.move(
      character.x + (target.x - character.x) / 2,
      character.y + (target.y - character.y) / 2
    )

  if (character.isDisabled()) return console.log("Character is disabled")

  await basicAttack(character, target)
}

initialise()
