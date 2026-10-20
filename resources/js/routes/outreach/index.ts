import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\OutreachController::data
 * @see app/Http/Controllers/OutreachController.php:50
 * @route '/api/outreach/data'
 */
export const data = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: data.url(options),
    method: 'get',
})

data.definition = {
    methods: ["get","head"],
    url: '/api/outreach/data',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OutreachController::data
 * @see app/Http/Controllers/OutreachController.php:50
 * @route '/api/outreach/data'
 */
data.url = (options?: RouteQueryOptions) => {
    return data.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OutreachController::data
 * @see app/Http/Controllers/OutreachController.php:50
 * @route '/api/outreach/data'
 */
data.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: data.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OutreachController::data
 * @see app/Http/Controllers/OutreachController.php:50
 * @route '/api/outreach/data'
 */
data.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: data.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OutreachController::data
 * @see app/Http/Controllers/OutreachController.php:50
 * @route '/api/outreach/data'
 */
    const dataForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: data.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OutreachController::data
 * @see app/Http/Controllers/OutreachController.php:50
 * @route '/api/outreach/data'
 */
        dataForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: data.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OutreachController::data
 * @see app/Http/Controllers/OutreachController.php:50
 * @route '/api/outreach/data'
 */
        dataForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: data.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    data.form = dataForm
/**
* @see \App\Http\Controllers\OutreachController::mark
 * @see app/Http/Controllers/OutreachController.php:143
 * @route '/api/outreach/mark'
 */
export const mark = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: mark.url(options),
    method: 'post',
})

mark.definition = {
    methods: ["post"],
    url: '/api/outreach/mark',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OutreachController::mark
 * @see app/Http/Controllers/OutreachController.php:143
 * @route '/api/outreach/mark'
 */
mark.url = (options?: RouteQueryOptions) => {
    return mark.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OutreachController::mark
 * @see app/Http/Controllers/OutreachController.php:143
 * @route '/api/outreach/mark'
 */
mark.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: mark.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OutreachController::mark
 * @see app/Http/Controllers/OutreachController.php:143
 * @route '/api/outreach/mark'
 */
    const markForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: mark.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OutreachController::mark
 * @see app/Http/Controllers/OutreachController.php:143
 * @route '/api/outreach/mark'
 */
        markForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: mark.url(options),
            method: 'post',
        })
    
    mark.form = markForm
/**
* @see \App\Http\Controllers\OutreachController::sendGateway
 * @see app/Http/Controllers/OutreachController.php:181
 * @route '/api/outreach/send-gateway'
 */
export const sendGateway = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendGateway.url(options),
    method: 'post',
})

sendGateway.definition = {
    methods: ["post"],
    url: '/api/outreach/send-gateway',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OutreachController::sendGateway
 * @see app/Http/Controllers/OutreachController.php:181
 * @route '/api/outreach/send-gateway'
 */
sendGateway.url = (options?: RouteQueryOptions) => {
    return sendGateway.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OutreachController::sendGateway
 * @see app/Http/Controllers/OutreachController.php:181
 * @route '/api/outreach/send-gateway'
 */
sendGateway.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendGateway.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OutreachController::sendGateway
 * @see app/Http/Controllers/OutreachController.php:181
 * @route '/api/outreach/send-gateway'
 */
    const sendGatewayForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: sendGateway.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OutreachController::sendGateway
 * @see app/Http/Controllers/OutreachController.php:181
 * @route '/api/outreach/send-gateway'
 */
        sendGatewayForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: sendGateway.url(options),
            method: 'post',
        })
    
    sendGateway.form = sendGatewayForm
const outreach = {
    data: Object.assign(data, data),
mark: Object.assign(mark, mark),
sendGateway: Object.assign(sendGateway, sendGateway),
}

export default outreach