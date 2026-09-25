import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ClassifiedsController::index
 * @see app/Http/Controllers/ClassifiedsController.php:16
 * @route '/'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClassifiedsController::index
 * @see app/Http/Controllers/ClassifiedsController.php:16
 * @route '/'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClassifiedsController::index
 * @see app/Http/Controllers/ClassifiedsController.php:16
 * @route '/'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClassifiedsController::index
 * @see app/Http/Controllers/ClassifiedsController.php:16
 * @route '/'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClassifiedsController::index
 * @see app/Http/Controllers/ClassifiedsController.php:16
 * @route '/'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClassifiedsController::index
 * @see app/Http/Controllers/ClassifiedsController.php:16
 * @route '/'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClassifiedsController::index
 * @see app/Http/Controllers/ClassifiedsController.php:16
 * @route '/'
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
* @see \App\Http\Controllers\ClassifiedsController::agents
 * @see app/Http/Controllers/ClassifiedsController.php:465
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
 * @see app/Http/Controllers/ClassifiedsController.php:465
 * @route '/agents'
 */
agents.url = (options?: RouteQueryOptions) => {
    return agents.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClassifiedsController::agents
 * @see app/Http/Controllers/ClassifiedsController.php:465
 * @route '/agents'
 */
agents.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: agents.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClassifiedsController::agents
 * @see app/Http/Controllers/ClassifiedsController.php:465
 * @route '/agents'
 */
agents.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: agents.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClassifiedsController::agents
 * @see app/Http/Controllers/ClassifiedsController.php:465
 * @route '/agents'
 */
    const agentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: agents.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClassifiedsController::agents
 * @see app/Http/Controllers/ClassifiedsController.php:465
 * @route '/agents'
 */
        agentsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: agents.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClassifiedsController::agents
 * @see app/Http/Controllers/ClassifiedsController.php:465
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
 * @see app/Http/Controllers/ClassifiedsController.php:218
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
 * @see app/Http/Controllers/ClassifiedsController.php:218
 * @route '/saved-ads'
 */
savedAds.url = (options?: RouteQueryOptions) => {
    return savedAds.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClassifiedsController::savedAds
 * @see app/Http/Controllers/ClassifiedsController.php:218
 * @route '/saved-ads'
 */
savedAds.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: savedAds.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClassifiedsController::savedAds
 * @see app/Http/Controllers/ClassifiedsController.php:218
 * @route '/saved-ads'
 */
savedAds.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: savedAds.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClassifiedsController::savedAds
 * @see app/Http/Controllers/ClassifiedsController.php:218
 * @route '/saved-ads'
 */
    const savedAdsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: savedAds.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClassifiedsController::savedAds
 * @see app/Http/Controllers/ClassifiedsController.php:218
 * @route '/saved-ads'
 */
        savedAdsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: savedAds.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClassifiedsController::savedAds
 * @see app/Http/Controllers/ClassifiedsController.php:218
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
* @see \App\Http\Controllers\ClassifiedsController::saveAd
 * @see app/Http/Controllers/ClassifiedsController.php:183
 * @route '/ads/{adId}/save'
 */
export const saveAd = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveAd.url(args, options),
    method: 'post',
})

saveAd.definition = {
    methods: ["post"],
    url: '/ads/{adId}/save',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ClassifiedsController::saveAd
 * @see app/Http/Controllers/ClassifiedsController.php:183
 * @route '/ads/{adId}/save'
 */
saveAd.url = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { adId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    adId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        adId: args.adId,
                }

    return saveAd.definition.url
            .replace('{adId}', parsedArgs.adId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClassifiedsController::saveAd
 * @see app/Http/Controllers/ClassifiedsController.php:183
 * @route '/ads/{adId}/save'
 */
saveAd.post = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveAd.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ClassifiedsController::saveAd
 * @see app/Http/Controllers/ClassifiedsController.php:183
 * @route '/ads/{adId}/save'
 */
    const saveAdForm = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: saveAd.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClassifiedsController::saveAd
 * @see app/Http/Controllers/ClassifiedsController.php:183
 * @route '/ads/{adId}/save'
 */
        saveAdForm.post = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: saveAd.url(args, options),
            method: 'post',
        })
    
    saveAd.form = saveAdForm
