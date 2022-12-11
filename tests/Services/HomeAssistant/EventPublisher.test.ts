import mockFetch from '../../stubs/Fetch'
import mockLogger from '../../stubs/Logger'
import EventPublisher from '../../../src/Services/HomeAssistant/EventPublisher'

const supervisorToken = 'token'
const haBaseUrl = 'http://ha:8123'

function assertSendEvent (event: string, data: any, baseUrl?: string): void {
    baseUrl = baseUrl ?? 'http://supervisor/core'

    expect(mockFetch).toHaveBeenCalledWith(`${baseUrl}/api/events/${event}`, {
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

    it('send to supervisord', async () => {
        mockFetch.mockResolvedValue({
            status: 200,
            statusText: 'OK'
        })

        const publisher = new EventPublisher(mockLogger, supervisorToken)
        await publisher.publish('test_event', { test: 'test' })

        expect(mockLogger.debug).toBeCalledWith('Event test_event published to Home Assistant')
        assertSendEvent('test_event', { test: 'test' })
    })

    it('send to HA', async () => {
        mockFetch.mockResolvedValue({
            status: 200,
            statusText: 'OK'
        })

        const publisher = new EventPublisher(mockLogger, supervisorToken, haBaseUrl)
        await publisher.publish('test_event', { test: 'test' })

        expect(mockLogger.debug).toBeCalledWith('Event test_event published to Home Assistant')
        assertSendEvent('test_event', { test: 'test' }, haBaseUrl)
    })

    it('returns 500', async () => {
        mockFetch.mockResolvedValue({
            status: 500,
            statusText: 'Internal Server Error'
        })

        const publisher = new EventPublisher(mockLogger, supervisorToken)
        await publisher.publish('test_event', { test: 'test' })

        assertSendEvent('test_event', { test: 'test' })
        expect(mockLogger.error).toBeCalledWith('Error publishing event test_event to Home Assistant: Internal Server Error')
    })

    it('throws error', async () => {
        mockFetch.mockRejectedValue(new Error('Test Error'))

        const publisher = new EventPublisher(mockLogger, supervisorToken)
        await publisher.publish('test_event', { test: 'test' })

        assertSendEvent('test_event', { test: 'test' })
        expect(mockLogger.error).toBeCalledWith('Error sending event to Home Assistant', new Error('Test Error'))
    })
})
