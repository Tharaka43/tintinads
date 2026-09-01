import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminSettingsController::getListingCategories
 * @see app/Http/Controllers/AdminSettingsController.php:17
 * @route '/admin/api/settings/listing-categories'
 */
export const getListingCategories = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getListingCategories.url(options),
    method: 'get',
})

getListingCategories.definition = {
    methods: ["get","head"],
    url: '/admin/api/settings/listing-categories',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminSettingsController::getListingCategories
 * @see app/Http/Controllers/AdminSettingsController.php:17
 * @route '/admin/api/settings/listing-categories'
 */
getListingCategories.url = (options?: RouteQueryOptions) => {
    return getListingCategories.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminSettingsController::getListingCategories
 * @see app/Http/Controllers/AdminSettingsController.php:17
 * @route '/admin/api/settings/listing-categories'
 */
getListingCategories.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getListingCategories.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminSettingsController::getListingCategories
 * @see app/Http/Controllers/AdminSettingsController.php:17
 * @route '/admin/api/settings/listing-categories'
 */
getListingCategories.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getListingCategories.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminSettingsController::getListingCategories
 * @see app/Http/Controllers/AdminSettingsController.php:17
 * @route '/admin/api/settings/listing-categories'
 */
    const getListingCategoriesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getListingCategories.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminSettingsController::getListingCategories
 * @see app/Http/Controllers/AdminSettingsController.php:17
 * @route '/admin/api/settings/listing-categories'
 */
        getListingCategoriesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getListingCategories.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminSettingsController::getListingCategories
 * @see app/Http/Controllers/AdminSettingsController.php:17
 * @route '/admin/api/settings/listing-categories'
 */
        getListingCategoriesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getListingCategories.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getListingCategories.form = getListingCategoriesForm
/**
* @see \App\Http\Controllers\AdminSettingsController::storeListingCategory
 * @see app/Http/Controllers/AdminSettingsController.php:50
 * @route '/admin/api/settings/listing-categories'
 */
export const storeListingCategory = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeListingCategory.url(options),
    method: 'post',
})

storeListingCategory.definition = {
    methods: ["post"],
    url: '/admin/api/settings/listing-categories',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminSettingsController::storeListingCategory
 * @see app/Http/Controllers/AdminSettingsController.php:50
 * @route '/admin/api/settings/listing-categories'
 */
storeListingCategory.url = (options?: RouteQueryOptions) => {
    return storeListingCategory.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminSettingsController::storeListingCategory
 * @see app/Http/Controllers/AdminSettingsController.php:50
 * @route '/admin/api/settings/listing-categories'
 */
storeListingCategory.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeListingCategory.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminSettingsController::storeListingCategory
 * @see app/Http/Controllers/AdminSettingsController.php:50
 * @route '/admin/api/settings/listing-categories'
 */
    const storeListingCategoryForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeListingCategory.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminSettingsController::storeListingCategory
 * @see app/Http/Controllers/AdminSettingsController.php:50
 * @route '/admin/api/settings/listing-categories'
 */
        storeListingCategoryForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeListingCategory.url(options),
            method: 'post',
        })
    
    storeListingCategory.form = storeListingCategoryForm
/**
* @see \App\Http\Controllers\AdminSettingsController::updateListingCategory
 * @see app/Http/Controllers/AdminSettingsController.php:103
 * @route '/admin/api/settings/listing-categories/{id}'
 */
export const updateListingCategory = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateListingCategory.url(args, options),
    method: 'put',
})

updateListingCategory.definition = {
    methods: ["put"],
    url: '/admin/api/settings/listing-categories/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AdminSettingsController::updateListingCategory
 * @see app/Http/Controllers/AdminSettingsController.php:103
 * @route '/admin/api/settings/listing-categories/{id}'
 */
updateListingCategory.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateListingCategory.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminSettingsController::updateListingCategory
 * @see app/Http/Controllers/AdminSettingsController.php:103
 * @route '/admin/api/settings/listing-categories/{id}'
 */
updateListingCategory.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateListingCategory.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\AdminSettingsController::updateListingCategory
 * @see app/Http/Controllers/AdminSettingsController.php:103
 * @route '/admin/api/settings/listing-categories/{id}'
 */
    const updateListingCategoryForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateListingCategory.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminSettingsController::updateListingCategory
 * @see app/Http/Controllers/AdminSettingsController.php:103
 * @route '/admin/api/settings/listing-categories/{id}'
 */
        updateListingCategoryForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateListingCategory.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateListingCategory.form = updateListingCategoryForm
/**
* @see \App\Http\Controllers\AdminSettingsController::deleteListingCategory
 * @see app/Http/Controllers/AdminSettingsController.php:158
 * @route '/admin/api/settings/listing-categories/{id}'
 */
export const deleteListingCategory = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteListingCategory.url(args, options),
    method: 'delete',
})

deleteListingCategory.definition = {
    methods: ["delete"],
    url: '/admin/api/settings/listing-categories/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AdminSettingsController::deleteListingCategory
 * @see app/Http/Controllers/AdminSettingsController.php:158
 * @route '/admin/api/settings/listing-categories/{id}'
 */
deleteListingCategory.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return deleteListingCategory.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminSettingsController::deleteListingCategory
 * @see app/Http/Controllers/AdminSettingsController.php:158
 * @route '/admin/api/settings/listing-categories/{id}'
 */
deleteListingCategory.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteListingCategory.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\AdminSettingsController::deleteListingCategory
 * @see app/Http/Controllers/AdminSettingsController.php:158
 * @route '/admin/api/settings/listing-categories/{id}'
 */
    const deleteListingCategoryForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteListingCategory.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminSettingsController::deleteListingCategory
 * @see app/Http/Controllers/AdminSettingsController.php:158
 * @route '/admin/api/settings/listing-categories/{id}'
 */
        deleteListingCategoryForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteListingCategory.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteListingCategory.form = deleteListingCategoryForm
/**
* @see \App\Http\Controllers\AdminSettingsController::getCategories
 * @see app/Http/Controllers/AdminSettingsController.php:199
 * @route '/admin/api/settings/categories'
 */
export const getCategories = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCategories.url(options),
    method: 'get',
})

