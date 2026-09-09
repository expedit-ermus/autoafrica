import '@testing-library/jest-dom/vitest';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-for-vitest';

// Les adaptateurs Mobile Money refusent de fabriquer un succes sauf demande
// explicite : les tests exercent la simulation, la production non (D65).
process.env.PAYMENTS_SIMULATOR = '1';
