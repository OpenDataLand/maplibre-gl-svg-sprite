import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ensureFontLoaded } from '../utils/fonts';

describe('utils/fonts', () => {
  describe('ensureFontLoaded', () => {
    let mockFonts: any;

    beforeEach(() => {
      vi.clearAllMocks();

      mockFonts = {
        load: vi.fn().mockResolvedValue(undefined),
        check: vi.fn().mockReturnValue(false)
      };

      // Mock document.fonts
      Object.defineProperty(document, 'fonts', {
        value: mockFonts,
        configurable: true
      });
    });

    it('should load font when not already available', async () => {
      mockFonts.check.mockReturnValue(false);

      await ensureFontLoaded('Arial', 16);

      expect(mockFonts.check).toHaveBeenCalledWith('normal normal 16px Arial');
      expect(mockFonts.load).toHaveBeenCalledWith('normal normal 16px Arial');
    });

    it('should skip loading when font is already available', async () => {
      mockFonts.check.mockReturnValue(true);

      await ensureFontLoaded('Arial', 16);

      expect(mockFonts.check).toHaveBeenCalledWith('normal normal 16px Arial');
      expect(mockFonts.load).not.toHaveBeenCalled();
    });

    it('should handle custom weight and style', async () => {
      await ensureFontLoaded('Times', 20, 'bold', 'italic');

      expect(mockFonts.check).toHaveBeenCalledWith('italic bold 20px Times');
      expect(mockFonts.load).toHaveBeenCalledWith('italic bold 20px Times');
    });

    it('should round fractional sizes', async () => {
      await ensureFontLoaded('Arial', 16.7);

      expect(mockFonts.check).toHaveBeenCalledWith('normal normal 17px Arial');
    });

    it('should handle timeout', async () => {
      // Make load never resolve
      mockFonts.load.mockImplementation(() => new Promise(() => {}));

      const start = Date.now();
      await ensureFontLoaded('Arial', 16, 'normal', 'normal', 100);
      const elapsed = Date.now() - start;

      // Should complete within timeout + some buffer
      expect(elapsed).toBeLessThan(200);
    });

    it('should handle missing document.fonts API', async () => {
      Object.defineProperty(document, 'fonts', {
        value: undefined,
        configurable: true
      });

      // Should not throw
      await expect(ensureFontLoaded('Arial', 16)).resolves.toBeUndefined();
    });

    it('should handle document.fonts without load method', async () => {
      Object.defineProperty(document, 'fonts', {
        value: { check: vi.fn() },
        configurable: true
      });

      // Should not throw
      await expect(ensureFontLoaded('Arial', 16)).resolves.toBeUndefined();
    });

    it('should handle document.fonts without check method', async () => {
      Object.defineProperty(document, 'fonts', {
        value: { load: vi.fn() },
        configurable: true
      });

      // Should not throw
      await expect(ensureFontLoaded('Arial', 16)).resolves.toBeUndefined();
    });

    it('should handle load errors gracefully', async () => {
      mockFonts.load.mockRejectedValue(new Error('Font load failed'));

      // Should not throw
      await expect(ensureFontLoaded('Arial', 16)).resolves.toBeUndefined();
    });

    it('should use default parameters', async () => {
      await ensureFontLoaded('Helvetica', 14);

      expect(mockFonts.check).toHaveBeenCalledWith('normal normal 14px Helvetica');
      expect(mockFonts.load).toHaveBeenCalledWith('normal normal 14px Helvetica');
    });
  });
});