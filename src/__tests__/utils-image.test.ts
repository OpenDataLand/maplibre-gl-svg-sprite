import { describe, it, expect, vi } from 'vitest';
import {
  hasCreateImageBitmap,
  normalizeSvg,
  computeTargetSize,
  canvasToBlob,
  blobToImage
} from '../utils/image';

describe('utils/image', () => {
  describe('hasCreateImageBitmap', () => {
    it('should return true when createImageBitmap is available', () => {
      const mockWindow = {
        createImageBitmap: vi.fn()
      };

      // Mock global window
      vi.stubGlobal('window', mockWindow);

      const result = hasCreateImageBitmap();
      expect(result).toBe(true);
    });

    it('should return false when window is not available', () => {
      vi.stubGlobal('window', undefined);

      const result = hasCreateImageBitmap();
      expect(result).toBe(false);
    });

    it('should return false when createImageBitmap is not available', () => {
      const mockWindow = {};
      vi.stubGlobal('window', mockWindow);

      const result = hasCreateImageBitmap();
      expect(result).toBe(false);
    });
  });

  describe('normalizeSvg', () => {
    it('should return svg string when input is valid', () => {
      const svg = '<svg width="24" height="24"><rect/></svg>';
      const result = normalizeSvg(svg);
      expect(result).toBe(svg);
    });

    it('should throw error when input is not a string', () => {
      expect(() => normalizeSvg(null as any)).toThrow('SVG must be a string of XML');
      expect(() => normalizeSvg(123 as any)).toThrow('SVG must be a string of XML');
      expect(() => normalizeSvg({} as any)).toThrow('SVG must be a string of XML');
    });
  });

  describe('computeTargetSize', () => {
    it('should extract width and height from attributes', () => {
      const svg = '<svg width="32" height="48" xmlns="http://www.w3.org/2000/svg"><rect/></svg>';
      const result = computeTargetSize(svg, 1);
      expect(result).toEqual({ width: 32, height: 48 });
    });

    it('should extract size from viewBox when attributes missing', () => {
      const svg = '<svg viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg"><rect/></svg>';
      const result = computeTargetSize(svg, 1);
      expect(result).toEqual({ width: 64, height: 32 });
    });

    it('should apply pixel ratio scaling', () => {
      const svg = '<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><rect/></svg>';
      const result = computeTargetSize(svg, 2);
      expect(result).toEqual({ width: 48, height: 48 });
    });

    it('should default to 32x32 when no dimensions found', () => {
      const svg = '<svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>';
      const result = computeTargetSize(svg, 1);
      expect(result).toEqual({ width: 32, height: 32 });
    });

    it('should handle quoted attributes correctly', () => {
      const svg1 = '<svg width="24" height="24"><rect/></svg>';
      const svg2 = "<svg width='24' height='24'><rect/></svg>";

      expect(computeTargetSize(svg1, 1)).toEqual({ width: 24, height: 24 });
      expect(computeTargetSize(svg2, 1)).toEqual({ width: 24, height: 24 });
    });

    it('should handle invalid numeric values', () => {
      const svg = '<svg width="invalid" height="24px"><rect/></svg>';
      const result = computeTargetSize(svg, 1);
      expect(result).toEqual({ width: 32, height: 24 });
    });

    it('should handle viewBox with negative values', () => {
      const svg = '<svg viewBox="-10 -10 40 40" xmlns="http://www.w3.org/2000/svg"><rect/></svg>';
      const result = computeTargetSize(svg, 1);
      // ViewBox calculation: width = x2 - x1 = 40 - (-10) = 50
      expect(result).toEqual({ width: 50, height: 50 });
    });
  });

  describe('canvasToBlob', () => {
    it('should convert canvas to blob', async () => {
      const mockBlob = new Blob();
      const mockCanvas = {
        toBlob: vi.fn().mockImplementation((callback) => callback(mockBlob))
      } as any;

      const result = await canvasToBlob(mockCanvas);
      expect(result).toBe(mockBlob);
      expect(mockCanvas.toBlob).toHaveBeenCalled();
    });

    it('should handle canvas that fails to convert', async () => {
      const mockCanvas = {
        toBlob: vi.fn().mockImplementation((callback) => callback(null))
      } as any;

      const result = await canvasToBlob(mockCanvas);
      expect(result).toBeNull();
    });

    it('should pass quality parameter for JPEG', async () => {
      const mockBlob = new Blob();
      const mockCanvas = {
        toBlob: vi.fn().mockImplementation((callback) => callback(mockBlob))
      } as any;

      await canvasToBlob(mockCanvas, 'image/jpeg', 0.8);
      expect(mockCanvas.toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/jpeg', 0.8);
    });
  });

  describe('blobToImage', () => {
    it('should create object URL for blob', () => {
      const mockBlob = new Blob();
      global.URL.createObjectURL = vi.fn().mockReturnValue('blob:test-url');
      global.Image = vi.fn();

      blobToImage(mockBlob);

      expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
      expect(global.Image).toHaveBeenCalled();
    });
  });
});