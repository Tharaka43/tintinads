import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminCommissionController::index
 * @see app/Http/Controllers/AdminCommissionController.php:19
 * @route '/admin/api/commissions'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/api/commissions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminCommissionController::index
 * @see app/Http/Controllers/AdminCommissionController.php:19
 * @route '/admin/api/commissions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminCommissionController::index
 * @see app/Http/Controllers/AdminCommissionController.php:19
 * @route '/admin/api/commissions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminCommissionController::index
 * @see app/Http/Controllers/AdminCommissionController.php:19
 * @route '/admin/api/commissions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminCommissionController::index
 * @see app/Http/Controllers/AdminCommissionController.php:19
 * @route '/admin/api/commissions'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminCommissionController::index
 * @see app/Http/Controllers/AdminCommissionController.php:19
 * @route '/admin/api/commissions'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminCommissionController::index
 * @see app/Http/Controllers/AdminCommissionController.php:19
 * @route '/admin/api/commissions'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\AdminCommissionController::confirm
 * @see app/Http/Controllers/AdminCommissionController.php:136
 * @route '/admin/api/commissions/{id}/confirm'
 */
export const confirm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirm.url(args, options),
    method: 'post',
})

confirm.definition = {
    methods: ["post"],
    url: '/admin/api/commissions/{id}/confirm',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminCommissionController::confirm
 * @see app/Http/Controllers/AdminCommissionController.php:136
 * @route '/admin/api/commissions/{id}/confirm'
 */
confirm.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return confirm.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminCommissionController::confirm
 * @see app/Http/Controllers/AdminCommissionController.php:136
 * @route '/admin/api/commissions/{id}/confirm'
 */
confirm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirm.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminCommissionController::confirm
 * @see app/Http/Controllers/AdminCommissionController.php:136
 * @route '/admin/api/commissions/{id}/confirm'
 */
    const confirmForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: confirm.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminCommissionController::confirm
 * @see app/Http/Controllers/AdminCommissionController.php:136
 * @route '/admin/api/commissions/{id}/confirm'
 */
        confirmForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: confirm.url(args, options),
            method: 'post',
        })
    
    confirm.form = confirmForm
/**
* @see \App\Http\Controllers\AdminCommissionController::reject
 * @see app/Http/Controllers/AdminCommissionController.php:181
 * @route '/admin/api/commissions/{id}/reject'
 */
export const reject = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/admin/api/commissions/{id}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminCommissionController::reject
 * @see app/Http/Controllers/AdminCommissionController.php:181
 * @route '/admin/api/commissions/{id}/reject'
 */
reject.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return reject.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminCommissionController::reject
 * @see app/Http/Controllers/AdminCommissionController.php:181
 * @route '/admin/api/commissions/{id}/reject'
 */
reject.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminCommissionController::reject
 * @see app/Http/Controllers/AdminCommissionController.php:181
 * @route '/admin/api/commissions/{id}/reject'
 */
    const rejectForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminCommissionController::reject
 * @see app/Http/Controllers/AdminCommissionController.php:181
 * @route '/admin/api/commissions/{id}/reject'
 */
        rejectForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reject.url(args, options),
            method: 'post',
        })
    
    reject.form = rejectForm
const AdminCommissionController = { index, confirm, reject }

export default AdminCommissionController