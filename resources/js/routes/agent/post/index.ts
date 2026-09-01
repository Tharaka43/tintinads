import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AgentAdController::store
 * @see app/Http/Controllers/AgentAdController.php:58
 * @route '/agent/post'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/agent/post',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AgentAdController::store
 * @see app/Http/Controllers/AgentAdController.php:58
 * @route '/agent/post'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentAdController::store
 * @see app/Http/Controllers/AgentAdController.php:58
 * @route '/agent/post'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AgentAdController::store
 * @see app/Http/Controllers/AgentAdController.php:58
 * @route '/agent/post'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AgentAdController::store
 * @see app/Http/Controllers/AgentAdController.php:58
 * @route '/agent/post'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const post = {
    store: Object.assign(store, store),
}

export default post