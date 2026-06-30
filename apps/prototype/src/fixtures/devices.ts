import type { Device } from '../types'
import { MIYOO_ID, RP6_ID } from './library'

export { MIYOO_ID, RP6_ID }

export const DEVICES: Device[] = [
  {
    id: MIYOO_ID,
    name: 'Miyoo Mini Plus',
    frontendType: 'onion',
    storageBytesTotal: 64 * 1024 * 1024 * 1024,
    mountLabelHint: 'MIYOO',
    mockMountPath: 'E:\\',
  },
  {
    id: RP6_ID,
    name: 'Retroid Pocket 6',
    frontendType: 'esde',
    storageBytesTotal: 256 * 1024 * 1024 * 1024,
    mountLabelHint: 'ROMS',
    mockMountPath: 'F:\\',
  },
]
