import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OcrController::processReceipt
 * @see app/Http/Controllers/OcrController.php:12
 * @route '/ocr'
 */
export const processReceipt = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: processReceipt.url(options),
    method: 'post',
})

processReceipt.definition = {
    methods: ["post"],
    url: '/ocr',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OcrController::processReceipt
 * @see app/Http/Controllers/OcrController.php:12
 * @route '/ocr'
 */
processReceipt.url = (options?: RouteQueryOptions) => {
    return processReceipt.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OcrController::processReceipt
 * @see app/Http/Controllers/OcrController.php:12
 * @route '/ocr'
 */
processReceipt.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: processReceipt.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OcrController::processReceipt
 * @see app/Http/Controllers/OcrController.php:12
 * @route '/ocr'
 */
    const processReceiptForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: processReceipt.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OcrController::processReceipt
 * @see app/Http/Controllers/OcrController.php:12
 * @route '/ocr'
 */
        processReceiptForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: processReceipt.url(options),
            method: 'post',
        })
    
    processReceipt.form = processReceiptForm
const OcrController = { processReceipt }

export default OcrController