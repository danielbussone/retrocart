import type { Collection } from '../types'
import { LIBRARY } from './library'
import { MIYOO_ID, RP6_ID } from './devices'

function itemsWhere(pred: (t: string, g: string) => boolean): string[] {
  return LIBRARY.filter(i => pred(i.title, i.genre)).map(i => i.id)
}

export const COLLECTIONS: Collection[] = [
  {
    id: 'col-favorites',
    name: 'All-Time Favorites',
    itemIds: itemsWhere((t) =>
      [
        'Super Mario Bros.', 'The Legend of Zelda', 'Chrono Trigger', 'Final Fantasy VII',
        'Super Metroid', 'Castlevania: Symphony of the Night', 'Metal Gear Solid',
        'The Legend of Zelda: Ocarina of Time', "The Legend of Zelda: A Link to the Past",
        'Sonic the Hedgehog 2', 'Streets of Rage 2', 'Advance Wars', 'EarthBound',
        'Gunstar Heroes', 'Mega Man 2', 'Super Mario 64', 'GoldenEye 007',
        'Suikoden II', 'Final Fantasy VI', 'Contra',
      ].includes(t)
    ),
    deviceIds: [MIYOO_ID, RP6_ID],
    color: '#514689',
  },
  {
    id: 'col-rpg',
    name: 'RPG Marathon',
    itemIds: itemsWhere((_t, g) => g === 'RPG' || g === 'Action RPG' || g === 'Strategy RPG'),
    deviceIds: [RP6_ID],
    color: '#58a6ff',
  },
  {
    id: 'col-coop',
    name: 'Weekend Warriors',
    itemIds: itemsWhere((_t, g, ) =>
      ['Beat em Up', 'Run and Gun', 'Fighting', 'Sports', 'Racing'].includes(g)
    ).slice(0, 20),
    deviceIds: [MIYOO_ID, RP6_ID],
    color: '#3fb950',
  },
  {
    id: 'col-mega-man',
    name: 'Mega Man Madness',
    itemIds: itemsWhere((t) => t.startsWith('Mega Man')),
    deviceIds: [MIYOO_ID],
    color: '#f85149',
  },
]
