import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AgentAdController::index
 * @see app/Http/Controllers/AgentAdController.php:373
 * @route '/agent/ads'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/agent/ads',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AgentAdController::index
 * @see app/Http/Controllers/AgentAdController.php:373
 * @route '/agent/ads'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentAdController::index
 * @see app/Http/Controllers/AgentAdController.php:373
 * @route '/agent/ads'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AgentAdController::index
 * @see app/Http/Controllers/AgentAdController.php:373
 * @route '/agent/ads'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AgentAdController::index
 * @see app/Http/Controllers/AgentAdController.php:373
 * @route '/agent/ads'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AgentAdController::index
 * @see app/Http/Controllers/AgentAdController.php:373
 * @route '/agent/ads'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AgentAdController::index
 * @see app/Http/Controllers/AgentAdController.php:373
 * @route '/agent/ads'
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
* @see \App\Http\Controllers\AgentAdController::codes
 * @see app/Http/Controllers/AgentAdController.php:581
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
 * @see app/Http/Controllers/AgentAdController.php:581
 * @route '/agent/ads/codes'
 */
codes.url = (options?: RouteQueryOptions) => {
    return codes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentAdController::codes
 * @see app/Http/Controllers/AgentAdController.php:581
 * @route '/agent/ads/codes'
 */
codes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: codes.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AgentAdController::codes
 * @see app/Http/Controllers/AgentAdController.php:581
 * @route '/agent/ads/codes'
 */
codes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: codes.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AgentAdController::codes
 * @see app/Http/Controllers/AgentAdController.php:581
 * @route '/agent/ads/codes'
 */
    const codesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: codes.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AgentAdController::codes
 * @see app/Http/Controllers/AgentAdController.php:581
 * @route '/agent/ads/codes'
 */
        codesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: codes.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AgentAdController::codes
 * @see app/Http/Controllers/AgentAdController.php:581
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
* @see \App\Http\Controllers\AgentAdController::create
 * @see app/Http/Controllers/AgentAdController.php:26
 * @route '/agent/post'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/agent/post',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AgentAdController::create
 * @see app/Http/Controllers/AgentAdController.php:26
 * @route '/agent/post'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentAdController::create
 * @see app/Http/Controllers/AgentAdController.php:26
 * @route '/agent/post'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AgentAdController::create
 * @see app/Http/Controllers/AgentAdController.php:26
 * @route '/agent/post'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AgentAdController::create
 * @see app/Http/Controllers/AgentAdController.php:26
 * @route '/agent/post'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AgentAdController::create
 * @see app/Http/Controllers/AgentAdController.php:26
 * @route '/agent/post'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AgentAdController::create
 * @see app/Http/Controllers/AgentAdController.php:26
 * @route '/agent/post'
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
* @see \App\Http\Controllers\AgentAdController::toggleStatus
 * @see app/Http/Controllers/AgentAdController.php:629
 * @route '/agent/ads/{id}/toggle'
 */
export const toggleStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})

toggleStatus.definition = {
    methods: ["post"],
    url: '/agent/ads/{id}/toggle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AgentAdController::toggleStatus
 * @see app/Http/Controllers/AgentAdController.php:629
 * @route '/agent/ads/{id}/toggle'
 */
toggleStatus.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return toggleStatus.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentAdController::toggleStatus
 * @see app/Http/Controllers/AgentAdController.php:629
 * @route '/agent/ads/{id}/toggle'
 */
toggleStatus.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AgentAdController::toggleStatus
 * @see app/Http/Controllers/AgentAdController.php:629
 * @route '/agent/ads/{id}/toggle'
 */
    const toggleStatusForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleStatus.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AgentAdController::toggleStatus
 * @see app/Http/Controllers/AgentAdController.php:629
 * @route '/agent/ads/{id}/toggle'
 */
        toggleStatusForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleStatus.url(args, options),
            method: 'post',
        })
    
    toggleStatus.form = toggleStatusForm
/**
* @see \App\Http\Controllers\AgentAdController::bumpAd
 * @see app/Http/Controllers/AgentAdController.php:647
 * @route '/agent/ads/{id}/bump'
 */
export const bumpAd = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bumpAd.url(args, options),
    method: 'post',
})

