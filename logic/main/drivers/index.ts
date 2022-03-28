import linux from './linux'
import mac from './mac'
import win from './win'
import { Platform } from './types'

export default {
  linux,
  mac,
  win
} as {[key in Platform]: typeof linux}