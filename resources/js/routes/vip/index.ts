import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
 * @see routes/web.php:86
 * @route '/vip'
 */
export const bridge = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bridge.url(options),
    method: 'get',
})

bridge.definition = {
    methods: ["get","head"],
    url: '/vip',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:86
 * @route '/vip'
 */
bridge.url = (options?: RouteQueryOptions) => {
    return bridge.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:86
 * @route '/vip'
 */
bridge.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bridge.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:86
 * @route '/vip'
 */
bridge.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bridge.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:86
 * @route '/vip'
 */
    const bridgeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: bridge.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:86
 * @route '/vip'
 */
        bridgeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bridge.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:86
 * @route '/vip'
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
const vip = {
    bridge: Object.assign(bridge, bridge),
}

export default vip