getCategories.definition = {
    methods: ["get","head"],
    url: '/admin/api/settings/categories',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminSettingsController::getCategories
 * @see app/Http/Controllers/AdminSettingsController.php:199
 * @route '/admin/api/settings/categories'
 */
getCategories.url = (options?: RouteQueryOptions) => {
    return getCategories.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminSettingsController::getCategories
 * @see app/Http/Controllers/AdminSettingsController.php:199
 * @route '/admin/api/settings/categories'
 */
getCategories.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCategories.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminSettingsController::getCategories
 * @see app/Http/Controllers/AdminSettingsController.php:199
 * @route '/admin/api/settings/categories'
 */
getCategories.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getCategories.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminSettingsController::getCategories
 * @see app/Http/Controllers/AdminSettingsController.php:199
 * @route '/admin/api/settings/categories'
 */
    const getCategoriesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getCategories.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminSettingsController::getCategories
 * @see app/Http/Controllers/AdminSettingsController.php:199
 * @route '/admin/api/settings/categories'
 */
        getCategoriesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getCategories.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminSettingsController::getCategories
 * @see app/Http/Controllers/AdminSettingsController.php:199
 * @route '/admin/api/settings/categories'
 */
        getCategoriesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getCategories.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getCategories.form = getCategoriesForm
/**
* @see \App\Http\Controllers\AdminSettingsController::storeCategory
 * @see app/Http/Controllers/AdminSettingsController.php:231
 * @route '/admin/api/settings/categories'
 */
export const storeCategory = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCategory.url(options),
    method: 'post',
})

storeCategory.definition = {
    methods: ["post"],
    url: '/admin/api/settings/categories',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminSettingsController::storeCategory
 * @see app/Http/Controllers/AdminSettingsController.php:231
 * @route '/admin/api/settings/categories'
 */
storeCategory.url = (options?: RouteQueryOptions) => {
    return storeCategory.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminSettingsController::storeCategory
 * @see app/Http/Controllers/AdminSettingsController.php:231
 * @route '/admin/api/settings/categories'
 */
storeCategory.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCategory.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminSettingsController::storeCategory
 * @see app/Http/Controllers/AdminSettingsController.php:231
 * @route '/admin/api/settings/categories'
 */
    const storeCategoryForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeCategory.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminSettingsController::storeCategory
 * @see app/Http/Controllers/AdminSettingsController.php:231
 * @route '/admin/api/settings/categories'
 */
        storeCategoryForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeCategory.url(options),
            method: 'post',
        })
    
    storeCategory.form = storeCategoryForm
/**
* @see \App\Http\Controllers\AdminSettingsController::updateCategory
 * @see app/Http/Controllers/AdminSettingsController.php:281
 * @route '/admin/api/settings/categories/{id}'
 */
export const updateCategory = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateCategory.url(args, options),
    method: 'put',
})

updateCategory.definition = {
    methods: ["put"],
    url: '/admin/api/settings/categories/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AdminSettingsController::updateCategory
 * @see app/Http/Controllers/AdminSettingsController.php:281
 * @route '/admin/api/settings/categories/{id}'
 */
updateCategory.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateCategory.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminSettingsController::updateCategory
 * @see app/Http/Controllers/AdminSettingsController.php:281
 * @route '/admin/api/settings/categories/{id}'
 */
updateCategory.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateCategory.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\AdminSettingsController::updateCategory
 * @see app/Http/Controllers/AdminSettingsController.php:281
 * @route '/admin/api/settings/categories/{id}'
 */
    const updateCategoryForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateCategory.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminSettingsController::updateCategory
 * @see app/Http/Controllers/AdminSettingsController.php:281
 * @route '/admin/api/settings/categories/{id}'
 */
        updateCategoryForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateCategory.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateCategory.form = updateCategoryForm
/**
* @see \App\Http\Controllers\AdminSettingsController::deleteCategory
 * @see app/Http/Controllers/AdminSettingsController.php:333
 * @route '/admin/api/settings/categories/{id}'
 */
export const deleteCategory = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteCategory.url(args, options),
    method: 'delete',
})

deleteCategory.definition = {
    methods: ["delete"],
    url: '/admin/api/settings/categories/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AdminSettingsController::deleteCategory
 * @see app/Http/Controllers/AdminSettingsController.php:333
 * @route '/admin/api/settings/categories/{id}'
 */
deleteCategory.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return deleteCategory.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminSettingsController::deleteCategory
 * @see app/Http/Controllers/AdminSettingsController.php:333
 * @route '/admin/api/settings/categories/{id}'
 */
deleteCategory.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteCategory.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\AdminSettingsController::deleteCategory
 * @see app/Http/Controllers/AdminSettingsController.php:333
 * @route '/admin/api/settings/categories/{id}'
 */
    const deleteCategoryForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteCategory.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminSettingsController::deleteCategory
 * @see app/Http/Controllers/AdminSettingsController.php:333
 * @route '/admin/api/settings/categories/{id}'
 */
        deleteCategoryForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteCategory.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteCategory.form = deleteCategoryForm
const AdminSettingsController = { getListingCategories, storeListingCategory, updateListingCategory, deleteListingCategory, getCategories, storeCategory, updateCategory, deleteCategory }

export default AdminSettingsController