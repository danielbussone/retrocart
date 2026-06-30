import type { LibraryItem, ConsoleId, SyncStatus } from '../types'

export const MIYOO_ID = 'miyoo-mini-plus'
export const RP6_ID = 'retroid-pocket-6'

type G = [string, number, string, string, string, number, number, string]
// [title, sizeKB, developer, publisher, genre, year, rating, players]

function makeItems(console: ConsoleId, games: G[], startIdx: number): LibraryItem[] {
  const ext = console === 'psx' ? 'chd' : 'zip'
  const miyooCapable = console !== 'psx' && console !== 'n64'

  function statusFor(seed: number): SyncStatus {
    const n = seed % 16
    if (n === 0) return 'pending_add'
    if (n === 4) return 'pending_remove'
    if (n === 9) return 'conflict'
    return 'synced'
  }

  return games.map(([title, kb, dev, pub, genre, year, rating, players], i) => {
    const idx = startIdx + i
    const filename = `${title} (USA).${ext}`
    const filenameStem = `${title} (USA)`
    const isTaggedMiyoo = miyooCapable && idx % 7 !== 6
    const isTaggedRg = idx % 6 !== 5
    const deviceTags: Partial<Record<string, SyncStatus>> = {}
    if (isTaggedMiyoo) deviceTags[MIYOO_ID] = statusFor(idx)
    if (isTaggedRg) deviceTags[RP6_ID] = statusFor(idx + 3)
    return {
      id: `item-${String(idx).padStart(3, '0')}`,
      title,
      console,
      filename,
      filenameStem,
      sizeBytes: kb * 1024,
      developer: dev,
      publisher: pub,
      genre,
      year,
      rating,
      players,
      deviceTags,
    }
  })
}

const nes: G[] = [
  ['Super Mario Bros.', 40, 'Nintendo', 'Nintendo', 'Platform', 1985, 1.0, '1-2'],
  ['The Legend of Zelda', 128, 'Nintendo', 'Nintendo', 'Action-Adventure', 1986, 1.0, '1'],
  ['Metroid', 128, 'Nintendo', 'Nintendo', 'Action-Adventure', 1986, 0.9, '1'],
  ['Mega Man 2', 128, 'Capcom', 'Capcom', 'Platform', 1988, 1.0, '1'],
  ['Castlevania', 128, 'Konami', 'Konami', 'Platform', 1986, 0.95, '1'],
  ['Contra', 128, 'Konami', 'Konami', 'Run and Gun', 1988, 0.95, '1-2'],
  ['Punch-Out!!', 128, 'Nintendo', 'Nintendo', 'Sports', 1987, 0.95, '1'],
  ['DuckTales', 64, 'Capcom', 'Capcom', 'Platform', 1989, 0.9, '1'],
  ['Ninja Gaiden', 128, 'Tecmo', 'Tecmo', 'Action', 1988, 0.9, '1'],
  ['Final Fantasy', 256, 'Square', 'Square', 'RPG', 1987, 0.9, '1'],
  ["Kirby's Adventure", 384, 'HAL Laboratory', 'Nintendo', 'Platform', 1993, 0.95, '1'],
  ['Bionic Commando', 128, 'Capcom', 'Capcom', 'Action', 1988, 0.85, '1'],
  ['Battletoads', 256, 'Rare', 'Tradewest', 'Beat em Up', 1991, 0.85, '1-2'],
  ['Double Dragon', 64, 'Technos Japan', 'Acclaim', 'Beat em Up', 1987, 0.8, '1-2'],
  ['Excitebike', 24, 'Nintendo', 'Nintendo', 'Racing', 1984, 0.8, '1'],
  ['Dr. Mario', 128, 'Nintendo', 'Nintendo', 'Puzzle', 1990, 0.85, '1-2'],
  ['Tetris', 32, 'Nintendo', 'Nintendo', 'Puzzle', 1989, 0.9, '1-2'],
  ['Mega Man 3', 256, 'Capcom', 'Capcom', 'Platform', 1990, 0.9, '1'],
  ['River City Ransom', 128, 'Technos Japan', 'Technos Japan', 'Beat em Up', 1989, 0.85, '1-2'],
  ['Batman', 128, 'Sunsoft', 'Sunsoft', 'Action', 1989, 0.8, '1'],
  ["Chip 'n Dale Rescue Rangers", 128, 'Capcom', 'Capcom', 'Platform', 1990, 0.85, '1-2'],
  ['EarthBound Beginnings', 256, 'Ape', 'Nintendo', 'RPG', 1989, 0.85, '1'],
  ['StarTropics', 256, 'Nintendo', 'Nintendo', 'Action-Adventure', 1990, 0.8, '1'],
  ['Tecmo Super Bowl', 128, 'Tecmo', 'Tecmo', 'Sports', 1991, 0.85, '1-2'],
  ['Mega Man', 64, 'Capcom', 'Capcom', 'Platform', 1987, 0.8, '1'],
]

