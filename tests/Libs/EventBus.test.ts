import { EventBus } from '../../src/Libs/EventBus';


describe('Event Bus test', () => {
    it('get event', () => {

        expect(true).toBe(true)
        EventBus.getInstance().register('hello-world', (name: string) => {
            if (name) {
                expect(name).toBe('Luis');
            }else{
                expect(name).toBe(undefined);
            }
        });

        EventBus.getInstance().dispatch<string>('hello-world', 'Luis');
        EventBus.getInstance().dispatch<string>('hello-world');
    })
})