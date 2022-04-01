export type ServerConfig = {
    host: string,
    port: number,
    password: string,
    method: string,
    isActivated?: boolean,
    isWaitConnection?: boolean,
}