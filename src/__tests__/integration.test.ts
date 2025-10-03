import { describe, it, expect, vi } from 'vitest';
import { generateBrowserSprite } from '../sprite-core';
import { SpriteTint, OverlayText, chain } from '../ops';
import { parseQuery, applySvgParams } from '../utils/params';

// Mock dependencies for integration tests
vi.mock('../utils/image', () => ({
  svgToBitmap: vi.fn().mockResolvedValue({
    bitmap: { width: 24, height: 24 },
    width: 24,
    height: 24
  }),
  canvasToBlob: vi.fn().mockResolvedValue(new Blob())
}));

global.URL.createObjectURL = vi.fn().mockReturnValue('mock-url');
global.document.createElement = vi.fn().mockReturnValue({
  width: 24,
  height: 24,
  getContext: vi.fn().mockReturnValue({
    drawImage: vi.fn(),
    fillRect: vi.fn(),
    fillText: vi.fn(),
    strokeText: vi.fn(),
    fillStyle: '',
    strokeStyle: '',
    font: '',
    textAlign: 'center',
    textBaseline: 'middle',
    globalCompositeOperation: 'source-over'
  })
});

describe('Integration Tests', () => {
  describe('End-to-End Sprite Generation', () => {
    it('should generate a complete sprite with multiple icons', async () => {
      const icons = [
        { id: 'icon1', svg: '<svg width="24" height="24"><rect fill="red"/></svg>' },
        { id: 'icon2', svg: '<svg width="24" height="24"><circle fill="blue"/></svg>' }
      ];

      const result = await generateBrowserSprite({ imgs: icons, pixelRatio: 1 });

      expect(result.spriteURL).toBe('mock-url');
      expect(result.jsonURL).toBe('mock-url');
      expect(result.json.icon1).toBeDefined();
      expect(result.json.icon2).toBeDefined();
      expect(result.width).toBe(48); // Two 24px icons
      expect(result.height).toBe(24);
    });

    it('should handle high DPI sprites', async () => {
      const icons = [
        { id: 'hdpi-icon', svg: '<svg width="24" height="24"><rect fill="green"/></svg>' }
      ];

      const result = await generateBrowserSprite({ imgs: icons, pixelRatio: 2 });

      expect(result.json['hdpi-icon'].pixelRatio).toBe(2);
      expect(result.json['hdpi-icon'].width).toBe(24);
      expect(result.json['hdpi-icon'].height).toBe(24);
    });
  });

  describe('Operation Chaining', () => {
    it('should chain multiple operations correctly', () => {
      const tint = new SpriteTint();
      const text = new OverlayText();
      const chained = chain(tint, text);

      expect(typeof chained).toBe('function');

      // Test that the chained function can be called
      const mockContext = {
        fillRect: vi.fn(),
        fillText: vi.fn(),
        strokeText: vi.fn(),
        globalCompositeOperation: 'source-over',
        fillStyle: '#000',
        strokeStyle: '#000',
        font: 'normal 14px Arial',
        textAlign: 'center',
        textBaseline: 'middle'
      };

      expect(() => chained(mockContext as any, 64, 64, { color: 'red', text: 'Hello' }))
        .not.toThrow();
    });
  });

  describe('Parameter Processing', () => {
    it('should parse and apply SVG parameters correctly', () => {
      const query = 'color=red&width=32&height=32';
      const params = parseQuery(query);

      expect(params).toEqual({
        color: 'red',
        width: '32',
        height: '32'
      });

      const svg = '<svg width="24" height="24"><rect/></svg>';
      const result = applySvgParams(svg, params);

      expect(result).toContain('width="32"');
      expect(result).toContain('height="32"');
      expect(result).toContain('fill="red"');
    });

    it('should handle encoded parameters', () => {
      const query = 'color=%23ff0000&text=Hello%20World';
      const params = parseQuery(query);

      expect(params.color).toBe('#ff0000');
      expect(params.text).toBe('Hello World');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid sprite generation input', async () => {
      await expect(generateBrowserSprite({ imgs: 'invalid' as any, pixelRatio: 1 }))
        .rejects.toThrow('Expected { imgs: Array<{id, svg}>, pixelRatio: number }');
    });

    it('should handle empty icon arrays gracefully', async () => {
      const result = await generateBrowserSprite({ imgs: [], pixelRatio: 1 });

      expect(result.width).toBe(1);
      expect(result.height).toBe(1);
      expect(Object.keys(result.json)).toHaveLength(0);
    });
  });
});