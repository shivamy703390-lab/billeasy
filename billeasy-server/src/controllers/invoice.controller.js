function getGstRateDetails(itemName) {
  const name = String(itemName || '').toLowerCase();

  if (name.includes('food') || name.includes('book') || name.includes('essential')) {
    return { rate: 0.05, display: '5.0%' };
  } else if (name.includes('phone') || name.includes('laptop') || name.includes('electronic')) {
    return { rate: 0.12, display: '12.0%' };
  } else if (name.includes('luxury') || name.includes('car') || name.includes('yacht')) {
    return { rate: 0.28, display: '28.0%' };
  } else {
    return { rate: 0.18, display: '18.0%' };
  }
}

function formatCurrencyINR(amount) {
  return `₹${Math.round(Number(amount) || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

function computeInvoice(req, res) {
  const { items } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, error: 'Items array is required' });
  }

  let totalTaxableValue = 0;
  let totalGST = 0;

  const normalizedItems = items.map((raw, idx) => {
    const name = String(raw.name || '').trim();
    const price = Number(raw.price) || 0;
    const quantity = Number(raw.quantity) || 0;

    if (!name || price <= 0 || quantity <= 0) {
      throw new Error(`Invalid item at index ${idx}: Provide valid name, price (>0), and quantity (>0)`);
    }

    const gstRate = getGstRateDetails(name);
    const taxableValue = price * quantity;
    const itemGST = taxableValue * gstRate.rate;

    totalTaxableValue += taxableValue;
    totalGST += itemGST;

    return {
      name,
      price,
      quantity,
      gstRate,
      taxableValue,
      itemGST
    };
  });

  const grandTotal = totalTaxableValue + totalGST;

  // Build invoice text summary (similar to the front-end download)
  let itemsText = '--- ITEMIZED DETAILS ---\n';
  normalizedItems.forEach((item, i) => {
    itemsText += `${i + 1}. ${item.name.padEnd(15)} | Qty: ${String(item.quantity).padEnd(4)} | Rate: ${item.gstRate.display.padEnd(5)} | Taxable: ${formatCurrencyINR(item.taxableValue)}\n`;
  });

  const invoiceText = `
***** INVOICE/BILL SUMMARY *****

Date: ${new Date().toLocaleDateString()}
Invoice calculated using Dynamic GST Rates.

${itemsText}

---------------------------------
Total Taxable Value (Subtotal): ${formatCurrencyINR(totalTaxableValue)}
Total GST Collected: ${formatCurrencyINR(totalGST)}
Grand Total: ${formatCurrencyINR(grandTotal)}
*********************************
`.trim();

  res.json({
    success: true,
    data: {
      items: normalizedItems,
      totals: {
        subtotal: totalTaxableValue,
        gst: totalGST,
        grandTotal
      },
      invoiceText
    }
  });
}

module.exports = { computeInvoice };