const snes: G[] = [
  ['Super Mario World', 512, 'Nintendo', 'Nintendo', 'Platform', 1990, 1.0, '1-2'],
  ['The Legend of Zelda: A Link to the Past', 1024, 'Nintendo', 'Nintendo', 'Action-Adventure', 1991, 1.0, '1'],
  ['Super Metroid', 3072, 'Nintendo', 'Nintendo', 'Action-Adventure', 1994, 1.0, '1'],
  ['Chrono Trigger', 4096, 'Square', 'Square', 'RPG', 1995, 1.0, '1'],
  ['Final Fantasy VI', 3072, 'Square', 'Square', 'RPG', 1994, 1.0, '1'],
  ['Donkey Kong Country', 4096, 'Rare', 'Nintendo', 'Platform', 1994, 0.95, '1-2'],
  ['EarthBound', 2048, 'Ape / HAL', 'Nintendo', 'RPG', 1994, 0.95, '1'],
  ['Super Castlevania IV', 1024, 'Konami', 'Konami', 'Platform', 1991, 0.9, '1'],
  ['F-Zero', 512, 'Nintendo', 'Nintendo', 'Racing', 1990, 0.9, '1'],
  ['Star Fox', 1024, 'Nintendo', 'Nintendo', 'Shooter', 1993, 0.9, '1'],
  ['Kirby Super Star', 4096, 'HAL Laboratory', 'Nintendo', 'Platform', 1996, 0.95, '1-2'],
  ["Yoshi's Island", 4096, 'Nintendo', 'Nintendo', 'Platform', 1995, 0.95, '1'],
  ['Mega Man X', 1024, 'Capcom', 'Capcom', 'Platform', 1993, 0.95, '1'],
  ['Secret of Mana', 2048, 'Square', 'Square', 'Action RPG', 1993, 0.9, '1-3'],
  ['Super Mario Kart', 512, 'Nintendo', 'Nintendo', 'Racing', 1992, 0.9, '1-2'],
  ['Street Fighter II Turbo', 2048, 'Capcom', 'Capcom', 'Fighting', 1993, 0.85, '1-2'],
  ['Mortal Kombat II', 2048, 'Sculptured Software', 'Acclaim', 'Fighting', 1994, 0.8, '1-2'],
  ['Contra III: The Alien Wars', 1024, 'Konami', 'Konami', 'Run and Gun', 1992, 0.9, '1-2'],
  ['Final Fantasy IV', 1024, 'Square', 'Square', 'RPG', 1991, 0.9, '1'],
  ['Breath of Fire II', 2048, 'Capcom', 'Capcom', 'RPG', 1994, 0.85, '1'],
  ['Pilotwings', 512, 'Nintendo', 'Nintendo', 'Simulation', 1990, 0.8, '1'],
  ['NBA Jam', 1024, 'Sculptured Software', 'Acclaim', 'Sports', 1994, 0.8, '1-2'],
  ['Super Punch-Out!!', 1024, 'Nintendo', 'Nintendo', 'Sports', 1994, 0.85, '1'],
  ['ActRaiser', 512, 'Quintet', 'Enix', 'Action', 1990, 0.85, '1'],
  ['Super Street Fighter II', 4096, 'Capcom', 'Capcom', 'Fighting', 1994, 0.85, '1-2'],
]

