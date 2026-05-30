// Stub — swap these out for real fetch() calls when backend is ready

export async function createOrder({ gameId, uid, packageId, amount, price }) {
  // TODO: replace with real API call
  // return await fetch('/api/orders', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ gameId, uid, packageId, amount, price }),
  // }).then(r => r.json());

  console.log('[topupService] createOrder', { gameId, uid, packageId, amount, price });
  return { orderId: 'MOCK-' + Date.now(), status: 'pending' };
}
