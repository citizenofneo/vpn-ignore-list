export default class Io {

  private readonly nativeApi: Api
  private listenners: { [key: string]: (data: any, cb: (d: any) => void) => void } = {}
  private _id = 0

  constructor (nativeApi_: Api) {
    this.nativeApi = nativeApi_
    nativeApi_.onFrom('_io', (data_: IoConnect) => {
      const { data, cmd, _id } = data_
      if (!this.listenners[cmd as string]) {
        return console.log('dont listen', cmd)
      }
      this.listenners[cmd as string](data, (data: any) => nativeApi_.sendTo(cmd + '_' + _id + '_io', data))
    })
  }

  emit (cmd: string, data?: any, cb?: (aData: any) => void) {
    this.nativeApi.sendTo('_io', { cmd, _id: this._id, data } as IoConnect)
    cb && (this.nativeApi.onceFrom || this.nativeApi?.onFrom)(cmd + '_' + this._id + '_io', cb)
    this._id++
  }

  on (cmd: string, cb: (data: any, cbB: (aData: any) => void) => void) {
    this.listenners[cmd] = (data, cbB) => cb && cb(data, cbB)
  }
}

export type Api = {
  sendTo: (_cmd: string, _data?: any) => void,
  onFrom: (_cmd: string, _cb?: (data: any) => void) => void,
  onceFrom?: (_cmd: string, _cb?: (data: any) => void) => void
}

type IoConnect = { cmd: string, _id: number, data?: any }