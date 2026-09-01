import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AgentAuthController::create
 * @see app/Http/Controllers/AgentAuthController.php:14
 * @route '/agent/login'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/agent/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AgentAuthController::create
 * @see app/Http/Controllers/AgentAuthController.php:14
 * @route '/agent/login'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentAuthController::create
 * @see app/Http/Controllers/AgentAuthController.php:14
 * @route '/agent/login'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AgentAuthController::create
 * @see app/Http/Controllers/AgentAuthController.php:14
 * @route '/agent/login'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AgentAuthController::create
 * @see app/Http/Controllers/AgentAuthController.php:14
 * @route '/agent/login'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AgentAuthController::create
 * @see app/Http/Controllers/AgentAuthController.php:14
 * @route '/agent/login'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AgentAuthController::create
 * @see app/Http/Controllers/AgentAuthController.php:14
 * @route '/agent/login'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
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
/**
* @see \App\Http\Controllers\AgentAuthController::destroy
 * @see app/Http/Controllers/AgentAuthController.php:76
 * @route '/agent/logout'
 */
export const destroy = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: destroy.url(options),
    method: 'post',
})

destroy.definition = {
    methods: ["post"],
    url: '/agent/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AgentAuthController::destroy
 * @see app/Http/Controllers/AgentAuthController.php:76
 * @route '/agent/logout'
 */
destroy.url = (options?: RouteQueryOptions) => {
    return destroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentAuthController::destroy
 * @see app/Http/Controllers/AgentAuthController.php:76
 * @route '/agent/logout'
 */
destroy.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: destroy.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AgentAuthController::destroy
 * @see app/Http/Controllers/AgentAuthController.php:76
 * @route '/agent/logout'
 */
    const destroyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AgentAuthController::destroy
 * @see app/Http/Controllers/AgentAuthController.php:76
 * @route '/agent/logout'
 */
        destroyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(options),
            method: 'post',
        })
    
    destroy.form = destroyForm
const AgentAuthController = { create, store, destroy }

export default AgentAuthController