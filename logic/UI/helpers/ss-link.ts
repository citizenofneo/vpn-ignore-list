import 'url-search-params-polyfill'

interface Ishadowsocks {
    host: string,
    port: number,
    password: string,
    method: string,
    name?: string
}

export interface SsConfig extends Ishadowsocks {
    plugin?: string,
    plugin_param?: string,
}

export interface SsrConfig extends Ishadowsocks {
    protocol: string,
    protocol_param?: string,
    obfs: string,
    obfs_param?: string,
    group?: string
}

class base64 {
  static encode (string: string): string {
    return btoa(string || '')
  }

  static decode (base64String: string): string {
    return atob(base64String || '')
  }
}

const { encode, decode } = base64

export default class SsUrl {
  static genSS (config: SsConfig): string {

    const settings = `${encode(`${config.method}:${config.password}`)}`
    const hostname = `${config.host}:${config.port}`

    let name = ''
    let plugin = ''

    if (config.plugin) {
      plugin = `?plugin=${config.plugin}`
    }

    if (config.plugin && config.plugin_param) {
      plugin = plugin + encodeURIComponent(';' + config.plugin_param)
    }

    if (config.name) {
      name = '#' + encodeURI(config.name ? config.name : '')
    }

    return `ss://${settings}@${hostname}${plugin}${name}`
  }

  static genSSR (config: SsrConfig): string {

    const hostname = `${config.host}:${config.port}`
    const settings = `${config.protocol}:${config.method}:${encode(config.obfs)}:${config.password}`
    const params: string =
            '?obfsparam=' + encode(config.obfs_param as string) +
            '&protoparam=' + encode(config.protocol_param as string) +
            '&remarks=' + encode(config.name as string) +
            '&group=' + encode(config.group as string)

    const URI = `${hostname}:${settings}/${params}`

    return 'ssr://' + encode(URI)
  }

  static parseSS (url: string): SsConfig | false {
    try {

      const URI = url.replace('ss://', '').split('@')
      const params = new URLSearchParams(URI[1].split('?')[1])
      const parsedURL: SsConfig = {
        method: /* ------*/ decode(URI[0])
          .split(':')[0],

        password: /* ----*/ decode(URI[0])
          .split(':')[1],

        host: /* ------*/ URI[1]
          .split('#')[0]
          .split(':')[0],

        port: /* -*/ Number(URI[1]
          .split('#')[0]
          .split(':')[1]
          .split('?')[0])

      }

      const name = URI[1].split('#')[1]
      if (name) { parsedURL.name = decodeURI(name) }

      if (params.has('plugin')) {

        parsedURL.plugin = params.get('plugin')?.split(';')[0]

        const pluginRaramEncoded: string = URI[1].split('?')[1]
          .split('#')[0]

        if (pluginRaramEncoded) {

          parsedURL.plugin_param = decodeURIComponent(pluginRaramEncoded)
          // "plugin=v2ray;" <<< path=/v2ray/;host=example.com;tls
            .replace(`plugin=${parsedURL.plugin};`, '')
        }
      }

      return parsedURL
    } catch (error) {
      return false
    }
  }

  static parseSSR (url: string): SsrConfig {
    const URI = decode(url.replace('ssr://', '')).split(':')
    const params = new URLSearchParams(URI[5].split('/')[1])
    return {
      host: /* ---------*/ URI[0],
      port: /* ----*/ Number(URI[1]),
      protocol: /* -------*/ URI[2],
      method: /* ---------*/ URI[3],
      obfs: /* -----------*/ decode(URI[4]),
      password: /* -------*/ URI[5].split('/')[0],
      name: /* -----------*/ decode(params.get('remarks') as string),
      obfs_param: /* -----*/ decode(params.get('obfsparam') as string),
      protocol_param: /* -*/ decode(params.get('protoparam') as string),
      group: /* ----------*/ decode(params.get('group') as string)
    }
  }
}