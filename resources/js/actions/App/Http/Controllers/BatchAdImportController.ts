import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BatchAdImportController::importMethod
 * @see app/Http/Controllers/BatchAdImportController.php:13
 * @route '/import-batch-ads'
 */
export const importMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: importMethod.url(options),
    method: 'get',
})

importMethod.definition = {
    methods: ["get","head"],
    url: '/import-batch-ads',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BatchAdImportController::importMethod
 * @see app/Http/Controllers/BatchAdImportController.php:13
 * @route '/import-batch-ads'
 */
importMethod.url = (options?: RouteQueryOptions) => {
    return importMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BatchAdImportController::importMethod
 * @see app/Http/Controllers/BatchAdImportController.php:13
 * @route '/import-batch-ads'
 */
importMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: importMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BatchAdImportController::importMethod
 * @see app/Http/Controllers/BatchAdImportController.php:13
 * @route '/import-batch-ads'
 */
importMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: importMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BatchAdImportController::importMethod
 * @see app/Http/Controllers/BatchAdImportController.php:13
 * @route '/import-batch-ads'
 */
    const importMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: importMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BatchAdImportController::importMethod
 * @see app/Http/Controllers/BatchAdImportController.php:13
 * @route '/import-batch-ads'
 */
        importMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: importMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BatchAdImportController::importMethod
 * @see app/Http/Controllers/BatchAdImportController.php:13
 * @route '/import-batch-ads'
 */
        importMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: importMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    importMethod.form = importMethodForm
const BatchAdImportController = { importMethod, import: importMethod }

export default BatchAdImportController