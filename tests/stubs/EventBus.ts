const mockEventBus = {
    dispatch: jest.fn(),
    register: jest.fn().mockImplementation(() => {
        return {
            unregister: jest.fn()
        }
    })
}

jest.mock('../../src/Libs/EventBus', () => {
    return {
        EventBus: {
            getInstance: jest.fn().mockImplementation(() => {
                return mockEventBus
            })
        }
    }
})

export default mockEventBus