bumpAd.definition = {
    methods: ["post"],
    url: '/agent/ads/{id}/bump',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AgentAdController::bumpAd
 * @see app/Http/Controllers/AgentAdController.php:647
 * @route '/agent/ads/{id}/bump'
 */
bumpAd.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return bumpAd.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentAdController::bumpAd
 * @see app/Http/Controllers/AgentAdController.php:647
 * @route '/agent/ads/{id}/bump'
 */
bumpAd.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bumpAd.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AgentAdController::bumpAd
 * @see app/Http/Controllers/AgentAdController.php:647
 * @route '/agent/ads/{id}/bump'
 */
    const bumpAdForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: bumpAd.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AgentAdController::bumpAd
 * @see app/Http/Controllers/AgentAdController.php:647
 * @route '/agent/ads/{id}/bump'
 */
        bumpAdForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: bumpAd.url(args, options),
            method: 'post',
        })
    
    bumpAd.form = bumpAdForm
/**
* @see \App\Http\Controllers\AgentAdController::deleteAd
 * @see app/Http/Controllers/AgentAdController.php:660
 * @route '/agent/ads/{id}/delete'
 */
export const deleteAd = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteAd.url(args, options),
    method: 'delete',
})

deleteAd.definition = {
    methods: ["delete"],
    url: '/agent/ads/{id}/delete',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AgentAdController::deleteAd
 * @see app/Http/Controllers/AgentAdController.php:660
 * @route '/agent/ads/{id}/delete'
 */
deleteAd.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return deleteAd.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentAdController::deleteAd
 * @see app/Http/Controllers/AgentAdController.php:660
 * @route '/agent/ads/{id}/delete'
 */
deleteAd.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteAd.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\AgentAdController::deleteAd
 * @see app/Http/Controllers/AgentAdController.php:660
 * @route '/agent/ads/{id}/delete'
 */
    const deleteAdForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteAd.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AgentAdController::deleteAd
 * @see app/Http/Controllers/AgentAdController.php:660
 * @route '/agent/ads/{id}/delete'
 */
        deleteAdForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteAd.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteAd.form = deleteAdForm
/**
* @see \App\Http\Controllers\AgentAdController::commissionHistory
 * @see app/Http/Controllers/AgentAdController.php:591
 * @route '/agent/commission'
 */
export const commissionHistory = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: commissionHistory.url(options),
    method: 'get',
})

commissionHistory.definition = {
    methods: ["get","head"],
    url: '/agent/commission',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AgentAdController::commissionHistory
 * @see app/Http/Controllers/AgentAdController.php:591
 * @route '/agent/commission'
 */
commissionHistory.url = (options?: RouteQueryOptions) => {
    return commissionHistory.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentAdController::commissionHistory
 * @see app/Http/Controllers/AgentAdController.php:591
 * @route '/agent/commission'
 */
commissionHistory.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: commissionHistory.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AgentAdController::commissionHistory
 * @see app/Http/Controllers/AgentAdController.php:591
 * @route '/agent/commission'
 */
commissionHistory.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: commissionHistory.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AgentAdController::commissionHistory
 * @see app/Http/Controllers/AgentAdController.php:591
 * @route '/agent/commission'
 */
    const commissionHistoryForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: commissionHistory.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AgentAdController::commissionHistory
 * @see app/Http/Controllers/AgentAdController.php:591
 * @route '/agent/commission'
 */
        commissionHistoryForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: commissionHistory.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AgentAdController::commissionHistory
 * @see app/Http/Controllers/AgentAdController.php:591
 * @route '/agent/commission'
 */
        commissionHistoryForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: commissionHistory.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    commissionHistory.form = commissionHistoryForm
/**
* @see \App\Http\Controllers\AgentAdController::payments
 * @see app/Http/Controllers/AgentAdController.php:413
 * @route '/agent/payments'
 */
export const payments = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payments.url(options),
    method: 'get',
})

