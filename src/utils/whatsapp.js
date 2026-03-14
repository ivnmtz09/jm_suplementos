// src/utils/whatsapp.js

/**
 * Construye el mensaje estructurado para WhatsApp con el prefijo [PEDIDO-JM].
 * Formato optimizado para procesamiento por IA de WhatsApp Business.
 *
 * @param {Array}  items       — items del carrito: { name, price, quantity, sku? }
 * @param {string} clientName  — nombre del cliente
 * @returns {string} mensaje listo para codificar
 */
export function buildWhatsAppMessage(items, clientName = "Cliente") {
  const lines = [];

  lines.push("[PEDIDO-JM]");
  lines.push(`Cliente: ${clientName}`);
  lines.push("Productos:");

  items.forEach((item) => {
    const sku       = item.sku ?? item.id ?? "N/A";
    const unitPrice = Number(item.price).toFixed(2);
    const subtotal  = (item.price * item.quantity).toFixed(2);
    lines.push(
      `- ${item.quantity} x ${item.name} (${sku}) | P.U. $${unitPrice} | Subtotal: $${subtotal}`
    );
  });

  const total = items
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  lines.push(`Total a Pagar: $${total}`);

  return lines.join("\n");
}

/**
 * Genera la URL wa.me con el mensaje codificado.
 * El número se toma de la variable de entorno VITE_WHATSAPP_NUMBER.
 *
 * @param {Array}  items       — items del carrito
 * @param {string} clientName  — nombre del cliente
 * @returns {string} URL completa de WhatsApp
 */
export function buildWhatsAppUrl(items, clientName = "Cliente") {
  const phone   = import.meta.env.VITE_WHATSAPP_NUMBER ?? "";
  const message = buildWhatsAppMessage(items, clientName);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
