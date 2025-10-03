import { describe, it, expect, vi } from 'vitest';
import { generateBrowserSprite } from '../sprite-core';

// Mock the image utilities since they rely on browser APIs
vi.mock('../utils/image', () => ({
  svgToBitmap: vi.fn().mockResolvedValue({
    bitmap: { width: 24, height: 24 },
    width: 24,
    height: 24
  }),
  canvasToBlob: vi.fn().mockResolvedValue(new Blob())
}));

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn().mockReturnValue('mock-url');

// Mock canvas and context
const mockContext = {
  drawImage: vi.fn(),
  getContext: vi.fn()
};

const mockCanvas = {
  width: 0,
  height: 0,
  getContext: vi.fn().mockReturnValue(mockContext)
};

global.document.createElement = vi.fn().mockReturnValue(mockCanvas);

describe('sprite-core', () => {
  describe('generateBrowserSprite', () => {
    const simpleSvg = '<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" fill="red"/></svg>';

    it('should generate sprite from single SVG', async () => {
      const result = await generateBrowserSprite({
        imgs: [{ id: 'test', svg: simpleSvg }],
        pixelRatio: 1
      });

      expect(result).toBeDefined();
      expect(result.spriteURL).toBe('mock-url');
      expect(result.jsonURL).toBe('mock-url');
      expect(result.canvas).toBeDefined();
      expect(result.json).toBeDefined();
      expect(result.json.test).toBeDefined();
      expect(result.json.test.width).toBe(24);
      expect(result.json.test.height).toBe(24);
      expect(result.json.test.pixelRatio).toBe(1);
    });

    it('should generate sprite from multiple SVGs', async () => {
      const result = await generateBrowserSprite({
        imgs: [
          { id: 'icon1', svg: simpleSvg },
          { id: 'icon2', svg: simpleSvg }
        ],
        pixelRatio: 1
      });

      expect(result.json.icon1).toBeDefined();
      expect(result.json.icon2).toBeDefined();
      expect(result.width).toBe(48); // Two 24px icons side by side
      expect(result.height).toBe(24);
    });

    it('should respect pixelRatio', async () => {
      const result = await generateBrowserSprite({
        imgs: [{ id: 'test', svg: simpleSvg }],
        pixelRatio: 2
      });

      expect(result.json.test.width).toBe(24);
      expect(result.json.test.height).toBe(24);
      expect(result.json.test.pixelRatio).toBe(2);
    });

    it('should handle invalid inputs', async () => {
      await expect(generateBrowserSprite({ imgs: [] as any, pixelRatio: 'invalid' as any }))
        .rejects.toThrow('Expected { imgs: Array<{id, svg}>, pixelRatio: number }');

      await expect(generateBrowserSprite({ imgs: 'invalid' as any, pixelRatio: 1 }))
        .rejects.toThrow('Expected { imgs: Array<{id, svg}>, pixelRatio: number }');
    });

    it('should handle empty input array', async () => {
      const result = await generateBrowserSprite({
        imgs: [],
        pixelRatio: 1
      });

      expect(result).toBeDefined();
      expect(result.width).toBe(1);
      expect(result.height).toBe(1);
      expect(Object.keys(result.json)).toHaveLength(0);
    });

    it('should set proper canvas dimensions', async () => {
      const result = await generateBrowserSprite({
        imgs: [
          { id: 'a', svg: simpleSvg },
          { id: 'b', svg: simpleSvg }
        ],
        pixelRatio: 1
      });

      expect(result.width).toBe(48); // Two 24px icons horizontally
      expect(result.height).toBe(24);
    });
  });
});