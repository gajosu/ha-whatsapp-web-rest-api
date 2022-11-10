import { EventBus } from '../../src/Libs/EventBus';


describe('Event Bus test', () => {
    it('get event', () => {
        let count = 0;

        const registry = EventBus.getInstance().register('hello-world', (name: string) => {
            if (name) {
                expect(name).toBe('Luis');
            } else {
                expect(name).toBe(undefined);
            }

            count++;
        });

        EventBus.getInstance().dispatch<string>('hello-world', 'Luis');
        EventBus.getInstance().dispatch<string>('hello-world');

        registry.unregister();
        EventBus.getInstance().dispatch<string>('hello-world');

        expect(count).toBe(2);
    })
})