const gba: G[] = [
  ['Advance Wars', 8192, 'Intelligent Systems', 'Nintendo', 'Strategy', 2001, 0.95, '1-4'],
  ['Advance Wars 2: Black Hole Rising', 8192, 'Intelligent Systems', 'Nintendo', 'Strategy', 2003, 0.9, '1-4'],
  ['Castlevania: Aria of Sorrow', 8192, 'Konami', 'Konami', 'Action-Adventure', 2003, 0.95, '1'],
  ['Fire Emblem', 16384, 'Intelligent Systems', 'Nintendo', 'Strategy RPG', 2003, 0.95, '1'],
  ['Golden Sun', 8192, 'Camelot', 'Nintendo', 'RPG', 2001, 0.9, '1'],
  ["Kirby & the Amazing Mirror", 8192, 'HAL Laboratory', 'Nintendo', 'Platform', 2004, 0.85, '1-4'],
  ['Mario Kart: Super Circuit', 4096, 'Intelligent Systems', 'Nintendo', 'Racing', 2001, 0.85, '1-4'],
  ['Mega Man Battle Network', 8192, 'Capcom', 'Capcom', 'Action RPG', 2001, 0.85, '1'],
  ['Metroid Fusion', 8192, 'Nintendo', 'Nintendo', 'Action-Adventure', 2002, 0.95, '1'],
  ['Metroid: Zero Mission', 8192, 'Nintendo', 'Nintendo', 'Action-Adventure', 2004, 0.9, '1'],
  ['Pokemon FireRed', 16384, 'Game Freak', 'Nintendo', 'RPG', 2004, 0.9, '1'],
  ['Pokemon Emerald', 16384, 'Game Freak', 'Nintendo', 'RPG', 2004, 0.95, '1'],
  ['Sonic Advance', 8192, 'Sonic Team', 'Sega', 'Platform', 2001, 0.8, '1'],
  ['The Legend of Zelda: The Minish Cap', 16384, 'Capcom', 'Nintendo', 'Action-Adventure', 2004, 0.9, '1'],
  ['Wario Land 4', 8192, 'Nintendo', 'Nintendo', 'Platform', 2001, 0.85, '1'],
  ['F-Zero: Maximum Velocity', 4096, 'NDcube', 'Nintendo', 'Racing', 2001, 0.75, '1'],
  ['Final Fantasy Tactics Advance', 16384, 'Square Enix', 'Square Enix', 'Strategy RPG', 2003, 0.9, '1'],
  ['Golden Sun: The Lost Age', 16384, 'Camelot', 'Nintendo', 'RPG', 2002, 0.9, '1'],
  ['Castlevania: Circle of the Moon', 8192, 'Konami', 'Konami', 'Action-Adventure', 2001, 0.85, '1'],
  ['Mega Man Zero', 8192, 'Inti Creates', 'Capcom', 'Action', 2002, 0.9, '1'],
  ['Tactics Ogre: The Knight of Lodis', 8192, 'Quest', 'Atlus', 'Strategy RPG', 2002, 0.85, '1'],
  ['Riviera: The Promised Land', 8192, 'Sting', 'Atlus', 'RPG', 2004, 0.8, '1'],
  ['Astro Boy: Omega Factor', 8192, 'Sega / THQ', 'THQ', 'Platform', 2004, 0.7, '1'],
  ['Banjo-Kazooie: Grunty\'s Revenge', 8192, 'Rare', 'THQ', 'Platform', 2003, 0.75, '1'],
  ['Pokemon Mystery Dungeon: Red Rescue Team', 16384, 'Chunsoft', 'Nintendo', 'RPG', 2005, 0.85, '1'],
]

