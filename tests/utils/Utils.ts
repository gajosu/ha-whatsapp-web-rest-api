
export function findCallback (mock: any, name: string): (...args: any[]) => void {
    return mock.calls.find((call: any) => call[0] === name)[1]
}

export function findAsyncCallback (mock: any, name: string): (...args: any[]) => Promise<void> {
    return mock.calls.find((call: any) => call[0] === name)[1]
}
