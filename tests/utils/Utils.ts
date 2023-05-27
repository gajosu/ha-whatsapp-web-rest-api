
export function findCallback (mock: any, name: string): (...args: any[]) => void | Promise<void> {
    return mock.calls.find((call: any) => call[0] === name)[1]
}