const gb: G[] = [
  ['Tetris', 32, 'Nintendo', 'Nintendo', 'Puzzle', 1989, 1.0, '1-2'],
  ['Super Mario Land', 64, 'Nintendo', 'Nintendo', 'Platform', 1989, 0.85, '1'],
  ['Pokemon Red', 512, 'Game Freak', 'Nintendo', 'RPG', 1996, 0.95, '1'],
  ['Pokemon Blue', 512, 'Game Freak', 'Nintendo', 'RPG', 1996, 0.95, '1'],
  ["Kirby's Dream Land", 64, 'HAL Laboratory', 'Nintendo', 'Platform', 1992, 0.85, '1'],
  ["The Legend of Zelda: Link's Awakening", 256, 'Nintendo', 'Nintendo', 'Action-Adventure', 1993, 0.95, '1'],
  ['Metroid II: Return of Samus', 256, 'Nintendo', 'Nintendo', 'Action-Adventure', 1991, 0.85, '1'],
  ["Mega Man: Dr. Wily's Revenge", 128, 'Capcom', 'Capcom', 'Platform', 1991, 0.75, '1'],
  ['Donkey Kong', 256, 'Nintendo', 'Nintendo', 'Platform', 1994, 0.85, '1'],
  ['Wario Land: Super Mario Land 3', 256, 'Nintendo', 'Nintendo', 'Platform', 1994, 0.85, '1'],
  ['Kid Dracula', 128, 'Konami', 'Konami', 'Platform', 1993, 0.8, '1'],
  ["Gargoyle's Quest", 128, 'Capcom', 'Capcom', 'Action RPG', 1990, 0.8, '1'],
  ['Dr. Mario', 32, 'Nintendo', 'Nintendo', 'Puzzle', 1990, 0.8, '1-2'],
  ['Super Mario Land 2: 6 Golden Coins', 256, 'Nintendo', 'Nintendo', 'Platform', 1992, 0.9, '1'],
  ['Pokemon Yellow', 512, 'Game Freak', 'Nintendo', 'RPG', 1998, 0.9, '1'],
  ["Kirby's Dream Land 2", 256, 'HAL Laboratory', 'Nintendo', 'Platform', 1995, 0.85, '1'],
  ['Castlevania: The Adventure', 64, 'Konami', 'Konami', 'Platform', 1989, 0.65, '1'],
  ['Batman', 128, 'Sunsoft', 'Sunsoft', 'Action', 1989, 0.75, '1'],
  ['Final Fantasy Adventure', 256, 'Square', 'Square', 'Action RPG', 1991, 0.8, '1'],
  ['Mystic Quest', 256, 'Square', 'Square', 'RPG', 1992, 0.7, '1'],
  ['F-1 Race', 64, 'Nintendo', 'Nintendo', 'Racing', 1990, 0.65, '1-4'],
  ['Alleyway', 32, 'Nintendo', 'Nintendo', 'Action', 1989, 0.6, '1'],
  ['Burger Time Deluxe', 64, 'Data East', 'Data East', 'Puzzle', 1990, 0.65, '1'],
  ['Quarth', 64, 'Konami', 'Konami', 'Puzzle', 1990, 0.7, '1'],
  ['Mole Mania', 128, 'Nintendo', 'Nintendo', 'Puzzle', 1990, 0.75, '1'],
]

