import { exec, ExecOptions } from 'child_process'

// gsettings list-recursively org.gnome.system.proxy

export const unsetProxy = async () => {
  const result = await execAsync(
    'gsettings set org.gnome.system.proxy mode none'
  )
  return result.code === 0
}

export const setPacProxy = async (url: string) => {
  const autoSet = await execAsync(
    'gsettings set org.gnome.system.proxy mode auto'
  )
  const urlSet = await execAsync(
    `gsettings set org.gnome.system.proxy autoconfig-url '${url}'`
  )
  return autoSet.code === 0 && urlSet.code === 0
}

export const setGlobalProxy = async (host: string, port: number) => {
  const manualSet = await execAsync(
    'gsettings set org.gnome.system.proxy mode manual'
  )
  const hostSet = await execAsync(
    `gsettings set org.gnome.system.proxy.http host '${host}'`
  )
  const portSet = await execAsync(
    `gsettings set org.gnome.system.proxy.http port ${port}`
  )
  const hostSetS = await execAsync(
    `gsettings set org.gnome.system.proxy.https host '${host}'`
  )
  const portSetS = await execAsync(
    `gsettings set org.gnome.system.proxy.https port ${port}`
  )

  const httpEnabled = await execAsync(
    'gsettings set org.gnome.system.proxy.http enabled true'
  )
  const bypassSet = await execAsync(
    'gsettings set org.gnome.system.proxy ignore-hosts "[\'*avito.ru\']"'
  )
  return (
    httpEnabled.code === 0 &&
      manualSet.code === 0 &&
      hostSet.code === 0 &&
      portSet.code === 0 &&
      portSetS.code === 0 &&
      hostSetS.code === 0
      && bypassSet.code === 0
  )
}

export const execAsync = (command: string, options?: ExecOptions) => {
  return new Promise<{
      code: number;
      stdout?: string;
      stderr?: string;
    }>((resolve, reject) => {
      exec(command, { ...options, windowsHide: true }, (err, stdout, stderr) => {
        if (!stderr) {
          resolve({
            code: err ? 1 : 0,
            stdout
          })
        } else {
          reject({
            code: err ? 1 : 0,
            stderr
          })
        }
      })
    })
}

const ignoredHosts = ['*avito.ru']