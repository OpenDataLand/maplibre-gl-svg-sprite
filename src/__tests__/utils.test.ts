import { describe, it, expect } from 'vitest';
import { parseQuery, applySvgParams } from '../utils/params';

describe('utils/params', () => {
  describe('parseQuery', () => {
    it('should parse simple query string', () => {
      const result = parseQuery('?color=red&width=24');
      expect(result).toEqual({ color: 'red', width: '24' });
    });

    it('should parse query string without leading ?', () => {
      const result = parseQuery('color=blue&height=32');
      expect(result).toEqual({ color: 'blue', height: '32' });
    });

    it('should handle encoded values', () => {
      const result = parseQuery('?color=%23ff0000');
      expect(result).toEqual({ color: '#ff0000' });
    });

    it('should return empty object for empty string', () => {
      const result = parseQuery('');
      expect(result).toEqual({});
    });

    it('should handle params with no value', () => {
      const result = parseQuery('?flag&debug');
      expect(result).toEqual({ flag: '', debug: '' });
    });
  });

  describe('applySvgParams', () => {
    it('should set color attribute', () => {
      const svg = '<svg width="24" height="24"><rect/></svg>';
      const result = applySvgParams(svg, { color: 'red' });
      expect(result).toContain('fill="red"');
    });

    it('should update existing fill attribute', () => {
      const svg = '<svg width="24" height="24" fill="blue"><rect/></svg>';
      const result = applySvgParams(svg, { color: 'red' });
      expect(result).toContain('fill="red"');
      expect(result).not.toContain('fill="blue"');
    });

    it('should set width and height', () => {
      const svg = '<svg><rect/></svg>';
      const result = applySvgParams(svg, { width: '48', height: '48' });
      expect(result).toContain('width="48"');
      expect(result).toContain('height="48"');
    });

    it('should update existing width and height', () => {
      const svg = '<svg width="24" height="24"><rect/></svg>';
      const result = applySvgParams(svg, { width: '48', height: '48' });
      expect(result).toContain('width="48"');
      expect(result).toContain('height="48"');
      expect(result).not.toContain('width="24"');
    });

    it('should not modify svg when no params', () => {
      const svg = '<svg width="24" height="24"><rect/></svg>';
      const result = applySvgParams(svg, {});
      expect(result).toBe(svg);
    });
  });
});