import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../wayfinder'
/**
* @see \App\Http\Controllers\ClassifiedsController::home
 * @see app/Http/Controllers/ClassifiedsController.php:17
 * @route '/'
 */
export const home = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})

home.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClassifiedsController::home
 * @see app/Http/Controllers/ClassifiedsController.php:17
 * @route '/'
 */
home.url = (options?: RouteQueryOptions) => {
    return home.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClassifiedsController::home
 * @see app/Http/Controllers/ClassifiedsController.php:17
 * @route '/'
 */
home.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClassifiedsController::home
 * @see app/Http/Controllers/ClassifiedsController.php:17
 * @route '/'
 */
home.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: home.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClassifiedsController::home
 * @see app/Http/Controllers/ClassifiedsController.php:17
 * @route '/'
 */
    const homeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: home.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClassifiedsController::home
 * @see app/Http/Controllers/ClassifiedsController.php:17
 * @route '/'
 */
        homeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: home.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClassifiedsController::home
 * @see app/Http/Controllers/ClassifiedsController.php:17
 * @route '/'
 */
        homeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: home.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    home.form = homeForm
/**
* @see \App\Http\Controllers\ClassifiedsController::agents
 * @see app/Http/Controllers/ClassifiedsController.php:528
 * @route '/agents'
 */
export const agents = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: agents.url(options),
    method: 'get',
})

agents.definition = {
    methods: ["get","head"],
    url: '/agents',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClassifiedsController::agents
 * @see app/Http/Controllers/ClassifiedsController.php:528
 * @route '/agents'
 */
agents.url = (options?: RouteQueryOptions) => {
    return agents.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClassifiedsController::agents
 * @see app/Http/Controllers/ClassifiedsController.php:528
 * @route '/agents'
 */
agents.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: agents.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClassifiedsController::agents
 * @see app/Http/Controllers/ClassifiedsController.php:528
 * @route '/agents'
 */
agents.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: agents.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClassifiedsController::agents
 * @see app/Http/Controllers/ClassifiedsController.php:528
 * @route '/agents'
 */
    const agentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: agents.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClassifiedsController::agents
 * @see app/Http/Controllers/ClassifiedsController.php:528
 * @route '/agents'
 */
        agentsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: agents.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClassifiedsController::agents
 * @see app/Http/Controllers/ClassifiedsController.php:528
 * @route '/agents'
 */
        agentsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: agents.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    agents.form = agentsForm
/**
* @see \App\Http\Controllers\ClassifiedsController::savedAds
 * @see app/Http/Controllers/ClassifiedsController.php:267
 * @route '/saved-ads'
 */
export const savedAds = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: savedAds.url(options),
    method: 'get',
})

savedAds.definition = {
    methods: ["get","head"],
    url: '/saved-ads',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClassifiedsController::savedAds
 * @see app/Http/Controllers/ClassifiedsController.php:267
 * @route '/saved-ads'
 */
savedAds.url = (options?: RouteQueryOptions) => {
    return savedAds.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClassifiedsController::savedAds
 * @see app/Http/Controllers/ClassifiedsController.php:267
 * @route '/saved-ads'
 */
savedAds.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: savedAds.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClassifiedsController::savedAds
 * @see app/Http/Controllers/ClassifiedsController.php:267
 * @route '/saved-ads'
 */
savedAds.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: savedAds.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClassifiedsController::savedAds
 * @see app/Http/Controllers/ClassifiedsController.php:267
 * @route '/saved-ads'
 */
    const savedAdsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: savedAds.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClassifiedsController::savedAds
 * @see app/Http/Controllers/ClassifiedsController.php:267
 * @route '/saved-ads'
 */
        savedAdsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: savedAds.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClassifiedsController::savedAds
 * @see app/Http/Controllers/ClassifiedsController.php:267
 * @route '/saved-ads'
 */
        savedAdsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: savedAds.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    savedAds.form = savedAdsForm
/**
 * @see routes/web.php:71
 * @route '/packages'
 */
export const packages = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: packages.url(options),
    method: 'get',
})