payments.definition = {
    methods: ["get","head"],
    url: '/agent/payments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AgentAdController::payments
 * @see app/Http/Controllers/AgentAdController.php:413
 * @route '/agent/payments'
 */
payments.url = (options?: RouteQueryOptions) => {
    return payments.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentAdController::payments
 * @see app/Http/Controllers/AgentAdController.php:413
 * @route '/agent/payments'
 */
payments.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payments.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AgentAdController::payments
 * @see app/Http/Controllers/AgentAdController.php:413
 * @route '/agent/payments'
 */
payments.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: payments.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AgentAdController::payments
 * @see app/Http/Controllers/AgentAdController.php:413
 * @route '/agent/payments'
 */
    const paymentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: payments.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AgentAdController::payments
 * @see app/Http/Controllers/AgentAdController.php:413
 * @route '/agent/payments'
 */
        paymentsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: payments.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AgentAdController::payments
 * @see app/Http/Controllers/AgentAdController.php:413
 * @route '/agent/payments'
 */
        paymentsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: payments.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    payments.form = paymentsForm
/**
* @see \App\Http\Controllers\AgentAdController::storeTransaction
 * @see app/Http/Controllers/AgentAdController.php:480
 * @route '/agent/payments/report'
 */
export const storeTransaction = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeTransaction.url(options),
    method: 'post',
})

storeTransaction.definition = {
    methods: ["post"],
    url: '/agent/payments/report',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AgentAdController::storeTransaction
 * @see app/Http/Controllers/AgentAdController.php:480
 * @route '/agent/payments/report'
 */
storeTransaction.url = (options?: RouteQueryOptions) => {
    return storeTransaction.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentAdController::storeTransaction
 * @see app/Http/Controllers/AgentAdController.php:480
 * @route '/agent/payments/report'
 */
storeTransaction.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeTransaction.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AgentAdController::storeTransaction
 * @see app/Http/Controllers/AgentAdController.php:480
 * @route '/agent/payments/report'
 */
    const storeTransactionForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeTransaction.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AgentAdController::storeTransaction
 * @see app/Http/Controllers/AgentAdController.php:480
 * @route '/agent/payments/report'
 */
        storeTransactionForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeTransaction.url(options),
            method: 'post',
        })
    
    storeTransaction.form = storeTransactionForm
/**
* @see \App\Http\Controllers\AgentAdController::profile
 * @see app/Http/Controllers/AgentAdController.php:672
 * @route '/agent/profile'
 */
export const profile = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profile.url(options),
    method: 'get',
})

profile.definition = {
    methods: ["get","head"],
    url: '/agent/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AgentAdController::profile
 * @see app/Http/Controllers/AgentAdController.php:672
 * @route '/agent/profile'
 */
profile.url = (options?: RouteQueryOptions) => {
    return profile.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentAdController::profile
 * @see app/Http/Controllers/AgentAdController.php:672
 * @route '/agent/profile'
 */
profile.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profile.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AgentAdController::profile
 * @see app/Http/Controllers/AgentAdController.php:672
 * @route '/agent/profile'
 */
profile.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: profile.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AgentAdController::profile
 * @see app/Http/Controllers/AgentAdController.php:672
 * @route '/agent/profile'
 */
    const profileForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: profile.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AgentAdController::profile
 * @see app/Http/Controllers/AgentAdController.php:672
 * @route '/agent/profile'
 */
        profileForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: profile.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AgentAdController::profile
 * @see app/Http/Controllers/AgentAdController.php:672
 * @route '/agent/profile'
 */
        profileForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: profile.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    profile.form = profileForm
/**
* @see \App\Http\Controllers\AgentAdController::updateProfile
 * @see app/Http/Controllers/AgentAdController.php:698
 * @route '/agent/profile/update'
 */
export const updateProfile = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateProfile.url(options),
    method: 'post',
})

updateProfile.definition = {
    methods: ["post"],
    url: '/agent/profile/update',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AgentAdController::updateProfile
 * @see app/Http/Controllers/AgentAdController.php:698
 * @route '/agent/profile/update'
 */
updateProfile.url = (options?: RouteQueryOptions) => {
    return updateProfile.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentAdController::updateProfile
 * @see app/Http/Controllers/AgentAdController.php:698
 * @route '/agent/profile/update'
 */
updateProfile.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateProfile.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AgentAdController::updateProfile
 * @see app/Http/Controllers/AgentAdController.php:698
 * @route '/agent/profile/update'
 */
    const updateProfileForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateProfile.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AgentAdController::updateProfile
 * @see app/Http/Controllers/AgentAdController.php:698
 * @route '/agent/profile/update'
 */
        updateProfileForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateProfile.url(options),
            method: 'post',
        })
    
    updateProfile.form = updateProfileForm
const AgentAdController = { index, codes, create, store, edit, update, toggleStatus, bumpAd, deleteAd, commissionHistory, payments, storeTransaction, profile, updateProfile }

export default AgentAdController