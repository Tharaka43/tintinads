import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AgentAdController::codes
 * @see app/Http/Controllers/AgentAdController.php:599
 * @route '/agent/ads/codes'
 */
export const codes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: codes.url(options),
    method: 'get',
})

codes.definition = {
    methods: ["get","head"],
    url: '/agent/ads/codes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AgentAdController::codes
 * @see app/Http/Controllers/AgentAdController.php:599
 * @route '/agent/ads/codes'
 */
codes.url = (options?: RouteQueryOptions) => {
    return codes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentAdController::codes
 * @see app/Http/Controllers/AgentAdController.php:599
 * @route '/agent/ads/codes'
 */
codes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: codes.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AgentAdController::codes
 * @see app/Http/Controllers/AgentAdController.php:599
 * @route '/agent/ads/codes'
 */
codes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: codes.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AgentAdController::codes
 * @see app/Http/Controllers/AgentAdController.php:599
 * @route '/agent/ads/codes'
 */
    const codesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: codes.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AgentAdController::codes
 * @see app/Http/Controllers/AgentAdController.php:599
 * @route '/agent/ads/codes'
 */
        codesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: codes.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AgentAdController::codes
 * @see app/Http/Controllers/AgentAdController.php:599
 * @route '/agent/ads/codes'
 */
        codesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: codes.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    codes.form = codesForm
/**
* @see \App\Http\Controllers\AgentAdController::edit
 * @see app/Http/Controllers/AgentAdController.php:220
 * @route '/agent/ads/{id}/edit'
 */
export const edit = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/agent/ads/{id}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AgentAdController::edit
 * @see app/Http/Controllers/AgentAdController.php:220
 * @route '/agent/ads/{id}/edit'
 */
edit.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentAdController::edit
 * @see app/Http/Controllers/AgentAdController.php:220
 * @route '/agent/ads/{id}/edit'
 */
edit.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AgentAdController::edit
 * @see app/Http/Controllers/AgentAdController.php:220
 * @route '/agent/ads/{id}/edit'
 */
edit.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AgentAdController::edit
 * @see app/Http/Controllers/AgentAdController.php:220
 * @route '/agent/ads/{id}/edit'
 */
    const editForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AgentAdController::edit
 * @see app/Http/Controllers/AgentAdController.php:220
 * @route '/agent/ads/{id}/edit'
 */
        editForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AgentAdController::edit
 * @see app/Http/Controllers/AgentAdController.php:220
 * @route '/agent/ads/{id}/edit'
 */
        editForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\AgentAdController::update
 * @see app/Http/Controllers/AgentAdController.php:261
 * @route '/agent/ads/{id}/update'
 */
export const update = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/agent/ads/{id}/update',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AgentAdController::update
 * @see app/Http/Controllers/AgentAdController.php:261
 * @route '/agent/ads/{id}/update'
 */
update.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentAdController::update
 * @see app/Http/Controllers/AgentAdController.php:261
 * @route '/agent/ads/{id}/update'
 */
update.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AgentAdController::update
 * @see app/Http/Controllers/AgentAdController.php:261
 * @route '/agent/ads/{id}/update'
 */
    const updateForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AgentAdController::update
 * @see app/Http/Controllers/AgentAdController.php:261
 * @route '/agent/ads/{id}/update'
 */
        updateForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, options),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\AgentAdController::toggle
 * @see app/Http/Controllers/AgentAdController.php:647
 * @route '/agent/ads/{id}/toggle'
 */
export const toggle = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(args, options),
    method: 'post',
})

toggle.definition = {
    methods: ["post"],
    url: '/agent/ads/{id}/toggle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AgentAdController::toggle
 * @see app/Http/Controllers/AgentAdController.php:647
 * @route '/agent/ads/{id}/toggle'
 */
toggle.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return toggle.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentAdController::toggle
 * @see app/Http/Controllers/AgentAdController.php:647
 * @route '/agent/ads/{id}/toggle'
 */
toggle.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AgentAdController::toggle
 * @see app/Http/Controllers/AgentAdController.php:647
 * @route '/agent/ads/{id}/toggle'
 */
    const toggleForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggle.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AgentAdController::toggle
 * @see app/Http/Controllers/AgentAdController.php:647
 * @route '/agent/ads/{id}/toggle'
 */
        toggleForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggle.url(args, options),
            method: 'post',
        })
    
    toggle.form = toggleForm
/**
* @see \App\Http\Controllers\AgentAdController::bump
 * @see app/Http/Controllers/AgentAdController.php:665
 * @route '/agent/ads/{id}/bump'
 */
export const bump = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bump.url(args, options),
    method: 'post',
})

bump.definition = {
    methods: ["post"],
    url: '/agent/ads/{id}/bump',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AgentAdController::bump
 * @see app/Http/Controllers/AgentAdController.php:665
 * @route '/agent/ads/{id}/bump'
 */
bump.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return bump.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentAdController::bump
 * @see app/Http/Controllers/AgentAdController.php:665
 * @route '/agent/ads/{id}/bump'
 */
bump.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bump.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AgentAdController::bump
 * @see app/Http/Controllers/AgentAdController.php:665
 * @route '/agent/ads/{id}/bump'
 */
    const bumpForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: bump.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AgentAdController::bump
 * @see app/Http/Controllers/AgentAdController.php:665
 * @route '/agent/ads/{id}/bump'
 */
        bumpForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: bump.url(args, options),
            method: 'post',
        })
    
    bump.form = bumpForm
/**
* @see \App\Http\Controllers\AgentAdController::deleteMethod
 * @see app/Http/Controllers/AgentAdController.php:678
 * @route '/agent/ads/{id}/delete'
 */
export const deleteMethod = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

deleteMethod.definition = {
    methods: ["delete"],
    url: '/agent/ads/{id}/delete',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AgentAdController::deleteMethod
 * @see app/Http/Controllers/AgentAdController.php:678
 * @route '/agent/ads/{id}/delete'
 */
deleteMethod.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return deleteMethod.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentAdController::deleteMethod
 * @see app/Http/Controllers/AgentAdController.php:678
 * @route '/agent/ads/{id}/delete'
 */
deleteMethod.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\AgentAdController::deleteMethod
 * @see app/Http/Controllers/AgentAdController.php:678
 * @route '/agent/ads/{id}/delete'
 */
    const deleteMethodForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteMethod.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AgentAdController::deleteMethod
 * @see app/Http/Controllers/AgentAdController.php:678
 * @route '/agent/ads/{id}/delete'
 */
        deleteMethodForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteMethod.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteMethod.form = deleteMethodForm
const ads = {
    codes: Object.assign(codes, codes),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
toggle: Object.assign(toggle, toggle),
bump: Object.assign(bump, bump),
delete: Object.assign(deleteMethod, deleteMethod),
}

export default ads