packages.definition = {
    methods: ["get","head"],
    url: '/packages',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:71
 * @route '/packages'
 */
packages.url = (options?: RouteQueryOptions) => {
    return packages.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:71
 * @route '/packages'
 */
packages.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: packages.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:71
 * @route '/packages'
 */
packages.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: packages.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:71
 * @route '/packages'
 */
    const packagesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: packages.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:71
 * @route '/packages'
 */
        packagesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: packages.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:71
 * @route '/packages'
 */
        packagesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: packages.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    packages.form = packagesForm
/**
 * @see routes/web.php:75
 * @route '/terms-and-conditions'
 */
export const terms = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: terms.url(options),
    method: 'get',
})

terms.definition = {
    methods: ["get","head"],
    url: '/terms-and-conditions',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:75
 * @route '/terms-and-conditions'
 */
terms.url = (options?: RouteQueryOptions) => {
    return terms.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:75
 * @route '/terms-and-conditions'
 */
terms.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: terms.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:75
 * @route '/terms-and-conditions'
 */
terms.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: terms.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:75
 * @route '/terms-and-conditions'
 */
    const termsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: terms.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:75
 * @route '/terms-and-conditions'
 */
        termsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: terms.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:75
 * @route '/terms-and-conditions'
 */
        termsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: terms.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    terms.form = termsForm
/**
 * @see routes/web.php:82
 * @route '/singleview'
 */
export const singleview = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: singleview.url(options),
    method: 'get',
})

singleview.definition = {
    methods: ["get","head"],
    url: '/singleview',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:82
 * @route '/singleview'
 */
singleview.url = (options?: RouteQueryOptions) => {
    return singleview.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:82
 * @route '/singleview'
 */
singleview.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: singleview.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:82
 * @route '/singleview'
 */
singleview.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: singleview.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:82
 * @route '/singleview'
 */
    const singleviewForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: singleview.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:82
 * @route '/singleview'
 */
        singleviewForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: singleview.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:82
 * @route '/singleview'
 */
        singleviewForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: singleview.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    singleview.form = singleviewForm
/**
 * @see routes/web.php:94
 * @route '/ocruploader'
 */
export const OcrUploader = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: OcrUploader.url(options),
    method: 'get',
})

OcrUploader.definition = {
    methods: ["get","head"],
    url: '/ocruploader',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:94
 * @route '/ocruploader'
 */
OcrUploader.url = (options?: RouteQueryOptions) => {
    return OcrUploader.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:94
 * @route '/ocruploader'
 */
OcrUploader.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: OcrUploader.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:94
 * @route '/ocruploader'
 */
OcrUploader.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: OcrUploader.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:94
 * @route '/ocruploader'
 */
    const OcrUploaderForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: OcrUploader.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:94
 * @route '/ocruploader'
 */
        OcrUploaderForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: OcrUploader.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:94
 * @route '/ocruploader'
 */
        OcrUploaderForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: OcrUploader.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    OcrUploader.form = OcrUploaderForm
/**
 * @see routes/web.php:101
 * @route '/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/login',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:101
 * @route '/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:101
 * @route '/login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:101
 * @route '/login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:101
 * @route '/login'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: login.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:101
 * @route '/login'
 */
        loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:101
 * @route '/login'
 */
        loginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    login.form = loginForm
/**
* @see \App\Http\Controllers\BatchAdImportController::importBatchAds
 * @see app/Http/Controllers/BatchAdImportController.php:13
 * @route '/import-batch-ads'
 */
export const importBatchAds = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: importBatchAds.url(options),
    method: 'get',
})

