import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
import images from './images'
/**
* @see \App\Http\Controllers\AdminAdvertisementController::index
 * @see app/Http/Controllers/AdminAdvertisementController.php:21
 * @route '/admin/api/advertisements'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/api/advertisements',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminAdvertisementController::index
 * @see app/Http/Controllers/AdminAdvertisementController.php:21
 * @route '/admin/api/advertisements'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminAdvertisementController::index
 * @see app/Http/Controllers/AdminAdvertisementController.php:21
 * @route '/admin/api/advertisements'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminAdvertisementController::index
 * @see app/Http/Controllers/AdminAdvertisementController.php:21
 * @route '/admin/api/advertisements'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminAdvertisementController::index
 * @see app/Http/Controllers/AdminAdvertisementController.php:21
 * @route '/admin/api/advertisements'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminAdvertisementController::index
 * @see app/Http/Controllers/AdminAdvertisementController.php:21
 * @route '/admin/api/advertisements'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminAdvertisementController::index
 * @see app/Http/Controllers/AdminAdvertisementController.php:21
 * @route '/admin/api/advertisements'
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
* @see \App\Http\Controllers\AdminAdvertisementController::store
 * @see app/Http/Controllers/AdminAdvertisementController.php:795
 * @route '/admin/api/advertisements'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/api/advertisements',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminAdvertisementController::store
 * @see app/Http/Controllers/AdminAdvertisementController.php:795
 * @route '/admin/api/advertisements'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminAdvertisementController::store
 * @see app/Http/Controllers/AdminAdvertisementController.php:795
 * @route '/admin/api/advertisements'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminAdvertisementController::store
 * @see app/Http/Controllers/AdminAdvertisementController.php:795
 * @route '/admin/api/advertisements'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminAdvertisementController::store
 * @see app/Http/Controllers/AdminAdvertisementController.php:795
 * @route '/admin/api/advertisements'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\AdminAdvertisementController::update
 * @see app/Http/Controllers/AdminAdvertisementController.php:878
 * @route '/admin/api/advertisements/{id}/update'
 */
export const update = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/admin/api/advertisements/{id}/update',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminAdvertisementController::update
 * @see app/Http/Controllers/AdminAdvertisementController.php:878
 * @route '/admin/api/advertisements/{id}/update'
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
* @see \App\Http\Controllers\AdminAdvertisementController::update
 * @see app/Http/Controllers/AdminAdvertisementController.php:878
 * @route '/admin/api/advertisements/{id}/update'
 */
update.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminAdvertisementController::update
 * @see app/Http/Controllers/AdminAdvertisementController.php:878
 * @route '/admin/api/advertisements/{id}/update'
 */
    const updateForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminAdvertisementController::update
 * @see app/Http/Controllers/AdminAdvertisementController.php:878
 * @route '/admin/api/advertisements/{id}/update'
 */
        updateForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, options),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\AdminAdvertisementController::block
 * @see app/Http/Controllers/AdminAdvertisementController.php:285
 * @route '/admin/api/advertisements/block'
 */
export const block = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: block.url(options),
    method: 'post',
})

block.definition = {
    methods: ["post"],
    url: '/admin/api/advertisements/block',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminAdvertisementController::block
 * @see app/Http/Controllers/AdminAdvertisementController.php:285
 * @route '/admin/api/advertisements/block'
 */
block.url = (options?: RouteQueryOptions) => {
    return block.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminAdvertisementController::block
 * @see app/Http/Controllers/AdminAdvertisementController.php:285
 * @route '/admin/api/advertisements/block'
 */
block.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: block.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminAdvertisementController::block
 * @see app/Http/Controllers/AdminAdvertisementController.php:285
 * @route '/admin/api/advertisements/block'
 */
    const blockForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: block.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminAdvertisementController::block
 * @see app/Http/Controllers/AdminAdvertisementController.php:285
 * @route '/admin/api/advertisements/block'
 */
        blockForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: block.url(options),
            method: 'post',
        })
    
    block.form = blockForm
/**
* @see \App\Http\Controllers\AdminAdvertisementController::feature
 * @see app/Http/Controllers/AdminAdvertisementController.php:325
 * @route '/admin/api/advertisements/feature'
 */
export const feature = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: feature.url(options),
    method: 'post',
})

feature.definition = {
    methods: ["post"],
    url: '/admin/api/advertisements/feature',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminAdvertisementController::feature
 * @see app/Http/Controllers/AdminAdvertisementController.php:325
 * @route '/admin/api/advertisements/feature'
 */
feature.url = (options?: RouteQueryOptions) => {
    return feature.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminAdvertisementController::feature
 * @see app/Http/Controllers/AdminAdvertisementController.php:325
 * @route '/admin/api/advertisements/feature'
 */
feature.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: feature.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminAdvertisementController::feature
 * @see app/Http/Controllers/AdminAdvertisementController.php:325
 * @route '/admin/api/advertisements/feature'
 */
    const featureForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: feature.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminAdvertisementController::feature
 * @see app/Http/Controllers/AdminAdvertisementController.php:325
 * @route '/admin/api/advertisements/feature'
 */
        featureForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: feature.url(options),
            method: 'post',
        })
    
    feature.form = featureForm
/**
* @see \App\Http\Controllers\AdminAdvertisementController::activate
 * @see app/Http/Controllers/AdminAdvertisementController.php:366
 * @route '/admin/api/advertisements/activate'
 */
export const activate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: activate.url(options),
    method: 'post',
})

