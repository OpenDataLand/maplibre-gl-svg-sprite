import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OverlayText } from '../ops/overlay-text';
import { OverlayGrid } from '../ops/overlay-grid';
import { applySvgFgBg } from '../ops/svg-fg-bg';
import { isOp, asPostprocess, BaseOp } from '../ops/base';

// Mock font loading
vi.mock('../utils/fonts', () => ({
  ensureFontLoaded: vi.fn().mockResolvedValue(undefined)
}));

// Mock the svg overlay utilities
vi.mock('../ops/overlay-svg', () => ({
  computeTargetSize: vi.fn().mockReturnValue({ width: 24, height: 24 }),
  svgToBitmap: vi.fn().mockResolvedValue({
    bitmap: { width: 24, height: 24 },
    width: 24,
    height: 24
  })
}));

describe('ops - extended tests', () => {
  let mockContext: any;

  beforeEach(() => {
    mockContext = {
      font: 'normal 14px Arial',
      textAlign: 'center',
      textBaseline: 'middle',
      fillStyle: '#000',
      strokeStyle: '#000',
      lineWidth: 1,
      lineJoin: 'round',
      globalCompositeOperation: 'source-over',
      fillText: vi.fn(),
      strokeText: vi.fn(),
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      drawImage: vi.fn(),
      getImageData: vi.fn().mockReturnValue({
        data: new Uint8ClampedArray(96),
        width: 24,
        height: 24
      }),
      putImageData: vi.fn(),
      measureText: vi.fn().mockReturnValue({
        width: 50,
        actualBoundingBoxLeft: 0,
        actualBoundingBoxRight: 50,
        actualBoundingBoxAscent: 12,
        actualBoundingBoxDescent: 3
      })
    };
  });

  describe('OverlayText', () => {
    it('should create instance with default id', () => {
      const op = new OverlayText();
      expect(op.id).toBe('overlayText');
      expect(op).toBeInstanceOf(BaseOp);
    });

    it('should create instance with custom id', () => {
      const op = new OverlayText('customText');
      expect(op.id).toBe('customText');
    });

    it('should not render when no text provided', async () => {
      const op = new OverlayText();
      await op.run(mockContext, 64, 64, {});

      expect(mockContext.fillText).not.toHaveBeenCalled();
      expect(mockContext.strokeText).not.toHaveBeenCalled();
    });

    it('should render text with default settings', async () => {
      const op = new OverlayText();
      await op.run(mockContext, 64, 64, { text: 'Hello' });

      // Y = H/2 + (ascent - descent)/2 = 32 + (12-3)/2 = 36.5
      expect(mockContext.fillText).toHaveBeenCalledWith('Hello', 32, 36.5);
      expect(mockContext.strokeText).toHaveBeenCalledWith('Hello', 32, 36.5);
    });

    it('should handle text parameter variations', async () => {
      const op = new OverlayText();

      // Test with 'label' parameter
      await op.run(mockContext, 64, 64, { label: 'Test Label' });
      expect(mockContext.fillText).toHaveBeenCalledWith('Test Label', 32, 36.5);
    });

    it('should apply custom font settings', async () => {
      const op = new OverlayText();
      await op.run(mockContext, 64, 64, {
        text: 'Hello',
        fontSize: '20',
        fontWeight: 'normal',
        fontFamily: 'Arial'
      });

      expect(mockContext.font).toBe('normal 20px Arial');
    });

    it('should apply custom colors', async () => {
      const op = new OverlayText();
      await op.run(mockContext, 64, 64, {
        text: 'Hello',
        textColor: 'red',
        textStroke: 'blue'
      });

      expect(mockContext.fillStyle).toBe('red');
      expect(mockContext.strokeStyle).toBe('blue');
    });

    it('should handle text alignment', async () => {
      const op = new OverlayText();

      // Test left alignment
      await op.run(mockContext, 64, 64, {
        text: 'Hello',
        anchor: 'left'
      });
      expect(mockContext.textAlign).toBe('left');

      // Test right alignment
      await op.run(mockContext, 64, 64, {
        text: 'Hello',
        anchor: 'right'
      });
      expect(mockContext.textAlign).toBe('right');
    });

    it('should handle stroke width zero', async () => {
      const op = new OverlayText();
      await op.run(mockContext, 64, 64, {
        text: 'Hello',
        textStrokeWidth: '0'
      });

      expect(mockContext.fillText).toHaveBeenCalled();
      expect(mockContext.strokeText).not.toHaveBeenCalled();
    });

    it('should handle positioning offsets', async () => {
      const op = new OverlayText();
      await op.run(mockContext, 64, 64, {
        text: 'Hello',
        tx: '10',
        ty: '5'
      });

      // X = 32 + 10 = 42, Y = 32 + 5 + (12-3)/2 = 41.5
      expect(mockContext.fillText).toHaveBeenCalledWith('Hello', 42, 41.5);
    });
  });

  describe('OverlayGrid', () => {
    const testSvgIcons = {
      'test-icon': '<svg width="24" height="24"><rect fill="blue"/></svg>',
      'another-icon': '<svg width="24" height="24"><circle fill="red"/></svg>'
    };

    it('should create instance with default id', () => {
      const op = new OverlayGrid(testSvgIcons);
      expect(op.id).toBe('overlayGrid');
      expect(op).toBeInstanceOf(BaseOp);
    });

    it('should not render when no icons specified', async () => {
      const op = new OverlayGrid(testSvgIcons);
      await op.run(mockContext, 64, 64, {});

      expect(mockContext.drawImage).not.toHaveBeenCalled();
    });

    it('should handle grid rendering when enabled', async () => {
      const op = new OverlayGrid(testSvgIcons);
      await op.run(mockContext, 64, 64, {
        icons: 'test-icon',
        grid: 'true'
      });

      // Should attempt to draw the grid
      expect(mockContext.drawImage).toHaveBeenCalled();
    });

    it('should handle multiple icons', async () => {
      const op = new OverlayGrid(testSvgIcons);
      await op.run(mockContext, 64, 64, {
        icons: 'test-icon,another-icon',
        columns: '2'
      });

      // Should process multiple icons
      expect(mockContext.drawImage).toHaveBeenCalled();
    });
  });

  describe('applySvgFgBg', () => {
    it('should return original SVG when no colors provided', () => {
      const svg = '<svg><rect/></svg>';
      const result = applySvgFgBg(svg);
      expect(result).toBe(svg);
    });

    it('should apply foreground color to data-fg elements', () => {
      const svg = '<svg><rect data-fg="true"/></svg>';
      const result = applySvgFgBg(svg, '#ff0000');
      expect(result).toContain('#ff0000');
    });

    it('should apply background color to data-bg elements', () => {
      const svg = '<svg><rect data-bg="true"/></svg>';
      const result = applySvgFgBg(svg, undefined, '#0000ff');
      expect(result).toContain('#0000ff');
    });

    it('should apply both foreground and background colors', () => {
      const svg = '<svg><rect data-fg="true"/><rect data-bg="true"/></svg>';
      const result = applySvgFgBg(svg, '#ff0000', '#0000ff');
      expect(result).toContain('#ff0000');
      expect(result).toContain('#0000ff');
    });

    it('should normalize boolean data attributes', () => {
      const svg = '<svg><rect data-fg data-bg/></svg>';
      const result = applySvgFgBg(svg, '#ff0000', '#0000ff');
      expect(result).toContain('data-fg="true"');
      // The function should have at least processed both attributes
      expect(result).toContain('data-bg');
    });
  });

  describe('base utilities', () => {
    describe('isOp', () => {
      it('should return true for valid PostprocessOp', () => {
        const validOp = { run: () => {} };
        expect(isOp(validOp)).toBe(true);
      });

      it('should return true for BaseOp instances', () => {
        const op = new OverlayText();
        expect(isOp(op)).toBe(true);
      });

      it('should return false for invalid objects', () => {
        expect(isOp(null)).toBe(false);
        expect(isOp(undefined)).toBe(false);
        expect(isOp({})).toBe(false);
        expect(isOp({ run: 'not-a-function' })).toBe(false);
        expect(isOp('string')).toBe(false);
        expect(isOp(123)).toBe(false);
      });
    });

    describe('asPostprocess', () => {
      it('should convert operation to postprocess function', () => {
        const op = new OverlayText();
        const postprocessFn = asPostprocess(op);

        expect(typeof postprocessFn).toBe('function');
      });

      it('should call operation run method when postprocess function is called', () => {
        const mockOp = {
          run: vi.fn()
        };

        const postprocessFn = asPostprocess(mockOp);
        postprocessFn(mockContext, 64, 64, { test: 'value' });

        expect(mockOp.run).toHaveBeenCalledWith(mockContext, 64, 64, { test: 'value' });
      });
    });
  });
});