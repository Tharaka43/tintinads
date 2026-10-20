import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminAdvertisementController::get
 * @see app/Http/Controllers/AdminAdvertisementController.php:592
 * @route '/admin/api/advertisements/{id}/images'
 */
export const get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: get.url(args, options),
    method: 'get',
})

get.definition = {
    methods: ["get","head"],
    url: '/admin/api/advertisements/{id}/images',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminAdvertisementController::get
 * @see app/Http/Controllers/AdminAdvertisementController.php:592
 * @route '/admin/api/advertisements/{id}/images'
 */
get.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return get.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminAdvertisementController::get
 * @see app/Http/Controllers/AdminAdvertisementController.php:592
 * @route '/admin/api/advertisements/{id}/images'
 */
get.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: get.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminAdvertisementController::get
 * @see app/Http/Controllers/AdminAdvertisementController.php:592
 * @route '/admin/api/advertisements/{id}/images'
 */
get.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: get.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminAdvertisementController::get
 * @see app/Http/Controllers/AdminAdvertisementController.php:592
 * @route '/admin/api/advertisements/{id}/images'
 */
    const getForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: get.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminAdvertisementController::get
 * @see app/Http/Controllers/AdminAdvertisementController.php:592
 * @route '/admin/api/advertisements/{id}/images'
 */
        getForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: get.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminAdvertisementController::get
 * @see app/Http/Controllers/AdminAdvertisementController.php:592
 * @route '/admin/api/advertisements/{id}/images'
 */
        getForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: get.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    get.form = getForm
/**
* @see \App\Http\Controllers\AdminAdvertisementController::upload
 * @see app/Http/Controllers/AdminAdvertisementController.php:625
 * @route '/admin/api/advertisements/{id}/images'
 */
export const upload = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(args, options),
    method: 'post',
})

upload.definition = {
    methods: ["post"],
    url: '/admin/api/advertisements/{id}/images',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminAdvertisementController::upload
 * @see app/Http/Controllers/AdminAdvertisementController.php:625
 * @route '/admin/api/advertisements/{id}/images'
 */
upload.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return upload.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminAdvertisementController::upload
 * @see app/Http/Controllers/AdminAdvertisementController.php:625
 * @route '/admin/api/advertisements/{id}/images'
 */
upload.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminAdvertisementController::upload
 * @see app/Http/Controllers/AdminAdvertisementController.php:625
 * @route '/admin/api/advertisements/{id}/images'
 */
    const uploadForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: upload.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminAdvertisementController::upload
 * @see app/Http/Controllers/AdminAdvertisementController.php:625
 * @route '/admin/api/advertisements/{id}/images'
 */
        uploadForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: upload.url(args, options),
            method: 'post',
        })
    
    upload.form = uploadForm
/**
* @see \App\Http\Controllers\AdminAdvertisementController::deleteMethod
 * @see app/Http/Controllers/AdminAdvertisementController.php:699
 * @route '/admin/api/advertisements/images/{imageId}'
 */
export const deleteMethod = (args: { imageId: string | number } | [imageId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

deleteMethod.definition = {
    methods: ["delete"],
    url: '/admin/api/advertisements/images/{imageId}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AdminAdvertisementController::deleteMethod
 * @see app/Http/Controllers/AdminAdvertisementController.php:699
 * @route '/admin/api/advertisements/images/{imageId}'
 */
deleteMethod.url = (args: { imageId: string | number } | [imageId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { imageId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    imageId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        imageId: args.imageId,
                }

    return deleteMethod.definition.url
            .replace('{imageId}', parsedArgs.imageId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminAdvertisementController::deleteMethod
 * @see app/Http/Controllers/AdminAdvertisementController.php:699
 * @route '/admin/api/advertisements/images/{imageId}'
 */
deleteMethod.delete = (args: { imageId: string | number } | [imageId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\AdminAdvertisementController::deleteMethod
 * @see app/Http/Controllers/AdminAdvertisementController.php:699
 * @route '/admin/api/advertisements/images/{imageId}'
 */
    const deleteMethodForm = (args: { imageId: string | number } | [imageId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteMethod.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminAdvertisementController::deleteMethod
 * @see app/Http/Controllers/AdminAdvertisementController.php:699
 * @route '/admin/api/advertisements/images/{imageId}'
 */
        deleteMethodForm.delete = (args: { imageId: string | number } | [imageId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteMethod.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteMethod.form = deleteMethodForm
const images = {
    get: Object.assign(get, get),
upload: Object.assign(upload, upload),
delete: Object.assign(deleteMethod, deleteMethod),
}

export default images