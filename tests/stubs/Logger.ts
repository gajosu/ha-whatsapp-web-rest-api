import { ILogger } from '../../src/Libs/Logger'

const mockLogger: ILogger = {
    getCategoryLogger: jest.fn().mockImplementation(() => mockLogger),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
}

jest.mock('../../src/Libs/Logger', () => {
    return jest.fn().mockImplementation(() => {
        return mockLogger
    })
})

export default mockLogger
