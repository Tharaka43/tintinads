import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AgentAuthController::store
 * @see app/Http/Controllers/AgentAuthController.php:24
 * @route '/agent/login'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/agent/login',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AgentAuthController::store
 * @see app/Http/Controllers/AgentAuthController.php:24
 * @route '/agent/login'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentAuthController::store
 * @see app/Http/Controllers/AgentAuthController.php:24
 * @route '/agent/login'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AgentAuthController::store
 * @see app/Http/Controllers/AgentAuthController.php:24
 * @route '/agent/login'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AgentAuthController::store
 * @see app/Http/Controllers/AgentAuthController.php:24
 * @route '/agent/login'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const login = {
    store: Object.assign(store, store),
}

export default login