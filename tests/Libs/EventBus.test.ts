import { EventBus } from '../../src/Libs/EventBus'

describe('Event Bus test', () => {
    it('get event', () => {
        let count = 0
        const eventBus = new EventBus()

        const registry = eventBus.register('hello-world', (name: string | undefined) => {
            if (name !== undefined) {
                expect(name).toBe('Luis')
            } else {
                expect(name).toBe(undefined)
            }

            count++
        })

        eventBus.dispatch<string>('hello-world', 'Luis')
        eventBus.dispatch<string>('hello-world')
        registry.unregister()
        eventBus.dispatch<string>('hello-world')

        expect(count).toBe(2)
    })
})
