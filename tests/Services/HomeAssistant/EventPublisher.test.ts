import mockFetch from '../../stubs/Fetch'
import mockLogger from '../../stubs/Logger'
import EventPublisher from '../../../src/Services/HomeAssistant/EventPublisher'

function assertSendEvent (event: string, data: any, supervisorToken: string): void {
    expect(mockFetch).toHaveBeenCalledWith(`http://supervisor/core/api/events/${event}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${supervisorToken}`
        },
        body: JSON.stringify(data)
    })
}

describe('HA Event Publisher', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('returns 200', async () => {
        mockFetch.mockResolvedValue({
            status: 200,
            statusText: 'OK'
        })

        const publisher = new EventPublisher(mockLogger)
        await publisher.publish('test_event', { test: 'test' }, 'test_token')

        expect(mockLogger.info).toBeCalledWith('Event test_event published to Home Assistant')
        assertSendEvent('test_event', { test: 'test' }, 'test_token')
    })

    it('returns 500', async () => {
        mockFetch.mockResolvedValue({
            status: 500,
            statusText: 'Internal Server Error'
        })

        const publisher = new EventPublisher(mockLogger)
        await publisher.publish('test_event', { test: 'test' }, 'test_token')

        assertSendEvent('test_event', { test: 'test' }, 'test_token')
        expect(mockLogger.error).toBeCalledWith('Error publishing event test_event to Home Assistant: Internal Server Error')
    })

    it('throws error', async () => {
        mockFetch.mockRejectedValue(new Error('Test Error'))

        const publisher = new EventPublisher(mockLogger)
        await publisher.publish('test_event', { test: 'test' }, 'test_token')

        assertSendEvent('test_event', { test: 'test' }, 'test_token')
        expect(mockLogger.error).toBeCalledWith('Error sending event to Home Assistant', new Error('Test Error'))
    })
})
