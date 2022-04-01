import Io, { Api } from '../Io'
const api: Api = (window as unknown as any).electron
export default new Io(api)

// const io = new Io(api)

// setTimeout(() => {
//   io.emit('testOnUi', { a: 6 }, data => {
//     console.log('IM GET BACK!!!!', 'testOnUi', data)
//   })
// }, 1000)
// setTimeout(() => {
//   io.emit('testOnUix', { a: 8 }, data => {
//     console.log('IM GET BACK 222 !!!!!', 'testOnUix', data)
//   })
// }, 2000)