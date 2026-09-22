import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AgentAdController::store
 * @see app/Http/Controllers/AgentAdController.php:486
 * @route '/agent/payments/report'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/agent/payments/report',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AgentAdController::store
 * @see app/Http/Controllers/AgentAdController.php:486
 * @route '/agent/payments/report'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentAdController::store
 * @see app/Http/Controllers/AgentAdController.php:486
 * @route '/agent/payments/report'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AgentAdController::store
 * @see app/Http/Controllers/AgentAdController.php:486
 * @route '/agent/payments/report'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AgentAdController::store
 * @see app/Http/Controllers/AgentAdController.php:486
 * @route '/agent/payments/report'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const payments = {
    store: Object.assign(store, store),
}

export default payments