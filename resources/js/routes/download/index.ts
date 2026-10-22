import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
 * @see routes/web.php:300
 * @route '/download-vcf'
 */
export const vcf = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vcf.url(options),
    method: 'get',
})

vcf.definition = {
    methods: ["get","head"],
    url: '/download-vcf',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:300
 * @route '/download-vcf'
 */
vcf.url = (options?: RouteQueryOptions) => {
    return vcf.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:300
 * @route '/download-vcf'
 */
vcf.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vcf.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:300
 * @route '/download-vcf'
 */
vcf.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: vcf.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:300
 * @route '/download-vcf'
 */
    const vcfForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: vcf.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:300
 * @route '/download-vcf'
 */
        vcfForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: vcf.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:300
 * @route '/download-vcf'
 */
        vcfForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: vcf.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    vcf.form = vcfForm
/**
 * @see routes/web.php:316
 * @route '/download-fresh-vcf'
 */
export const freshVcf = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: freshVcf.url(options),
    method: 'get',
})

freshVcf.definition = {
    methods: ["get","head"],
    url: '/download-fresh-vcf',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:316
 * @route '/download-fresh-vcf'
 */
freshVcf.url = (options?: RouteQueryOptions) => {
    return freshVcf.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:316
 * @route '/download-fresh-vcf'
 */
freshVcf.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: freshVcf.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:316
 * @route '/download-fresh-vcf'
 */
freshVcf.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: freshVcf.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:316
 * @route '/download-fresh-vcf'
 */
    const freshVcfForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: freshVcf.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:316
 * @route '/download-fresh-vcf'
 */
        freshVcfForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: freshVcf.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:316
 * @route '/download-fresh-vcf'
 */
        freshVcfForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: freshVcf.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    freshVcf.form = freshVcfForm
/**
 * @see routes/web.php:334
 * @route '/download-lankaad-vcf'
 */
export const lankaadVcf = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: lankaadVcf.url(options),
    method: 'get',
})

lankaadVcf.definition = {
    methods: ["get","head"],
    url: '/download-lankaad-vcf',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:334
 * @route '/download-lankaad-vcf'
 */
lankaadVcf.url = (options?: RouteQueryOptions) => {
    return lankaadVcf.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:334
 * @route '/download-lankaad-vcf'
 */
lankaadVcf.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: lankaadVcf.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:334
 * @route '/download-lankaad-vcf'
 */
lankaadVcf.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: lankaadVcf.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:334
 * @route '/download-lankaad-vcf'
 */
    const lankaadVcfForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: lankaadVcf.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:334
 * @route '/download-lankaad-vcf'
 */
        lankaadVcfForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: lankaadVcf.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:334
 * @route '/download-lankaad-vcf'
 */
        lankaadVcfForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: lankaadVcf.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    lankaadVcf.form = lankaadVcfForm
/**
 * @see routes/web.php:343
 * @route '/download-lankaad-csv'
 */
export const lankaadCsv = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: lankaadCsv.url(options),
    method: 'get',
})

lankaadCsv.definition = {
    methods: ["get","head"],
    url: '/download-lankaad-csv',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:343
 * @route '/download-lankaad-csv'
 */
lankaadCsv.url = (options?: RouteQueryOptions) => {
    return lankaadCsv.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:343
 * @route '/download-lankaad-csv'
 */
lankaadCsv.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: lankaadCsv.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:343
 * @route '/download-lankaad-csv'
 */
lankaadCsv.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: lankaadCsv.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:343
 * @route '/download-lankaad-csv'
 */
    const lankaadCsvForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: lankaadCsv.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:343
 * @route '/download-lankaad-csv'
 */
        lankaadCsvForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: lankaadCsv.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:343
 * @route '/download-lankaad-csv'
 */
        lankaadCsvForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: lankaadCsv.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    lankaadCsv.form = lankaadCsvForm
const download = {
    vcf: Object.assign(vcf, vcf),
freshVcf: Object.assign(freshVcf, freshVcf),
lankaadVcf: Object.assign(lankaadVcf, lankaadVcf),
lankaadCsv: Object.assign(lankaadCsv, lankaadCsv),
}

export default download