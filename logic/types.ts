export type ServerConfig = {
    host: string,
    port: number,
    password: string,
    method: string,
    isActivated?: boolean,
    isWaitConnection?: boolean,
}
export type Platform = 'linux' | 'darwin' | 'win32' | 'android' | 'ios'