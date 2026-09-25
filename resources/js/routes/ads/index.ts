import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ClassifiedsController::save
 * @see app/Http/Controllers/ClassifiedsController.php:183
 * @route '/ads/{adId}/save'
 */
export const save = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: save.url(args, options),
    method: 'post',
})

save.definition = {
    methods: ["post"],
    url: '/ads/{adId}/save',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ClassifiedsController::save
 * @see app/Http/Controllers/ClassifiedsController.php:183
 * @route '/ads/{adId}/save'
 */
save.url = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return save.definition.url
            .replace('{adId}', parsedArgs.adId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClassifiedsController::save
 * @see app/Http/Controllers/ClassifiedsController.php:183
 * @route '/ads/{adId}/save'
 */
save.post = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: save.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ClassifiedsController::save
 * @see app/Http/Controllers/ClassifiedsController.php:183
 * @route '/ads/{adId}/save'
 */
    const saveForm = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: save.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClassifiedsController::save
 * @see app/Http/Controllers/ClassifiedsController.php:183
 * @route '/ads/{adId}/save'
 */
        saveForm.post = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: save.url(args, options),
            method: 'post',
        })
    
    save.form = saveForm
/**
* @see \App\Http\Controllers\ClassifiedsController::unsave
 * @see app/Http/Controllers/ClassifiedsController.php:202
 * @route '/ads/{adId}/unsave'
 */
export const unsave = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: unsave.url(args, options),
    method: 'post',
})

unsave.definition = {
    methods: ["post"],
    url: '/ads/{adId}/unsave',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ClassifiedsController::unsave
 * @see app/Http/Controllers/ClassifiedsController.php:202
 * @route '/ads/{adId}/unsave'
 */
unsave.url = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return unsave.definition.url
            .replace('{adId}', parsedArgs.adId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClassifiedsController::unsave
 * @see app/Http/Controllers/ClassifiedsController.php:202
 * @route '/ads/{adId}/unsave'
 */
unsave.post = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: unsave.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ClassifiedsController::unsave
 * @see app/Http/Controllers/ClassifiedsController.php:202
 * @route '/ads/{adId}/unsave'
 */
    const unsaveForm = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: unsave.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClassifiedsController::unsave
 * @see app/Http/Controllers/ClassifiedsController.php:202
 * @route '/ads/{adId}/unsave'
 */
        unsaveForm.post = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: unsave.url(args, options),
            method: 'post',
        })
    
    unsave.form = unsaveForm
/**
* @see \App\Http\Controllers\ClassifiedsController::like
 * @see app/Http/Controllers/ClassifiedsController.php:508
 * @route '/ads/{adId}/like'
 */
export const like = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: like.url(args, options),
    method: 'post',
})

like.definition = {
    methods: ["post"],
    url: '/ads/{adId}/like',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ClassifiedsController::like
 * @see app/Http/Controllers/ClassifiedsController.php:508
 * @route '/ads/{adId}/like'
 */
like.url = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return like.definition.url
            .replace('{adId}', parsedArgs.adId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClassifiedsController::like
 * @see app/Http/Controllers/ClassifiedsController.php:508
 * @route '/ads/{adId}/like'
 */
like.post = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: like.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ClassifiedsController::like
 * @see app/Http/Controllers/ClassifiedsController.php:508
 * @route '/ads/{adId}/like'
 */
    const likeForm = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: like.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClassifiedsController::like
 * @see app/Http/Controllers/ClassifiedsController.php:508
 * @route '/ads/{adId}/like'
 */
        likeForm.post = (args: { adId: string | number } | [adId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: like.url(args, options),
            method: 'post',
        })
    
    like.form = likeForm
const ads = {
    save: Object.assign(save, save),
unsave: Object.assign(unsave, unsave),
like: Object.assign(like, like),
}

export default ads