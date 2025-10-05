import { describe, it, expect } from 'vitest';
import { buildSvgUrl, svgUrl, SvgUrlBuilder } from '../utils/url-builder.js';

describe('buildSvgUrl', () => {
  it('should build basic URL with required icon parameter', () => {
    const url = buildSvgUrl({ icon: 'marker' });
    expect(url).toBe('svg://marker');
  });

  it('should throw error when icon is missing', () => {
    expect(() => buildSvgUrl({ icon: '' })).toThrow('icon parameter is required');
  });

  it('should include width and height', () => {
    const url = buildSvgUrl({
      icon: 'marker',
      width: 44,
      height: 44,
    });
    expect(url).toBe('svg://marker?width=44&height=44');
  });

  it('should include pixelRatio', () => {
    const url = buildSvgUrl({
      icon: 'marker',
      pixelRatio: 2,
    });
    expect(url).toBe('svg://marker?pixelRatio=2');
  });

  it('should URL-encode color values with hash', () => {
    const url = buildSvgUrl({
      icon: 'marker',
      fg: '#ff0000',
      bg: '#0000ff',
    });
    expect(url).toBe('svg://marker?fg=%23ff0000&bg=%230000ff');
  });

  it('should support custom protocol', () => {
    const url = buildSvgUrl({
      icon: 'marker',
      protocol: 'custom',
    });
    expect(url).toBe('custom://marker');
  });

  describe('SvgColorParams', () => {
    it('should support fg and bg parameters', () => {
      const url = buildSvgUrl({
        icon: 'marker',
        fg: '#ff3366',
        bg: '#003366',
      });
      expect(url).toContain('fg=%23ff3366');
      expect(url).toContain('bg=%23003366');
    });

    it('should support color parameter', () => {
      const url = buildSvgUrl({
        icon: 'star',
        color: '#f2c94c',
      });
      expect(url).toContain('color=%23f2c94c');
    });
  });

  describe('SpriteTintParams', () => {
    it('should support tint parameter', () => {
      const url = buildSvgUrl({
        icon: 'marker',
        tint: '#ff0000',
      });
      expect(url).toContain('tint=%23ff0000');
    });

    it('should support tintColor parameter', () => {
      const url = buildSvgUrl({
        icon: 'marker',
        tintColor: '#00ff00',
      });
      expect(url).toContain('tintColor=%2300ff00');
    });
  });

  describe('OverlayTextParams', () => {
    it('should include text overlay parameters', () => {
      const url = buildSvgUrl({
        icon: 'marker',
        text: 'JFK',
        fontSize: 18,
        textColor: '#00499c',
      });
      expect(url).toContain('text=JFK');
      expect(url).toContain('fontSize=18');
      expect(url).toContain('textColor=%2300499c');
    });

    it('should include text anchor', () => {
      const url = buildSvgUrl({
        icon: 'marker',
        text: 'Label',
        textAnchor: 'top-left',
      });
      expect(url).toContain('textAnchor=top-left');
    });

    it('should include font properties', () => {
      const url = buildSvgUrl({
        icon: 'marker',
        text: 'Hello',
        fontWeight: 'bold',
        fontStyle: 'italic',
        fontFamily: 'Arial',
      });
      expect(url).toContain('fontWeight=bold');
      expect(url).toContain('fontStyle=italic');
      expect(url).toContain('fontFamily=Arial');
    });

    it('should include text stroke parameters', () => {
      const url = buildSvgUrl({
        icon: 'marker',
        text: 'Test',
        textStroke: '#000000',
        textStrokeWidth: 3,
      });
      expect(url).toContain('textStroke=%23000000');
      expect(url).toContain('textStrokeWidth=3');
    });

    it('should include text offset parameters', () => {
      const url = buildSvgUrl({
        icon: 'marker',
        text: 'Offset',
        tx: 5,
        ty: -10,
      });
      expect(url).toContain('tx=5');
      expect(url).toContain('ty=-10');
    });
  });

  describe('OverlaySvgParams', () => {
    it('should include overlay parameters', () => {
      const url = buildSvgUrl({
        icon: 'marker',
        overlay: 'star',
        ow: 24,
        oh: 24,
      });
      expect(url).toContain('overlay=star');
      expect(url).toContain('ow=24');
      expect(url).toContain('oh=24');
    });

    it('should include overlay colors', () => {
      const url = buildSvgUrl({
        icon: 'marker',
        overlay: 'star',
        overlayFg: '#ff0000',
        overlayBg: '#0000ff',
      });
      expect(url).toContain('overlayFg=%23ff0000');
      expect(url).toContain('overlayBg=%230000ff');
    });

    it('should include overlay offset', () => {
      const url = buildSvgUrl({
        icon: 'marker',
        overlay: 'badge',
        ox: 10,
        oy: -5,
      });
      expect(url).toContain('ox=10');
      expect(url).toContain('oy=-5');
    });

    it('should include debug flags', () => {
      const url = buildSvgUrl({
        icon: 'marker',
        overlay: 'star',
        debugRect: true,
        logSvg: true,
      });
      expect(url).toContain('debugRect=true');
      expect(url).toContain('logSvg=true');
    });
  });

  describe('OverlayGridParams', () => {
    it('should include grid parameters', () => {
      const url = buildSvgUrl({
        icon: 'base',
        icons: 'icon1,icon2,icon3',
        columns: 2,
        gap: 4,
      });
      expect(url).toContain('icons=icon1%2Cicon2%2Cicon3');
      expect(url).toContain('columns=2');
      expect(url).toContain('gap=4');
    });

    it('should include grid colors', () => {
      const url = buildSvgUrl({
        icon: 'base',
        icons: 'a,b,c',
        gridFg: '#ff0000',
        gridBg: '#0000ff',
      });
      expect(url).toContain('gridFg=%23ff0000');
      expect(url).toContain('gridBg=%230000ff');
    });

    it('should include item dimensions', () => {
      const url = buildSvgUrl({
        icon: 'base',
        icons: 'a,b',
        itemW: 32,
        itemH: 32,
      });
      expect(url).toContain('itemW=32');
      expect(url).toContain('itemH=32');
    });

    it('should include cell styling parameters', () => {
      const url = buildSvgUrl({
        icon: 'base',
        icons: 'a,b',
        cellBg: '#ffffff',
        cellPad: 4,
        cellR: 8,
      });
      expect(url).toContain('cellBg=%23ffffff');
      expect(url).toContain('cellPad=4');
      expect(url).toContain('cellR=8');
    });

    it('should include grid positioning', () => {
      const url = buildSvgUrl({
        icon: 'base',
        icons: 'a,b',
        gridAnchor: 'center',
        gx: 10,
        gy: 20,
      });
      expect(url).toContain('gridAnchor=center');
      expect(url).toContain('gx=10');
      expect(url).toContain('gy=20');
    });
  });

  describe('Complex combinations', () => {
    it('should handle marker with all text overlay params', () => {
      const url = buildSvgUrl({
        icon: 'marker',
        width: 44,
        height: 44,
        pixelRatio: 2,
        bg: '#ffffff',
        fg: '#d35400',
        text: 'EWR',
        fontSize: 18,
        textColor: '#d35400',
      });

      expect(url).toContain('svg://marker');
      expect(url).toContain('width=44');
      expect(url).toContain('height=44');
      expect(url).toContain('pixelRatio=2');
      expect(url).toContain('bg=%23ffffff');
      expect(url).toContain('fg=%23d35400');
      expect(url).toContain('text=EWR');
      expect(url).toContain('fontSize=18');
      expect(url).toContain('textColor=%23d35400');
    });

    it('should filter out undefined/null values', () => {
      const url = buildSvgUrl({
        icon: 'marker',
        width: 44,
        height: undefined as any,
        text: '',
        fontSize: 0,
      });

      expect(url).toContain('width=44');
      expect(url).not.toContain('height');
      expect(url).not.toContain('text');
      expect(url).toContain('fontSize=0'); // 0 is a valid value
    });
  });
});

