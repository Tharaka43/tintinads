import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OutreachController::getData
 * @see app/Http/Controllers/OutreachController.php:50
 * @route '/api/outreach/data'
 */
export const getData = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getData.url(options),
    method: 'get',
})

getData.definition = {
    methods: ["get","head"],
    url: '/api/outreach/data',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OutreachController::getData
 * @see app/Http/Controllers/OutreachController.php:50
 * @route '/api/outreach/data'
 */
getData.url = (options?: RouteQueryOptions) => {
    return getData.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OutreachController::getData
 * @see app/Http/Controllers/OutreachController.php:50
 * @route '/api/outreach/data'
 */
getData.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getData.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OutreachController::getData
 * @see app/Http/Controllers/OutreachController.php:50
 * @route '/api/outreach/data'
 */
getData.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getData.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OutreachController::getData
 * @see app/Http/Controllers/OutreachController.php:50
 * @route '/api/outreach/data'
 */
    const getDataForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getData.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OutreachController::getData
 * @see app/Http/Controllers/OutreachController.php:50
 * @route '/api/outreach/data'
 */
        getDataForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getData.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OutreachController::getData
 * @see app/Http/Controllers/OutreachController.php:50
 * @route '/api/outreach/data'
 */
        getDataForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getData.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getData.form = getDataForm
/**
* @see \App\Http\Controllers\OutreachController::markMessage
 * @see app/Http/Controllers/OutreachController.php:143
 * @route '/api/outreach/mark'
 */
export const markMessage = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markMessage.url(options),
    method: 'post',
})

markMessage.definition = {
    methods: ["post"],
    url: '/api/outreach/mark',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OutreachController::markMessage
 * @see app/Http/Controllers/OutreachController.php:143
 * @route '/api/outreach/mark'
 */
markMessage.url = (options?: RouteQueryOptions) => {
    return markMessage.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OutreachController::markMessage
 * @see app/Http/Controllers/OutreachController.php:143
 * @route '/api/outreach/mark'
 */
markMessage.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markMessage.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OutreachController::markMessage
 * @see app/Http/Controllers/OutreachController.php:143
 * @route '/api/outreach/mark'
 */
    const markMessageForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markMessage.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OutreachController::markMessage
 * @see app/Http/Controllers/OutreachController.php:143
 * @route '/api/outreach/mark'
 */
        markMessageForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markMessage.url(options),
            method: 'post',
        })
    
    markMessage.form = markMessageForm
/**
* @see \App\Http\Controllers\OutreachController::sendGatewayMessage
 * @see app/Http/Controllers/OutreachController.php:181
 * @route '/api/outreach/send-gateway'
 */
export const sendGatewayMessage = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendGatewayMessage.url(options),
    method: 'post',
})

sendGatewayMessage.definition = {
    methods: ["post"],
    url: '/api/outreach/send-gateway',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OutreachController::sendGatewayMessage
 * @see app/Http/Controllers/OutreachController.php:181
 * @route '/api/outreach/send-gateway'
 */
sendGatewayMessage.url = (options?: RouteQueryOptions) => {
    return sendGatewayMessage.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OutreachController::sendGatewayMessage
 * @see app/Http/Controllers/OutreachController.php:181
 * @route '/api/outreach/send-gateway'
 */
sendGatewayMessage.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendGatewayMessage.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OutreachController::sendGatewayMessage
 * @see app/Http/Controllers/OutreachController.php:181
 * @route '/api/outreach/send-gateway'
 */
    const sendGatewayMessageForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: sendGatewayMessage.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OutreachController::sendGatewayMessage
 * @see app/Http/Controllers/OutreachController.php:181
 * @route '/api/outreach/send-gateway'
 */
        sendGatewayMessageForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: sendGatewayMessage.url(options),
            method: 'post',
        })
    
    sendGatewayMessage.form = sendGatewayMessageForm
const OutreachController = { getData, markMessage, sendGatewayMessage }

export default OutreachController