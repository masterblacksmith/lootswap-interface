import { Interface } from '@ethersproject/abi'
import { abi as DUNGEON_ABI } from '@lootswap/contracts/build/Quests.json'

const DUNGEON_INTERFACE = new Interface(DUNGEON_ABI)

export default DUNGEON_INTERFACE
export { DUNGEON_ABI, DUNGEON_INTERFACE }
