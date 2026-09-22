import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import loginDf2c2a from './login'
import adsC94785 from './ads'
import post29fcbb from './post'
import payments4e2b3d from './payments'
import profile937a89 from './profile'
/**
* @see \App\Http\Controllers\AgentAuthController::login
 * @see app/Http/Controllers/AgentAuthController.php:14
 * @route '/agent/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/agent/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AgentAuthController::login
 * @see app/Http/Controllers/AgentAuthController.php:14
 * @route '/agent/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentAuthController::login
 * @see app/Http/Controllers/AgentAuthController.php:14
 * @route '/agent/login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AgentAuthController::login
 * @see app/Http/Controllers/AgentAuthController.php:14
 * @route '/agent/login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AgentAuthController::login
 * @see app/Http/Controllers/AgentAuthController.php:14
 * @route '/agent/login'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: login.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AgentAuthController::login
 * @see app/Http/Controllers/AgentAuthController.php:14
 * @route '/agent/login'
 */
        loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AgentAuthController::login
 * @see app/Http/Controllers/AgentAuthController.php:14
 * @route '/agent/login'
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
* @see \App\Http\Controllers\AgentAuthController::logout
 * @see app/Http/Controllers/AgentAuthController.php:76
 * @route '/agent/logout'
 */
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/agent/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AgentAuthController::logout
 * @see app/Http/Controllers/AgentAuthController.php:76
 * @route '/agent/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentAuthController::logout
 * @see app/Http/Controllers/AgentAuthController.php:76
 * @route '/agent/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AgentAuthController::logout
 * @see app/Http/Controllers/AgentAuthController.php:76
 * @route '/agent/logout'
 */
    const logoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: logout.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AgentAuthController::logout
 * @see app/Http/Controllers/AgentAuthController.php:76
 * @route '/agent/logout'
 */
        logoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: logout.url(options),
            method: 'post',
        })
    
    logout.form = logoutForm
/**
 * @see routes/web.php:138
 * @route '/agent'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/agent',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:138
 * @route '/agent'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:138
 * @route '/agent'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:138
 * @route '/agent'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:138
 * @route '/agent'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:138
 * @route '/agent'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:138
 * @route '/agent'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
/**
 * @see routes/web.php:144
 * @route '/agent/mainhome'
 */
export const mainhome = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mainhome.url(options),
    method: 'get',
})

mainhome.definition = {
    methods: ["get","head"],
    url: '/agent/mainhome',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:144
 * @route '/agent/mainhome'
 */
mainhome.url = (options?: RouteQueryOptions) => {
    return mainhome.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:144
 * @route '/agent/mainhome'
 */
mainhome.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mainhome.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:144
 * @route '/agent/mainhome'
 */
mainhome.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: mainhome.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:144
 * @route '/agent/mainhome'
 */
    const mainhomeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: mainhome.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:144
 * @route '/agent/mainhome'
 */
        mainhomeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: mainhome.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:144
 * @route '/agent/mainhome'
 */
        mainhomeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: mainhome.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    mainhome.form = mainhomeForm
/**
* @see \App\Http\Controllers\AgentAdController::ads
 * @see app/Http/Controllers/AgentAdController.php:373
 * @route '/agent/ads'
 */
export const ads = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ads.url(options),
    method: 'get',
})

ads.definition = {
    methods: ["get","head"],
    url: '/agent/ads',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AgentAdController::ads
 * @see app/Http/Controllers/AgentAdController.php:373
 * @route '/agent/ads'
 */
ads.url = (options?: RouteQueryOptions) => {
    return ads.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentAdController::ads
 * @see app/Http/Controllers/AgentAdController.php:373
 * @route '/agent/ads'
 */
ads.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ads.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AgentAdController::ads
 * @see app/Http/Controllers/AgentAdController.php:373
 * @route '/agent/ads'
 */
ads.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ads.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AgentAdController::ads
 * @see app/Http/Controllers/AgentAdController.php:373
 * @route '/agent/ads'
 */
    const adsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ads.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AgentAdController::ads
 * @see app/Http/Controllers/AgentAdController.php:373
 * @route '/agent/ads'
 */
        adsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ads.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AgentAdController::ads
 * @see app/Http/Controllers/AgentAdController.php:373
 * @route '/agent/ads'
 */
        adsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ads.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ads.form = adsForm
/**
* @see \App\Http\Controllers\AgentAdController::post
 * @see app/Http/Controllers/AgentAdController.php:26
 * @route '/agent/post'
 */
export const post = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: post.url(options),
    method: 'get',
})

