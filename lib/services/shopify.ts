import { logger } from '@/lib/logger';

interface ShopifyProduct {
  id: number;
  title: string;
  variants: Array<{ id: number; inventory_quantity: number; price: string }>;
  status: string;
}

interface ShopifyOrder {
  id: number;
  name: string;
  financial_status: string;
  fulfillment_status: string | null;
  total_price: string;
  created_at: string;
  customer: { email: string; first_name: string; last_name: string };
}

function shopifyFetch(path: string, options?: RequestInit) {
  const storeUrl = process.env.SHOPIFY_STORE_URL;
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

  if (!storeUrl || !accessToken) {
    throw new Error('Shopify not configured. Set SHOPIFY_STORE_URL and SHOPIFY_ACCESS_TOKEN.');
  }

  const baseUrl = storeUrl.startsWith('https://') ? storeUrl : `https://${storeUrl}`;
  return fetch(`${baseUrl}/admin/api/2024-01${path}`, {
    ...options,
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });
}

export async function getShopifyProducts(limit = 50): Promise<ShopifyProduct[]> {
  try {
    const response = await shopifyFetch(`/products.json?limit=${limit}`);
    const data = await response.json();
    logger.info('Fetched Shopify products', { count: data.products?.length });
    return data.products || [];
  } catch (err) {
    logger.error('Failed to fetch Shopify products', { error: String(err) });
    throw err;
  }
}

export async function getShopifyOrders(status = 'any', limit = 50): Promise<ShopifyOrder[]> {
  try {
    const response = await shopifyFetch(`/orders.json?status=${status}&limit=${limit}`);
    const data = await response.json();
    logger.info('Fetched Shopify orders', { count: data.orders?.length });
    return data.orders || [];
  } catch (err) {
    logger.error('Failed to fetch Shopify orders', { error: String(err) });
    throw err;
  }
}

export async function updateShopifyInventory(variantId: number, quantity: number, locationId: string) {
  try {
    const response = await shopifyFetch('/inventory_levels/set.json', {
      method: 'POST',
      body: JSON.stringify({
        inventory_item_id: variantId,
        location_id: locationId,
        available: quantity,
      }),
    });
    const data = await response.json();
    logger.info('Shopify inventory updated', { variantId, quantity });
    return data.inventory_level;
  } catch (err) {
    logger.error('Failed to update Shopify inventory', { error: String(err) });
    throw err;
  }
}
