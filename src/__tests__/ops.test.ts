import { describe, it, expect, vi } from 'vitest';
import { chain } from '../ops/base';
import { SpriteTint } from '../ops/sprite-tint';
import { OverlayText } from '../ops/overlay-text';

describe('ops/base', () => {
  describe('chain', () => {
    it('should compose multiple operations', () => {
      const tint = new SpriteTint();
      const text = new OverlayText();
      const composed = chain(tint, text);

      expect(typeof composed).toBe('function');
    });

    it('should execute operations in order', async () => {
      const calls: string[] = [];

      const op1 = () => {
        calls.push('op1');
      };

      const op2 = () => {
        calls.push('op2');
      };

      const composed = chain(op1, op2);
      const mockCtx = {} as CanvasRenderingContext2D;
      await composed(mockCtx, 64, 64, {});

      expect(calls).toEqual(['op1', 'op2']);
    });

    it('should handle empty chain', () => {
      const composed = chain();
      const mockCtx = {} as CanvasRenderingContext2D;
      expect(() => composed(mockCtx, 64, 64, {})).not.toThrow();
    });

    it('should pass context and params to operations', () => {
      const mockOp = vi.fn();
      const composed = chain(mockOp);
      const mockCtx = {} as CanvasRenderingContext2D;
      const params = { test: 'value' };

      composed(mockCtx, 64, 48, params);

      expect(mockOp).toHaveBeenCalledWith(mockCtx, 64, 48, params);
    });
  });
});

describe('ops/sprite-tint', () => {
  it('should create SpriteTint instance', () => {
    const tint = new SpriteTint();
    expect(tint).toBeInstanceOf(SpriteTint);
    expect(tint.id).toBe('spriteTint');
  });

  it('should have run method', () => {
    const tint = new SpriteTint();
    expect(typeof tint.run).toBe('function');
  });

  it('should not throw when run with valid params', () => {
    const tint = new SpriteTint();
    const mockCtx = {
      fillRect: vi.fn(),
      globalCompositeOperation: 'source-over',
      fillStyle: '#000000'
    } as any;

    expect(() => tint.run(mockCtx, 64, 64, { color: 'red' })).not.toThrow();
    expect(mockCtx.fillRect).toHaveBeenCalledWith(0, 0, 64, 64);
  });

  it('should not apply tint if no color param provided', () => {
    const tint = new SpriteTint();
    const mockCtx = {
      fillRect: vi.fn(),
      globalCompositeOperation: 'source-over',
      fillStyle: '#000000'
    } as any;

    tint.run(mockCtx, 64, 64, {});
    expect(mockCtx.fillRect).not.toHaveBeenCalled();
  });
});

describe('ops/overlay-text', () => {
  it('should create OverlayText instance', () => {
    const text = new OverlayText();
    expect(text).toBeInstanceOf(OverlayText);
    expect(text.id).toBe('overlayText');
  });

  it('should have run method', () => {
    const text = new OverlayText();
    expect(typeof text.run).toBe('function');
  });
});