importBatchAds.definition = {
    methods: ["get","head"],
    url: '/import-batch-ads',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BatchAdImportController::importBatchAds
 * @see app/Http/Controllers/BatchAdImportController.php:13
 * @route '/import-batch-ads'
 */
importBatchAds.url = (options?: RouteQueryOptions) => {
    return importBatchAds.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BatchAdImportController::importBatchAds
 * @see app/Http/Controllers/BatchAdImportController.php:13
 * @route '/import-batch-ads'
 */
importBatchAds.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: importBatchAds.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BatchAdImportController::importBatchAds
 * @see app/Http/Controllers/BatchAdImportController.php:13
 * @route '/import-batch-ads'
 */
importBatchAds.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: importBatchAds.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BatchAdImportController::importBatchAds
 * @see app/Http/Controllers/BatchAdImportController.php:13
 * @route '/import-batch-ads'
 */
    const importBatchAdsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: importBatchAds.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BatchAdImportController::importBatchAds
 * @see app/Http/Controllers/BatchAdImportController.php:13
 * @route '/import-batch-ads'
 */
        importBatchAdsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: importBatchAds.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BatchAdImportController::importBatchAds
 * @see app/Http/Controllers/BatchAdImportController.php:13
 * @route '/import-batch-ads'
 */
        importBatchAdsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: importBatchAds.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    importBatchAds.form = importBatchAdsForm
/**
 * @see routes/web.php:264
 * @route '/boost-ad-views'
 */
export const boostAdViews = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: boostAdViews.url(options),
    method: 'get',
})

boostAdViews.definition = {
    methods: ["get","head"],
    url: '/boost-ad-views',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:264
 * @route '/boost-ad-views'
 */
boostAdViews.url = (options?: RouteQueryOptions) => {
    return boostAdViews.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:264
 * @route '/boost-ad-views'
 */
boostAdViews.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: boostAdViews.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:264
 * @route '/boost-ad-views'
 */
boostAdViews.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: boostAdViews.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:264
 * @route '/boost-ad-views'
 */
    const boostAdViewsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: boostAdViews.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:264
 * @route '/boost-ad-views'
 */
        boostAdViewsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: boostAdViews.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:264
 * @route '/boost-ad-views'
 */
        boostAdViewsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: boostAdViews.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    boostAdViews.form = boostAdViewsForm
/**
 * @see routes/web.php:279
 * @route '/renew-all-ads'
 */
export const renewAllAds = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: renewAllAds.url(options),
    method: 'get',
})

renewAllAds.definition = {
    methods: ["get","head"],
    url: '/renew-all-ads',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:279
 * @route '/renew-all-ads'
 */
renewAllAds.url = (options?: RouteQueryOptions) => {
    return renewAllAds.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:279
 * @route '/renew-all-ads'
 */
renewAllAds.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: renewAllAds.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:279
 * @route '/renew-all-ads'
 */
renewAllAds.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: renewAllAds.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:279
 * @route '/renew-all-ads'
 */
    const renewAllAdsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: renewAllAds.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:279
 * @route '/renew-all-ads'
 */
        renewAllAdsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: renewAllAds.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:279
 * @route '/renew-all-ads'
 */
        renewAllAdsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: renewAllAds.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    renewAllAds.form = renewAllAdsForm
/**
 * @see routes/web.php:328
 * @route '/calling-sheet'
 */
export const callingSheet = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: callingSheet.url(options),
    method: 'get',
})

callingSheet.definition = {
    methods: ["get","head"],
    url: '/calling-sheet',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:328
 * @route '/calling-sheet'
 */
callingSheet.url = (options?: RouteQueryOptions) => {
    return callingSheet.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:328
 * @route '/calling-sheet'
 */
callingSheet.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: callingSheet.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:328
 * @route '/calling-sheet'
 */
callingSheet.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: callingSheet.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:328
 * @route '/calling-sheet'
 */
    const callingSheetForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: callingSheet.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:328
 * @route '/calling-sheet'
 */
        callingSheetForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: callingSheet.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:328
 * @route '/calling-sheet'
 */
        callingSheetForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: callingSheet.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    callingSheet.form = callingSheetForm