const gbc: G[] = [
  ['Pokemon Gold', 1024, 'Game Freak', 'Nintendo', 'RPG', 1999, 0.95, '1'],
  ['Pokemon Silver', 1024, 'Game Freak', 'Nintendo', 'RPG', 1999, 0.95, '1'],
  ['Pokemon Crystal', 1024, 'Game Freak', 'Nintendo', 'RPG', 2000, 0.95, '1'],
  ['The Legend of Zelda: Oracle of Ages', 1024, 'Capcom', 'Nintendo', 'Action-Adventure', 2001, 0.9, '1'],
  ['The Legend of Zelda: Oracle of Seasons', 1024, 'Capcom', 'Nintendo', 'Action-Adventure', 2001, 0.9, '1'],
  ['Mario Tennis', 1024, 'Camelot', 'Nintendo', 'Sports', 2000, 0.85, '1-2'],
  ['Wario Land 3', 1024, 'Nintendo', 'Nintendo', 'Platform', 2000, 0.85, '1'],
  ["Kirby Tilt 'n' Tumble", 512, 'HAL Laboratory', 'Nintendo', 'Platform', 2000, 0.8, '1'],
  ['Shantae', 2048, 'WayForward', 'Capcom', 'Platform', 2002, 0.9, '1'],
  ['Dragon Warrior Monsters', 1024, 'Enix', 'Enix', 'RPG', 1999, 0.85, '1'],
  ['Dragon Warrior Monsters 2', 1024, 'Enix', 'Enix', 'RPG', 2001, 0.8, '1'],
  ['Metal Gear Solid', 2048, 'Konami', 'Konami', 'Stealth', 2000, 0.85, '1'],
  ['Harvest Moon GBC', 1024, 'Victor', 'Natsume', 'Simulation', 2000, 0.75, '1'],
  ['Game & Watch Gallery 2', 512, 'Nintendo', 'Nintendo', 'Action', 1997, 0.8, '1'],
  ['Game & Watch Gallery 3', 512, 'Nintendo', 'Nintendo', 'Action', 1999, 0.8, '1'],
  ["Conker's Pocket Tales", 512, 'Rare', 'Rare', 'Adventure', 1999, 0.65, '1'],
  ['Resident Evil Gaiden', 1024, 'Capcom', 'Capcom', 'Survival Horror', 2001, 0.6, '1'],
  ['Rayman', 1024, 'Ubisoft', 'Ubisoft', 'Platform', 2000, 0.75, '1'],
  ['Pokemon Pinball', 512, 'Jupiter', 'Nintendo', 'Puzzle', 1999, 0.8, '1'],
  ['Super Mario Bros. Deluxe', 512, 'Nintendo', 'Nintendo', 'Platform', 1999, 0.9, '1-2'],
  ['Bionic Commando: Elite Forces', 512, 'Nintendo', 'Nintendo', 'Action', 2000, 0.7, '1'],
  ['Tetris DX', 512, 'Nintendo', 'Nintendo', 'Puzzle', 1998, 0.9, '1-2'],
  ['Survival Kids', 512, 'Konami', 'Konami', 'Adventure', 1999, 0.75, '1'],
  ['Perfect Dark', 512, 'Rare', 'Nintendo', 'Action', 2000, 0.65, '1'],
  ['Alone in the Dark: The New Nightmare', 1024, 'Infogrames', 'Infogrames', 'Survival Horror', 2001, 0.55, '1'],
]

const psx: G[] = [
  ['Final Fantasy VII', 614400, 'Square', 'Sony', 'RPG', 1997, 1.0, '1'],
  ['Final Fantasy VIII', 614400, 'Square', 'Square', 'RPG', 1999, 0.9, '1'],
  ['Final Fantasy IX', 614400, 'Square', 'Square', 'RPG', 2000, 0.95, '1'],
  ['Castlevania: Symphony of the Night', 409600, 'Konami', 'Konami', 'Action-Adventure', 1997, 1.0, '1'],
  ['Metal Gear Solid', 614400, 'Konami', 'Konami', 'Stealth', 1998, 1.0, '1'],
  ['Crash Bandicoot', 409600, 'Naughty Dog', 'Sony', 'Platform', 1996, 0.85, '1'],
  ['Spyro the Dragon', 409600, 'Insomniac', 'Sony', 'Platform', 1998, 0.85, '1'],
  ['Resident Evil 2', 614400, 'Capcom', 'Capcom', 'Survival Horror', 1998, 0.95, '1'],
  ['Silent Hill', 614400, 'Konami', 'Konami', 'Survival Horror', 1999, 0.9, '1'],
  ['Tekken 3', 409600, 'Namco', 'Namco', 'Fighting', 1998, 0.9, '1-2'],
  ['Gran Turismo', 614400, 'Polyphony Digital', 'Sony', 'Racing', 1997, 0.9, '1-2'],
  ["Tony Hawk's Pro Skater", 409600, 'Neversoft', 'Activision', 'Sports', 1999, 0.9, '1-2'],
  ['Chrono Cross', 614400, 'Square', 'Square', 'RPG', 1999, 0.9, '1'],
  ['Vagrant Story', 409600, 'Square', 'Square', 'Action RPG', 2000, 0.9, '1'],
  ['Xenogears', 614400, 'Square', 'Square', 'RPG', 1998, 0.9, '1'],
  ['Wild Arms', 409600, 'Media Vision', 'Sony', 'RPG', 1996, 0.8, '1'],
  ['Parasite Eve', 614400, 'Square', 'Square', 'Action RPG', 1998, 0.85, '1'],
  ['Suikoden II', 409600, 'Konami', 'Konami', 'RPG', 1998, 0.95, '1'],
  ['Dino Crisis', 409600, 'Capcom', 'Capcom', 'Survival Horror', 1999, 0.8, '1'],
  ['Legacy of Kain: Soul Reaver', 614400, 'Crystal Dynamics', 'Eidos', 'Action-Adventure', 1999, 0.85, '1'],
  ['Twisted Metal 2', 409600, 'SingleTrac', 'Sony', 'Action', 1996, 0.85, '1-2'],
  ['Crash Bandicoot 2', 409600, 'Naughty Dog', 'Sony', 'Platform', 1997, 0.9, '1'],
  ['Spyro 2: Ripto\'s Rage', 409600, 'Insomniac', 'Sony', 'Platform', 1999, 0.85, '1'],
  ['Medievil', 409600, 'SCE', 'Sony', 'Action-Adventure', 1998, 0.8, '1'],
  ['Persona 2: Eternal Punishment', 614400, 'Atlus', 'Atlus', 'RPG', 2000, 0.85, '1'],
]