/**
* @see \App\Http\Controllers\ClassifiedsController::unsaveAd
 * @see app/Http/Controllers/ClassifiedsController.php:202
 * @route '/ads/{adId}/unsave'
 */
export const unsaveAd = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: unsaveAd.url(args, options),
    method: 'post',
})

unsaveAd.definition = {
    methods: ["post"],
    url: '/ads/{adId}/unsave',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ClassifiedsController::unsaveAd
 * @see app/Http/Controllers/ClassifiedsController.php:202
 * @route '/ads/{adId}/unsave'
 */
unsaveAd.url = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { adId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    adId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        adId: args.adId,
                }

    return unsaveAd.definition.url
            .replace('{adId}', parsedArgs.adId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClassifiedsController::unsaveAd
 * @see app/Http/Controllers/ClassifiedsController.php:202
 * @route '/ads/{adId}/unsave'
 */
unsaveAd.post = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: unsaveAd.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ClassifiedsController::unsaveAd
 * @see app/Http/Controllers/ClassifiedsController.php:202
 * @route '/ads/{adId}/unsave'
 */
    const unsaveAdForm = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: unsaveAd.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClassifiedsController::unsaveAd
 * @see app/Http/Controllers/ClassifiedsController.php:202
 * @route '/ads/{adId}/unsave'
 */
        unsaveAdForm.post = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: unsaveAd.url(args, options),
            method: 'post',
        })
    
    unsaveAd.form = unsaveAdForm
/**
* @see \App\Http\Controllers\ClassifiedsController::likeAd
 * @see app/Http/Controllers/ClassifiedsController.php:508
 * @route '/ads/{adId}/like'
 */
export const likeAd = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: likeAd.url(args, options),
    method: 'post',
})

likeAd.definition = {
    methods: ["post"],
    url: '/ads/{adId}/like',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ClassifiedsController::likeAd
 * @see app/Http/Controllers/ClassifiedsController.php:508
 * @route '/ads/{adId}/like'
 */
likeAd.url = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { adId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    adId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        adId: args.adId,
                }

    return likeAd.definition.url
            .replace('{adId}', parsedArgs.adId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClassifiedsController::likeAd
 * @see app/Http/Controllers/ClassifiedsController.php:508
 * @route '/ads/{adId}/like'
 */
likeAd.post = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: likeAd.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ClassifiedsController::likeAd
 * @see app/Http/Controllers/ClassifiedsController.php:508
 * @route '/ads/{adId}/like'
 */
    const likeAdForm = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: likeAd.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClassifiedsController::likeAd
 * @see app/Http/Controllers/ClassifiedsController.php:508
 * @route '/ads/{adId}/like'
 */
        likeAdForm.post = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: likeAd.url(args, options),
            method: 'post',
        })
    
    likeAd.form = likeAdForm
/**
* @see \App\Http\Controllers\ClassifiedsController::show
 * @see app/Http/Controllers/ClassifiedsController.php:308
 * @route '/ad/{adId}'
 */
export const show = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/ad/{adId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClassifiedsController::show
 * @see app/Http/Controllers/ClassifiedsController.php:308
 * @route '/ad/{adId}'
 */
show.url = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { adId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    adId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        adId: args.adId,
                }

    return show.definition.url
            .replace('{adId}', parsedArgs.adId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClassifiedsController::show
 * @see app/Http/Controllers/ClassifiedsController.php:308
 * @route '/ad/{adId}'
 */
show.get = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClassifiedsController::show
 * @see app/Http/Controllers/ClassifiedsController.php:308
 * @route '/ad/{adId}'
 */
show.head = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClassifiedsController::show
 * @see app/Http/Controllers/ClassifiedsController.php:308
 * @route '/ad/{adId}'
 */
    const showForm = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClassifiedsController::show
 * @see app/Http/Controllers/ClassifiedsController.php:308
 * @route '/ad/{adId}'
 */
        showForm.get = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClassifiedsController::show
 * @see app/Http/Controllers/ClassifiedsController.php:308
 * @route '/ad/{adId}'
 */
        showForm.head = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const ClassifiedsController = { index, agents, savedAds, saveAd, unsaveAd, likeAd, show }

export default ClassifiedsController