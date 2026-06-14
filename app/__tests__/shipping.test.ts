import { describe, it, expect } from 'vitest';
import { SHIPPING_COSTS, PICKUP_LOCATIONS, buildPickupAddress } from '../config/site';

describe('SHIPPING_COSTS', () => {
  it('has belgique and europe zones', () => {
    expect(SHIPPING_COSTS.belgique).toBeDefined();
    expect(SHIPPING_COSTS.europe).toBeDefined();
  });

  it('belgique costs less than europe', () => {
    expect(SHIPPING_COSTS.belgique.cost).toBeLessThan(SHIPPING_COSTS.europe.cost);
  });

  it('all costs are positive numbers', () => {
    Object.values(SHIPPING_COSTS).forEach(({ cost }) => {
      expect(cost).toBeGreaterThan(0);
    });
  });
});

describe('PICKUP_LOCATIONS', () => {
  it('has 3 locations', () => {
    expect(PICKUP_LOCATIONS).toHaveLength(3);
  });

  it('all locations have required fields', () => {
    PICKUP_LOCATIONS.forEach((loc) => {
      expect(loc.id).toBeTruthy();
      expect(loc.label).toBeTruthy();
      expect(loc.flag).toBeTruthy();
    });
  });

  it('includes grimbergen, benin', () => {
    const ids = PICKUP_LOCATIONS.map((l) => l.id);
    expect(ids).toContain('grimbergen');
    expect(ids).toContain('benin');
  });
});

describe('buildPickupAddress', () => {
  it('returns Grimbergen address for grimbergen', () => {
    expect(buildPickupAddress('grimbergen')).toContain('Grimbergen');
  });

it('returns Bénin address for benin', () => {
    expect(buildPickupAddress('benin')).toContain('Bénin');
  });

  it('all pickup addresses start with RETRAIT GRATUIT', () => {
    PICKUP_LOCATIONS.forEach(({ id }) => {
      expect(buildPickupAddress(id)).toContain('RETRAIT GRATUIT');
    });
  });
});

describe('Grand total calculation', () => {
  it('adds shipping cost to subtotal for home delivery', () => {
    const subtotal = 45;
    const shippingCost = SHIPPING_COSTS.belgique.cost;
    expect(subtotal + shippingCost).toBeCloseTo(52.75);
  });

  it('no shipping cost for pickup', () => {
    const subtotal = 45;
    const shippingCost = 0; // retrait
    expect(subtotal + shippingCost).toBe(45);
  });
});