post.definition = {
    methods: ["get","head"],
    url: '/agent/post',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AgentAdController::post
 * @see app/Http/Controllers/AgentAdController.php:26
 * @route '/agent/post'
 */
post.url = (options?: RouteQueryOptions) => {
    return post.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentAdController::post
 * @see app/Http/Controllers/AgentAdController.php:26
 * @route '/agent/post'
 */
post.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: post.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AgentAdController::post
 * @see app/Http/Controllers/AgentAdController.php:26
 * @route '/agent/post'
 */
post.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: post.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AgentAdController::post
 * @see app/Http/Controllers/AgentAdController.php:26
 * @route '/agent/post'
 */
    const postForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: post.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AgentAdController::post
 * @see app/Http/Controllers/AgentAdController.php:26
 * @route '/agent/post'
 */
        postForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: post.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AgentAdController::post
 * @see app/Http/Controllers/AgentAdController.php:26
 * @route '/agent/post'
 */
        postForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: post.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    post.form = postForm
/**
* @see \App\Http\Controllers\AgentAdController::commission
 * @see app/Http/Controllers/AgentAdController.php:609
 * @route '/agent/commission'
 */
export const commission = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: commission.url(options),
    method: 'get',
})

commission.definition = {
    methods: ["get","head"],
    url: '/agent/commission',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AgentAdController::commission
 * @see app/Http/Controllers/AgentAdController.php:609
 * @route '/agent/commission'
 */
commission.url = (options?: RouteQueryOptions) => {
    return commission.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentAdController::commission
 * @see app/Http/Controllers/AgentAdController.php:609
 * @route '/agent/commission'
 */
commission.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: commission.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AgentAdController::commission
 * @see app/Http/Controllers/AgentAdController.php:609
 * @route '/agent/commission'
 */
commission.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: commission.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AgentAdController::commission
 * @see app/Http/Controllers/AgentAdController.php:609
 * @route '/agent/commission'
 */
    const commissionForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: commission.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AgentAdController::commission
 * @see app/Http/Controllers/AgentAdController.php:609
 * @route '/agent/commission'
 */
        commissionForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: commission.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AgentAdController::commission
 * @see app/Http/Controllers/AgentAdController.php:609
 * @route '/agent/commission'
 */
        commissionForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: commission.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    commission.form = commissionForm
/**
* @see \App\Http\Controllers\AgentAdController::payments
 * @see app/Http/Controllers/AgentAdController.php:419
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
 * @see app/Http/Controllers/AgentAdController.php:419
 * @route '/agent/payments'
 */
payments.url = (options?: RouteQueryOptions) => {
    return payments.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentAdController::payments
 * @see app/Http/Controllers/AgentAdController.php:419
 * @route '/agent/payments'
 */
payments.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payments.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AgentAdController::payments
 * @see app/Http/Controllers/AgentAdController.php:419
 * @route '/agent/payments'
 */
payments.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: payments.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AgentAdController::payments
 * @see app/Http/Controllers/AgentAdController.php:419
 * @route '/agent/payments'
 */
    const paymentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: payments.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AgentAdController::payments
 * @see app/Http/Controllers/AgentAdController.php:419
 * @route '/agent/payments'
 */
        paymentsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: payments.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AgentAdController::payments
 * @see app/Http/Controllers/AgentAdController.php:419
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
* @see \App\Http\Controllers\AgentAdController::profile
 * @see app/Http/Controllers/AgentAdController.php:690
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
 * @see app/Http/Controllers/AgentAdController.php:690
 * @route '/agent/profile'
 */
profile.url = (options?: RouteQueryOptions) => {
    return profile.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgentAdController::profile
 * @see app/Http/Controllers/AgentAdController.php:690
 * @route '/agent/profile'
 */
profile.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profile.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AgentAdController::profile
 * @see app/Http/Controllers/AgentAdController.php:690
 * @route '/agent/profile'
 */
profile.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: profile.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AgentAdController::profile
 * @see app/Http/Controllers/AgentAdController.php:690
 * @route '/agent/profile'
 */
    const profileForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: profile.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AgentAdController::profile
 * @see app/Http/Controllers/AgentAdController.php:690
 * @route '/agent/profile'
 */
        profileForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: profile.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AgentAdController::profile
 * @see app/Http/Controllers/AgentAdController.php:690
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
const agent = {
    login: Object.assign(login, loginDf2c2a),
logout: Object.assign(logout, logout),
dashboard: Object.assign(dashboard, dashboard),
mainhome: Object.assign(mainhome, mainhome),
ads: Object.assign(ads, adsC94785),
post: Object.assign(post, post29fcbb),
commission: Object.assign(commission, commission),
payments: Object.assign(payments, payments4e2b3d),
profile: Object.assign(profile, profile937a89),
}

export default agent