/**
 * Function signature for canvas post-processing operations
 *
 * @param ctx - Canvas 2D rendering context
 * @param w - Width in CSS pixels
 * @param h - Height in CSS pixels
 * @param params - Query parameters from the image request
 * @returns void or Promise<void> for async operations
 */
export type Postprocess = (ctx: CanvasRenderingContext2D, w: number, h: number, params: Record<string, string>) => void | Promise<void>;
/**
 * Interface for post-processing operation objects
 */
export interface PostprocessOp {
    /** Unique identifier or descriptive name (optional, for debugging) */
    id?: string;
    /** Execute this operation on the provided canvas context */
    run: Postprocess;
}
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
export declare abstract class BaseOp implements PostprocessOp {
    /** Unique identifier or descriptive name */
    id?: string;
    /**
     * Create a new operation
     *
     * @param id - Optional identifier for debugging
     */
    constructor(id?: string);
    /**
     * Execute the post-processing operation
     *
     * @param ctx - Canvas 2D rendering context
     * @param w - Width in CSS pixels
     * @param h - Height in CSS pixels
     * @param params - Query parameters from the image request
     */
    abstract run(ctx: CanvasRenderingContext2D, w: number, h: number, params: Record<string, string>): void | Promise<void>;
}
/**
 * Type guard to check if an object is a PostprocessOp
 *
 * @param x - Value to check
 * @returns True if x is a PostprocessOp
 */
export declare function isOp(x: any): x is PostprocessOp;
/**
 * Wrap an operation instance into a plain Postprocess function
 *
 * @param op - PostprocessOp instance
 * @returns Postprocess function
 */
export declare function asPostprocess(op: PostprocessOp): Postprocess;
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
export declare function chain(...ops: Array<Postprocess | PostprocessOp>): Postprocess;
