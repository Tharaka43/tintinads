import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
 * @see routes/web.php:90
 * @route '/telegram'
 */
export const bridge = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bridge.url(options),
    method: 'get',
})

bridge.definition = {
    methods: ["get","head"],
    url: '/telegram',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:90
 * @route '/telegram'
 */
bridge.url = (options?: RouteQueryOptions) => {
    return bridge.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:90
 * @route '/telegram'
 */
bridge.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bridge.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:90
 * @route '/telegram'
 */
bridge.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bridge.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:90
 * @route '/telegram'
 */
    const bridgeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: bridge.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:90
 * @route '/telegram'
 */
        bridgeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bridge.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:90
 * @route '/telegram'
 */
        bridgeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bridge.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    bridge.form = bridgeForm
const telegram = {
    bridge: Object.assign(bridge, bridge),
}

export default telegram