const genesis: G[] = [
  ['Sonic the Hedgehog', 512, 'Sonic Team', 'Sega', 'Platform', 1991, 0.95, '1'],
  ['Sonic the Hedgehog 2', 1024, 'Sonic Team', 'Sega', 'Platform', 1992, 0.95, '1-2'],
  ['Sonic the Hedgehog 3', 2048, 'Sonic Team', 'Sega', 'Platform', 1994, 0.9, '1-2'],
  ['Streets of Rage 2', 2048, 'Sega', 'Sega', 'Beat em Up', 1992, 0.95, '1-2'],
  ['Golden Axe', 1024, 'Sega', 'Sega', 'Beat em Up', 1989, 0.85, '1-2'],
  ['Phantasy Star IV', 2048, 'Sega', 'Sega', 'RPG', 1993, 0.9, '1'],
  ['Shining Force II', 2048, 'Sega', 'Sega', 'Strategy RPG', 1993, 0.9, '1'],
  ['Gunstar Heroes', 2048, 'Treasure', 'Sega', 'Run and Gun', 1993, 0.95, '1-2'],
  ['Castlevania: Bloodlines', 1024, 'Konami', 'Konami', 'Platform', 1994, 0.85, '1'],
  ['Contra: Hard Corps', 2048, 'Konami', 'Konami', 'Run and Gun', 1994, 0.9, '1-2'],
  ['Rocket Knight Adventures', 1024, 'Konami', 'Konami', 'Platform', 1993, 0.85, '1'],
  ['Vectorman', 2048, 'BlueSky Software', 'Sega', 'Run and Gun', 1995, 0.8, '1'],
  ['Mortal Kombat II', 2048, 'Acclaim', 'Acclaim', 'Fighting', 1994, 0.8, '1-2'],
  ['Earthworm Jim', 2048, 'Shiny Entertainment', 'Playmates', 'Platform', 1994, 0.85, '1'],
  ["Disney's Aladdin", 1024, 'Virgin Games', 'Sega', 'Platform', 1993, 0.85, '1'],
  ['The Lion King', 1024, 'Westwood Studios', 'Virgin', 'Platform', 1994, 0.75, '1'],
  ['Ecco the Dolphin', 1024, 'Novotrade', 'Sega', 'Action-Adventure', 1992, 0.75, '1'],
  ['Comix Zone', 2048, 'Sega', 'Sega', 'Beat em Up', 1995, 0.85, '1'],
  ['Ristar', 1024, 'Sega', 'Sega', 'Platform', 1995, 0.85, '1'],
  ['Road Rash 3', 4096, 'EA', 'EA', 'Racing', 1995, 0.75, '1-2'],
  ['Desert Strike', 1024, 'EA', 'EA', 'Strategy', 1992, 0.8, '1'],
  ['ToeJam & Earl', 1024, 'Johnson/Rees', 'Sega', 'Adventure', 1991, 0.8, '1-2'],
  ['Strider', 1024, 'Capcom', 'Capcom', 'Action', 1990, 0.8, '1'],
  ['Altered Beast', 512, 'Sega', 'Sega', 'Beat em Up', 1988, 0.65, '1-2'],
  ['X-Men', 1024, 'Sega', 'Sega', 'Beat em Up', 1993, 0.75, '1-2'],
]

