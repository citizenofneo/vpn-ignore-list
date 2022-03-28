const api: {
    sendToMain: (_cmd: string, _data?: any) => void,
    onFromMain: (_cmd: string, _cb?: (data: any) => void) => void
} = (window as unknown as any).electron

export default api