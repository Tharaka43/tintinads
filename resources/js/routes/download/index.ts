import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
 * @see routes/web.php:268
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
 * @see routes/web.php:268
 * @route '/download-vcf'
 */
vcf.url = (options?: RouteQueryOptions) => {
    return vcf.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:268
 * @route '/download-vcf'
 */
vcf.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vcf.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:268
 * @route '/download-vcf'
 */
vcf.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: vcf.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:268
 * @route '/download-vcf'
 */
    const vcfForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: vcf.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:268
 * @route '/download-vcf'
 */
        vcfForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: vcf.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:268
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
const download = {
    vcf: Object.assign(vcf, vcf),
}

export default download