const n64: G[] = [
  ['Super Mario 64', 8192, 'Nintendo', 'Nintendo', 'Platform', 1996, 1.0, '1'],
  ['The Legend of Zelda: Ocarina of Time', 32768, 'Nintendo', 'Nintendo', 'Action-Adventure', 1998, 1.0, '1'],
  ["The Legend of Zelda: Majora's Mask", 32768, 'Nintendo', 'Nintendo', 'Action-Adventure', 2000, 0.95, '1'],
  ['GoldenEye 007', 32768, 'Rare', 'Nintendo', 'First-Person Shooter', 1997, 0.95, '1-4'],
  ['Banjo-Kazooie', 32768, 'Rare', 'Nintendo', 'Platform', 1998, 0.95, '1'],
  ['Banjo-Tooie', 32768, 'Rare', 'Nintendo', 'Platform', 2000, 0.9, '1'],
  ['Star Fox 64', 8192, 'Nintendo', 'Nintendo', 'Shooter', 1997, 0.9, '1-4'],
  ['Mario Kart 64', 8192, 'Nintendo', 'Nintendo', 'Racing', 1996, 0.9, '1-4'],
  ['Paper Mario', 32768, 'Intelligent Systems', 'Nintendo', 'RPG', 2000, 0.9, '1'],
  ['Donkey Kong 64', 32768, 'Rare', 'Nintendo', 'Platform', 1999, 0.85, '1'],
  ['Kirby 64: The Crystal Shards', 8192, 'HAL Laboratory', 'Nintendo', 'Platform', 2000, 0.85, '1-4'],
  ['F-Zero X', 8192, 'Nintendo', 'Nintendo', 'Racing', 1998, 0.9, '1-4'],
  ['Diddy Kong Racing', 32768, 'Rare', 'Nintendo', 'Racing', 1997, 0.85, '1-4'],
  ["Conker's Bad Fur Day", 32768, 'Rare', 'Rare', 'Platform', 2001, 0.9, '1-4'],
  ['Wave Race 64', 8192, 'Nintendo', 'Nintendo', 'Sports', 1996, 0.85, '1-2'],
  ["1080° Snowboarding", 8192, 'Nintendo', 'Nintendo', 'Sports', 1998, 0.8, '1-2'],
  ['Pokemon Snap', 8192, 'HAL Laboratory', 'Nintendo', 'Simulation', 1999, 0.8, '1'],
  ['Super Smash Bros.', 8192, 'HAL Laboratory', 'Nintendo', 'Fighting', 1999, 0.9, '1-4'],
  ['Pilotwings 64', 8192, 'Nintendo', 'Nintendo', 'Simulation', 1996, 0.8, '1'],
  ['Turok: Dinosaur Hunter', 32768, 'Iguana Entertainment', 'Acclaim', 'First-Person Shooter', 1997, 0.75, '1'],
  ['Jet Force Gemini', 32768, 'Rare', 'Nintendo', 'Third-Person Shooter', 1999, 0.8, '1-2'],
  ['Bomberman 64', 8192, 'Hudson Soft', 'Hudson Soft', 'Action', 1997, 0.75, '1-4'],
  ["Yoshi's Story", 8192, 'Nintendo', 'Nintendo', 'Platform', 1997, 0.75, '1'],
  ['Perfect Dark', 32768, 'Rare', 'Nintendo', 'First-Person Shooter', 2000, 0.9, '1-4'],
  ['Body Harvest', 32768, 'DMA Design', 'Midway', 'Action-Adventure', 1998, 0.7, '1'],
]

let _idx = 0
function nextItems(console: ConsoleId, games: G[]): LibraryItem[] {
  const start = _idx
  _idx += games.length
  return makeItems(console, games, start)
}

export const LIBRARY: LibraryItem[] = [
  ...nextItems('nes', nes),
  ...nextItems('snes', snes),
  ...nextItems('gba', gba),
  ...nextItems('gb', gb),
  ...nextItems('gbc', gbc),
  ...nextItems('psx', psx),
  ...nextItems('genesis', genesis),
  ...nextItems('n64', n64),
]
