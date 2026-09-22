import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../wayfinder'
/**
* @see \App\Http\Controllers\ClassifiedsController::home
 * @see app/Http/Controllers/ClassifiedsController.php:16
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
 * @see app/Http/Controllers/ClassifiedsController.php:16
 * @route '/'
 */
home.url = (options?: RouteQueryOptions) => {
    return home.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClassifiedsController::home
 * @see app/Http/Controllers/ClassifiedsController.php:16
 * @route '/'
 */
home.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClassifiedsController::home
 * @see app/Http/Controllers/ClassifiedsController.php:16
 * @route '/'
 */
home.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: home.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClassifiedsController::home
 * @see app/Http/Controllers/ClassifiedsController.php:16
 * @route '/'
 */
    const homeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: home.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClassifiedsController::home
 * @see app/Http/Controllers/ClassifiedsController.php:16
 * @route '/'
 */
        homeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: home.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClassifiedsController::home
 * @see app/Http/Controllers/ClassifiedsController.php:16
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
 * @see app/Http/Controllers/ClassifiedsController.php:453
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
 * @see app/Http/Controllers/ClassifiedsController.php:453
 * @route '/agents'
 */
agents.url = (options?: RouteQueryOptions) => {
    return agents.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClassifiedsController::agents
 * @see app/Http/Controllers/ClassifiedsController.php:453
 * @route '/agents'
 */
agents.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: agents.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClassifiedsController::agents
 * @see app/Http/Controllers/ClassifiedsController.php:453
 * @route '/agents'
 */
agents.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: agents.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClassifiedsController::agents
 * @see app/Http/Controllers/ClassifiedsController.php:453
 * @route '/agents'
 */
    const agentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: agents.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClassifiedsController::agents
 * @see app/Http/Controllers/ClassifiedsController.php:453
 * @route '/agents'
 */
        agentsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: agents.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClassifiedsController::agents
 * @see app/Http/Controllers/ClassifiedsController.php:453
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
 * @see app/Http/Controllers/ClassifiedsController.php:211
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
 * @see app/Http/Controllers/ClassifiedsController.php:211
 * @route '/saved-ads'
 */
savedAds.url = (options?: RouteQueryOptions) => {
    return savedAds.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClassifiedsController::savedAds
 * @see app/Http/Controllers/ClassifiedsController.php:211
 * @route '/saved-ads'
 */
savedAds.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: savedAds.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClassifiedsController::savedAds
 * @see app/Http/Controllers/ClassifiedsController.php:211
 * @route '/saved-ads'
 */
savedAds.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: savedAds.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClassifiedsController::savedAds
 * @see app/Http/Controllers/ClassifiedsController.php:211
 * @route '/saved-ads'
 */
    const savedAdsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: savedAds.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClassifiedsController::savedAds
 * @see app/Http/Controllers/ClassifiedsController.php:211
 * @route '/saved-ads'
 */
        savedAdsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: savedAds.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClassifiedsController::savedAds
 * @see app/Http/Controllers/ClassifiedsController.php:211
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
 * @see routes/web.php:22
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
 * @see routes/web.php:22
 * @route '/terms-and-conditions'
 */
terms.url = (options?: RouteQueryOptions) => {
    return terms.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:22
 * @route '/terms-and-conditions'
 */
terms.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: terms.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:22
 * @route '/terms-and-conditions'
 */
terms.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: terms.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:22
 * @route '/terms-and-conditions'
 */
    const termsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: terms.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:22
 * @route '/terms-and-conditions'
 */
        termsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: terms.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:22
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
 * @see routes/web.php:25
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
 * @see routes/web.php:25
 * @route '/singleview'
 */
singleview.url = (options?: RouteQueryOptions) => {
    return singleview.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:25
 * @route '/singleview'
 */
singleview.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: singleview.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:25
 * @route '/singleview'
 */
singleview.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: singleview.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:25
 * @route '/singleview'
 */
    const singleviewForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: singleview.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:25
 * @route '/singleview'
 */
        singleviewForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: singleview.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:25
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
 * @see routes/web.php:29
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
 * @see routes/web.php:29
 * @route '/ocruploader'
 */
OcrUploader.url = (options?: RouteQueryOptions) => {
    return OcrUploader.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:29
 * @route '/ocruploader'
 */
OcrUploader.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: OcrUploader.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:29
 * @route '/ocruploader'
 */
OcrUploader.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: OcrUploader.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:29
 * @route '/ocruploader'
 */
    const OcrUploaderForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: OcrUploader.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:29
 * @route '/ocruploader'
 */
        OcrUploaderForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: OcrUploader.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:29
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
 * @see routes/web.php:36
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
 * @see routes/web.php:36
 * @route '/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:36
 * @route '/login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:36
 * @route '/login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:36
 * @route '/login'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: login.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:36
 * @route '/login'
 */
        loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:36
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