/**
 * Base class for creating custom post-processing operations
 *
 * Extend this class and implement the `run` method. Instance properties can store state.
 *
 * @example
 * ```typescript
 * class CustomOp extends BaseOp {
 *   async run(ctx, w, h, params) {
 *     ctx.fillStyle = params.color || 'red';
 *     ctx.fillRect(0, 0, w, h);
 *   }
 * }
 * ```
 */
export class BaseOp {
    /**
     * Create a new operation
     *
     * @param id - Optional identifier for debugging
     */
    constructor(id) { this.id = id; }
}
/**
 * Type guard to check if an object is a PostprocessOp
 *
 * @param x - Value to check
 * @returns True if x is a PostprocessOp
 */
export function isOp(x) {
    return !!x && typeof x === 'object' && typeof x.run === 'function';
}
/**
 * Wrap an operation instance into a plain Postprocess function
 *
 * @param op - PostprocessOp instance
 * @returns Postprocess function
 */
export function asPostprocess(op) {
    return (ctx, w, h, params) => op.run(ctx, w, h, params);
}
/**
 * Compose multiple operations into a single Postprocess function
 *
 * Operations are executed sequentially in the order provided.
 *
 * @param ops - Array of operations (instances or plain functions)
 * @returns Composed Postprocess function
 *
 * @example
 * ```typescript
 * const composed = chain(
 *   new GridOp(),
 *   new TextOp(),
 *   (ctx, w, h) => { ctx.globalAlpha = 0.5; }
 * );
 * ```
 */
export function chain(...ops) {
    return async (ctx, w, h, params) => {
        for (const op of ops) {
            const fn = isOp(op) ? op.run.bind(op) : op;
            await fn(ctx, w, h, params);
        }
    };
}