describe('SvgUrlBuilder', () => {
  it('should build URL using fluent interface', () => {
    const builder = new SvgUrlBuilder('marker');
    const url = builder
      .size(44, 44)
      .pixelRatio(2)
      .build();

    expect(url).toBe('svg://marker?width=44&height=44&pixelRatio=2');
  });

  it('should set size with single value', () => {
    const url = new SvgUrlBuilder('marker')
      .size(32)
      .build();

    expect(url).toBe('svg://marker?width=32&height=32');
  });

  it('should chain color methods', () => {
    const url = new SvgUrlBuilder('marker')
      .colors({ fg: '#ff0000', bg: '#0000ff' })
      .build();

    expect(url).toContain('fg=%23ff0000');
    expect(url).toContain('bg=%230000ff');
  });

  it('should add tint', () => {
    const url = new SvgUrlBuilder('marker')
      .tint('#ff00ff')
      .build();

    expect(url).toContain('tint=%23ff00ff');
  });

  it('should add text with options', () => {
    const url = new SvgUrlBuilder('marker')
      .text('JFK', {
        fontSize: 18,
        textColor: '#00499c',
        fontWeight: 'bold',
      })
      .build();

    expect(url).toContain('text=JFK');
    expect(url).toContain('fontSize=18');
    expect(url).toContain('textColor=%2300499c');
    expect(url).toContain('fontWeight=bold');
  });

  it('should add overlay with options', () => {
    const url = new SvgUrlBuilder('marker')
      .overlay('star', {
        ow: 24,
        oh: 24,
        anchor: 'top-right',
      })
      .build();

    expect(url).toContain('overlay=star');
    expect(url).toContain('ow=24');
    expect(url).toContain('oh=24');
    expect(url).toContain('anchor=top-right');
  });

  it('should add grid with array of icons', () => {
    const url = new SvgUrlBuilder('base')
      .grid(['icon1', 'icon2', 'icon3'], {
        columns: 2,
        gap: 4,
      })
      .build();

    expect(url).toContain('icons=icon1%2Cicon2%2Cicon3');
    expect(url).toContain('columns=2');
    expect(url).toContain('gap=4');
  });

  it('should set custom parameters', () => {
    const url = new SvgUrlBuilder('marker')
      .param('width', 100)
      .param('customParam' as any, 'value')
      .build();

    expect(url).toContain('width=100');
    expect(url).toContain('customParam=value');
  });

  it('should support custom protocol', () => {
    const url = new SvgUrlBuilder('marker', 'custom')
      .size(32)
      .build();

    expect(url).toBe('custom://marker?width=32&height=32');
  });

  it('should chain all methods together', () => {
    const url = new SvgUrlBuilder('marker')
      .size(44, 44)
      .pixelRatio(2)
      .colors({ fg: '#d35400', bg: '#ffffff' })
      .text('EWR', { fontSize: 18, textColor: '#d35400' })
      .build();

    expect(url).toContain('svg://marker');
    expect(url).toContain('width=44');
    expect(url).toContain('height=44');
    expect(url).toContain('pixelRatio=2');
    expect(url).toContain('fg=%23d35400');
    expect(url).toContain('bg=%23ffffff');
    expect(url).toContain('text=EWR');
    expect(url).toContain('fontSize=18');
    expect(url).toContain('textColor=%23d35400');
  });
});

