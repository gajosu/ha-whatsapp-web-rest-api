
export const app = {
    get: jest.fn(),
    use: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    listen: jest.fn()
}

export const server = {
    listen: jest.fn()
}

jest.mock('../../src/config/HttpServer', () => {
    return {
        getHttpServer: () => ({
            app,
            server
        })
    }
})
