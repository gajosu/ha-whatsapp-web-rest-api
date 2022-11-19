const mockConfig = jest.fn()

jest.mock('../../src/config/GlobalConfig', () => {
    return mockConfig
})

export default mockConfig
