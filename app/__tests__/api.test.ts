import { describe, it, expect } from 'vitest';
import { getImageUrl, getStrapiImageUrl } from '../config/api';

describe('getImageUrl', () => {
  it('returns empty string for empty path', () => {
    expect(getImageUrl('')).toBe('');
  });

  it('returns absolute URLs unchanged', () => {
    const url = 'https://cdn.example.com/image.jpg';
    expect(getImageUrl(url)).toBe(url);
  });

  it('prepends API_URL for relative paths', () => {
    const result = getImageUrl('/uploads/image.jpg');
    expect(result).toContain('/uploads/image.jpg');
  });
});

describe('getStrapiImageUrl', () => {
  const image = {
    url: '/uploads/original.jpg',
    formats: {
      large: { url: '/uploads/large.jpg' },
      medium: { url: '/uploads/medium.jpg' },
      small: { url: '/uploads/small.jpg' },
      thumbnail: { url: '/uploads/thumb.jpg' },
    },
  };

  it('returns null/undefined image as empty string', () => {
    expect(getStrapiImageUrl(null)).toBe('');
    expect(getStrapiImageUrl(undefined)).toBe('');
  });

  it('returns preferred format when available', () => {
    expect(getStrapiImageUrl(image, 'large')).toContain('large.jpg');
    expect(getStrapiImageUrl(image, 'medium')).toContain('medium.jpg');
    expect(getStrapiImageUrl(image, 'small')).toContain('small.jpg');
    expect(getStrapiImageUrl(image, 'thumbnail')).toContain('thumb.jpg');
  });

  it('falls back to smaller format when preferred is missing', () => {
    const imageNoLarge = {
      url: '/uploads/original.jpg',
      formats: { medium: { url: '/uploads/medium.jpg' } },
    };
    // Asked for large → no large → falls back to medium
    expect(getStrapiImageUrl(imageNoLarge, 'large')).toContain('medium.jpg');
  });

  it('falls back to original URL when no formats available', () => {
    const imageNoFormats = { url: '/uploads/original.jpg' };
    expect(getStrapiImageUrl(imageNoFormats, 'large')).toContain('original.jpg');
  });

  it('defaults to medium format', () => {
    expect(getStrapiImageUrl(image)).toContain('medium.jpg');
  });
});

describe('Email validation regex', () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  it('accepts valid emails', () => {
    expect(emailRegex.test('test@example.com')).toBe(true);
    expect(emailRegex.test('user.name+tag@example.co.uk')).toBe(true);
    expect(emailRegex.test('lespoulettes.benin@gmail.com')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(emailRegex.test('notanemail')).toBe(false);
    expect(emailRegex.test('@nodomain')).toBe(false);
    expect(emailRegex.test('missing@dot')).toBe(false);
    expect(emailRegex.test('missing@.com')).toBe(false);
    expect(emailRegex.test('')).toBe(false);
  });
});
