import linux from './linux'
import darwin from './darwin'
import win32 from './win32'
import { Platform } from './../../types'

export default {
  linux,
  darwin,
  win32
} as {[key in Platform]: typeof linux}