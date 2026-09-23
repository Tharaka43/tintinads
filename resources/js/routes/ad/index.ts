import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ClassifiedsController::show
 * @see app/Http/Controllers/ClassifiedsController.php:308
 * @route '/ad/{adId}'
 */
export const show = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/ad/{adId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClassifiedsController::show
 * @see app/Http/Controllers/ClassifiedsController.php:308
 * @route '/ad/{adId}'
 */
show.url = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { adId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    adId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        adId: args.adId,
                }

    return show.definition.url
            .replace('{adId}', parsedArgs.adId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClassifiedsController::show
 * @see app/Http/Controllers/ClassifiedsController.php:308
 * @route '/ad/{adId}'
 */
show.get = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClassifiedsController::show
 * @see app/Http/Controllers/ClassifiedsController.php:308
 * @route '/ad/{adId}'
 */
show.head = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClassifiedsController::show
 * @see app/Http/Controllers/ClassifiedsController.php:308
 * @route '/ad/{adId}'
 */
    const showForm = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClassifiedsController::show
 * @see app/Http/Controllers/ClassifiedsController.php:308
 * @route '/ad/{adId}'
 */
        showForm.get = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClassifiedsController::show
 * @see app/Http/Controllers/ClassifiedsController.php:308
 * @route '/ad/{adId}'
 */
        showForm.head = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const ad = {
    show: Object.assign(show, show),
}

export default ad