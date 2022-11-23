
export function findCallback (mock: any, name: string): Function {
    return mock.calls.find((call: any) => call[0] === name)[1]
}
