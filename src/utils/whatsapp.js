// src/utils/whatsapp.js

/**
 * Construye el mensaje estructurado para WhatsApp con el prefijo [PEDIDO-JM].
 * Formato profesional optimizado para procesamiento por IA de WhatsApp Business.
 *
 * @param {Array}  items       — items del carrito: { name, price, quantity, sku? }
 * @param {string} clientName  — nombre del cliente
 * @returns {string} mensaje listo para codificar
 */
export function buildWhatsAppMessage(items, clientName = "Cliente") {
  const sep = "━━━━━━━━━━━━━━━━";

  const lines = [
    `*[PEDIDO-JM]*`,
    sep,
    `👤 *Cliente:* ${clientName}`,
    sep,
  ];

  items.forEach((item) => {
    const sku      = item.sku ?? item.id ?? "S/N";
    const precio   = Number(item.price).toLocaleString("es-CO");
    const subtotal = (item.price * item.quantity).toLocaleString("es-CO");
    lines.push(`📦 *Producto:* ${item.name} (${sku})`);
    lines.push(`💵 *Precio:* $${precio} x ${item.quantity} uds = $${subtotal}`);
    if (items.indexOf(item) < items.length - 1) lines.push(""); // spacer between items
  });

  const total = items
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toLocaleString("es-CO");

  lines.push(sep);
  lines.push(`💰 *TOTAL A PAGAR:* $${total} COP`);
  lines.push("");
  lines.push("_Pedido generado desde jmsuplementos.com_");

  return lines.join("\n");
}

/**
 * Genera la URL wa.me con el mensaje codificado.
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
