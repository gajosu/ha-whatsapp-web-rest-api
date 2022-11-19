const mockEventPublisher = {
    publish: jest.fn()
}

jest.mock('../../src/Services/HomeAssistant/EventPublisher', () => {
    return jest.fn().mockImplementation(() => {
        return mockEventPublisher
    })
})

export default mockEventPublisher
