export const registerSchema = {
  email: { type: 'string', required: true, format: 'email' },
  password: { type: 'string', required: true, minLength: 8 },
  firstName: { type: 'string', required: true },
  lastName: { type: 'string', required: true },
  phone: { type: 'string', optional: true },
  country: { type: 'string', required: true },
  city: { type: 'string', optional: true },
  shopName: { type: 'string', optional: true },
  role: { type: 'string', optional: true, enum: ['SELLER', 'BUYER'] },
};

export const loginSchema = {
  email: { type: 'string', required: true },
  password: { type: 'string', required: true },
};

export const productSchema = {
  title: { type: 'string', required: true },
  brand: { type: 'string', required: true },
  category: { type: 'string', required: true },
  price: { type: 'number', required: true, min: 0 },
  description: { type: 'string', optional: true },
  reference: { type: 'string', optional: true },
  model: { type: 'string', optional: true },
  condition: { type: 'string', optional: true, enum: ['NEW', 'USED', 'REFURBISHED'] },
  stock: { type: 'number', optional: true, min: 0 },
};

export const orderSchema = {
  items: { type: 'array', required: true, minItems: 1 },
  'items[].productId': { type: 'string', required: true },
  'items[].quantity': { type: 'number', required: true, min: 1 },
  shippingAddress: { type: 'object', optional: true },
  notes: { type: 'string', optional: true },
};

export const paymentSchema = {
  orderId: { type: 'string', required: true },
  method: { type: 'string', required: true, enum: ['ORANGE_MONEY', 'MTN_MOMO', 'WAVE', 'MOOV_MONEY', 'CARD'] },
  phone: { type: 'string', required: true },
};