describe('svgUrl helper', () => {
  it('should create builder with default protocol', () => {
    const url = svgUrl('marker')
      .size(32)
      .build();

    expect(url).toBe('svg://marker?width=32&height=32');
  });

  it('should create builder with custom protocol', () => {
    const url = svgUrl('marker', 'custom')
      .size(32)
      .build();

    expect(url).toBe('custom://marker?width=32&height=32');
  });

  it('should work with complex chaining', () => {
    const url = svgUrl('marker')
      .size(44, 44)
      .pixelRatio(2)
      .colors({ fg: '#ff0000' })
      .text('TEST')
      .build();

    expect(url).toContain('svg://marker');
    expect(url).toContain('width=44');
    expect(url).toContain('text=TEST');
  });
});

describe('Real-world examples', () => {
  it('should create airport marker for JFK', () => {
    const url = buildSvgUrl({
      icon: 'marker',
      width: 44,
      height: 44,
      pixelRatio: 2,
      bg: '#ffffff',
      fg: '#00499c',
      text: 'JFK',
      fontSize: 18,
      textColor: '#00499c',
    });

    expect(url).toBe(
      'svg://marker?width=44&height=44&pixelRatio=2&bg=%23ffffff&fg=%2300499c&text=JFK&fontSize=18&textColor=%2300499c'
    );
  });

  it('should create colored marker', () => {
    const url = buildSvgUrl({
      icon: 'marker',
      fg: '#ff3366',
      bg: '#003366',
      width: 36,
      height: 36,
      pixelRatio: 2,
    });

    expect(url).toBe(
      'svg://marker?fg=%23ff3366&bg=%23003366&width=36&height=36&pixelRatio=2'
    );
  });

  it('should create star with overlay using builder', () => {
    const url = svgUrl('star')
      .size(48, 48)
      .pixelRatio(2)
      .colors({ fg: '#f2c94c' })
      .overlay('badge', { ow: 16, oh: 16, anchor: 'top-right' })
      .build();

    expect(url).toContain('svg://star');
    expect(url).toContain('width=48');
    expect(url).toContain('height=48');
    expect(url).toContain('pixelRatio=2');
    expect(url).toContain('fg=%23f2c94c');
    expect(url).toContain('overlay=badge');
    expect(url).toContain('ow=16');
    expect(url).toContain('oh=16');
  });

  it('should create icon grid', () => {
    const url = svgUrl('base')
      .size(100, 100)
      .grid(['icon1', 'icon2', 'icon3', 'icon4'], {
        columns: 2,
        gap: 4,
        cellBg: '#f0f0f0',
        cellPad: 2,
      })
      .build();

    expect(url).toContain('icons=icon1%2Cicon2%2Cicon3%2Cicon4');
    expect(url).toContain('columns=2');
    expect(url).toContain('gap=4');
    expect(url).toContain('cellBg=%23f0f0f0');
    expect(url).toContain('cellPad=2');
  });
});