activate.definition = {
    methods: ["post"],
    url: '/admin/api/advertisements/activate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminAdvertisementController::activate
 * @see app/Http/Controllers/AdminAdvertisementController.php:366
 * @route '/admin/api/advertisements/activate'
 */
activate.url = (options?: RouteQueryOptions) => {
    return activate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminAdvertisementController::activate
 * @see app/Http/Controllers/AdminAdvertisementController.php:366
 * @route '/admin/api/advertisements/activate'
 */
activate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: activate.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminAdvertisementController::activate
 * @see app/Http/Controllers/AdminAdvertisementController.php:366
 * @route '/admin/api/advertisements/activate'
 */
    const activateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: activate.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminAdvertisementController::activate
 * @see app/Http/Controllers/AdminAdvertisementController.php:366
 * @route '/admin/api/advertisements/activate'
 */
        activateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: activate.url(options),
            method: 'post',
        })
    
    activate.form = activateForm
/**
* @see \App\Http\Controllers\AdminAdvertisementController::renew
 * @see app/Http/Controllers/AdminAdvertisementController.php:527
 * @route '/admin/api/advertisements/renew'
 */
export const renew = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: renew.url(options),
    method: 'post',
})

renew.definition = {
    methods: ["post"],
    url: '/admin/api/advertisements/renew',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminAdvertisementController::renew
 * @see app/Http/Controllers/AdminAdvertisementController.php:527
 * @route '/admin/api/advertisements/renew'
 */
renew.url = (options?: RouteQueryOptions) => {
    return renew.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminAdvertisementController::renew
 * @see app/Http/Controllers/AdminAdvertisementController.php:527
 * @route '/admin/api/advertisements/renew'
 */
renew.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: renew.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminAdvertisementController::renew
 * @see app/Http/Controllers/AdminAdvertisementController.php:527
 * @route '/admin/api/advertisements/renew'
 */
    const renewForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: renew.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminAdvertisementController::renew
 * @see app/Http/Controllers/AdminAdvertisementController.php:527
 * @route '/admin/api/advertisements/renew'
 */
        renewForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: renew.url(options),
            method: 'post',
        })
    
    renew.form = renewForm
/**
* @see \App\Http\Controllers\AdminAdvertisementController::deleteMethod
 * @see app/Http/Controllers/AdminAdvertisementController.php:412
 * @route '/admin/api/advertisements/delete'
 */
export const deleteMethod = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: deleteMethod.url(options),
    method: 'post',
})

deleteMethod.definition = {
    methods: ["post"],
    url: '/admin/api/advertisements/delete',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminAdvertisementController::deleteMethod
 * @see app/Http/Controllers/AdminAdvertisementController.php:412
 * @route '/admin/api/advertisements/delete'
 */
deleteMethod.url = (options?: RouteQueryOptions) => {
    return deleteMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminAdvertisementController::deleteMethod
 * @see app/Http/Controllers/AdminAdvertisementController.php:412
 * @route '/admin/api/advertisements/delete'
 */
deleteMethod.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: deleteMethod.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminAdvertisementController::deleteMethod
 * @see app/Http/Controllers/AdminAdvertisementController.php:412
 * @route '/admin/api/advertisements/delete'
 */
    const deleteMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteMethod.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminAdvertisementController::deleteMethod
 * @see app/Http/Controllers/AdminAdvertisementController.php:412
 * @route '/admin/api/advertisements/delete'
 */
        deleteMethodForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteMethod.url(options),
            method: 'post',
        })
    
    deleteMethod.form = deleteMethodForm
/**
* @see \App\Http\Controllers\AdminAdvertisementController::updatePaymentStatus
 * @see app/Http/Controllers/AdminAdvertisementController.php:466
 * @route '/admin/api/advertisements/update-payment-status'
 */
export const updatePaymentStatus = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updatePaymentStatus.url(options),
    method: 'post',
})

updatePaymentStatus.definition = {
    methods: ["post"],
    url: '/admin/api/advertisements/update-payment-status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminAdvertisementController::updatePaymentStatus
 * @see app/Http/Controllers/AdminAdvertisementController.php:466
 * @route '/admin/api/advertisements/update-payment-status'
 */
updatePaymentStatus.url = (options?: RouteQueryOptions) => {
    return updatePaymentStatus.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminAdvertisementController::updatePaymentStatus
 * @see app/Http/Controllers/AdminAdvertisementController.php:466
 * @route '/admin/api/advertisements/update-payment-status'
 */
updatePaymentStatus.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updatePaymentStatus.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminAdvertisementController::updatePaymentStatus
 * @see app/Http/Controllers/AdminAdvertisementController.php:466
 * @route '/admin/api/advertisements/update-payment-status'
 */
    const updatePaymentStatusForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updatePaymentStatus.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminAdvertisementController::updatePaymentStatus
 * @see app/Http/Controllers/AdminAdvertisementController.php:466
 * @route '/admin/api/advertisements/update-payment-status'
 */
        updatePaymentStatusForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updatePaymentStatus.url(options),
            method: 'post',
        })
    
    updatePaymentStatus.form = updatePaymentStatusForm
const advertisements = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
update: Object.assign(update, update),
block: Object.assign(block, block),
feature: Object.assign(feature, feature),
activate: Object.assign(activate, activate),
renew: Object.assign(renew, renew),
images: Object.assign(images, images),
delete: Object.assign(deleteMethod, deleteMethod),
updatePaymentStatus: Object.assign(updatePaymentStatus, updatePaymentStatus),
}

export default advertisements