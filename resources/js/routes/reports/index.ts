import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
 * @see routes/web.php:352
 * @route '/reports/competitor-analysis.pdf'
 */
export const pdf = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(options),
    method: 'get',
})

pdf.definition = {
    methods: ["get","head"],
    url: '/reports/competitor-analysis.pdf',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:352
 * @route '/reports/competitor-analysis.pdf'
 */
pdf.url = (options?: RouteQueryOptions) => {
    return pdf.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:352
 * @route '/reports/competitor-analysis.pdf'
 */
pdf.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:352
 * @route '/reports/competitor-analysis.pdf'
 */
pdf.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pdf.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:352
 * @route '/reports/competitor-analysis.pdf'
 */
    const pdfForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pdf.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:352
 * @route '/reports/competitor-analysis.pdf'
 */
        pdfForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pdf.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:352
 * @route '/reports/competitor-analysis.pdf'
 */
        pdfForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pdf.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pdf.form = pdfForm
/**
 * @see routes/web.php:366
 * @route '/reports/competitor-analysis'
 */
export const html = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: html.url(options),
    method: 'get',
})

html.definition = {
    methods: ["get","head"],
    url: '/reports/competitor-analysis',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:366
 * @route '/reports/competitor-analysis'
 */
html.url = (options?: RouteQueryOptions) => {
    return html.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:366
 * @route '/reports/competitor-analysis'
 */
html.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: html.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:366
 * @route '/reports/competitor-analysis'
 */
html.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: html.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:366
 * @route '/reports/competitor-analysis'
 */
    const htmlForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: html.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:366
 * @route '/reports/competitor-analysis'
 */
        htmlForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: html.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:366
 * @route '/reports/competitor-analysis'
 */
        htmlForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: html.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    html.form = htmlForm
const reports = {
    pdf: Object.assign(pdf, pdf),
html: Object.assign(html, html),
}

export default reports