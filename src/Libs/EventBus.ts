export interface Registry {
    unregister: () => void
}

export interface Callable {
    listener: (...args: any[]) => void
}

export interface Subscriber extends Map<string, Map<number, Callable>> { }

export interface IEventBus {
    dispatch: <T>(event: string, arg?: T) => void
    register: (event: string, callback: (...args: any[]) => void) => Registry
}

export class EventBus implements IEventBus {
    private readonly subscribers: Subscriber
    private static nextId = 0

    public constructor () {
        this.subscribers = new Map()
    }

    public dispatch<T>(event: string, arg?: T): void {
        const subscriber = this.subscribers.get(event)

        if (subscriber === undefined) {
            return
        }

        subscriber.forEach((callback) => {
            callback.listener(arg)
        })
    }

    public register (event: string, callback: (...args: any[]) => void): Registry {
        const id = this.getNextId()

        if (!this.subscribers.has(event)) {
            this.subscribers.set(event, new Map())
        }

        const subscriber = this.subscribers.get(event)!
        subscriber.set(id, { listener: callback })

        return {
            unregister: () => {
                // delete listener
                this.subscribers.get(event)?.delete(id)
                if (this.subscribers.get(event)?.size === 0) {
                    // delete event
                    this.subscribers.delete(event)
                }
            }
        }
    }

    private getNextId (): number {
        return EventBus.nextId++
    }
}
