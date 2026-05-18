import mysql from 'mysql2/promise';

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  const [rows] = await conn.execute('SELECT shop, accessToken FROM shopify_tokens ORDER BY createdAt DESC LIMIT 1');
  
  if (!rows || rows.length === 0) {
    console.log('No token found');
    await conn.end();
    return;
  }

  const { shop, accessToken } = rows[0];
  const API = `https://${shop}/admin/api/2024-01`;
  const headers = { 'X-Shopify-Access-Token': accessToken, 'Content-Type': 'application/json' };

  const products = [
    {
      handle: 'canape-excellent',
      title: 'Canapé Excellent',
      body_html: '<p>Canapé abatible de alta calidad con base tapizada. Incluye somier y patas. Entrega e instalación en 48h en la zona sur de Madrid.</p><ul><li>Base abatible con mecanismo de gas</li><li>Tapizado en tela antimanchas</li><li>Patas incluidas</li><li>Montaje incluido</li></ul>',
      product_type: 'Canapé',
      tags: 'canape, cama, entrega-48h, sur-madrid',
      variants: [
        { option1: '90x190', price: '249.00', sku: 'CANEX-90' },
        { option1: '105x190', price: '269.00', sku: 'CANEX-105' },
        { option1: '135x190', price: '299.00', sku: 'CANEX-135' },
        { option1: '150x190', price: '329.00', sku: 'CANEX-150' },
        { option1: '160x200', price: '349.00', sku: 'CANEX-160' },
        { option1: '180x200', price: '379.00', sku: 'CANEX-180' },
      ],
      options: [{ name: 'Medida' }],
    },
    {
      handle: 'canape-premium-storage',
      title: 'Canapé Premium Storage',
      body_html: '<p>Canapé con máximo almacenamiento y tapizado premium. Ideal para habitaciones donde el espacio es clave.</p><ul><li>Gran capacidad de almacenamiento</li><li>Tapizado premium</li><li>Mecanismo de apertura suave</li><li>Montaje incluido</li></ul>',
      product_type: 'Canapé',
      tags: 'canape, almacenamiento, premium, entrega-48h',
      variants: [
        { option1: '90x190', price: '299.00', sku: 'CANPS-90' },
        { option1: '105x190', price: '319.00', sku: 'CANPS-105' },
        { option1: '135x190', price: '349.00', sku: 'CANPS-135' },
        { option1: '150x190', price: '379.00', sku: 'CANPS-150' },
        { option1: '160x200', price: '399.00', sku: 'CANPS-160' },
        { option1: '180x200', price: '429.00', sku: 'CANPS-180' },
      ],
      options: [{ name: 'Medida' }],
    },
    {
      handle: 'colchon-viscoelastico-comfort',
      title: 'Colchón Viscoelástico Comfort',
      body_html: '<p>Colchón viscoelástico de alta densidad para un descanso óptimo. Adaptable a tu cuerpo para aliviar puntos de presión.</p><ul><li>Viscoelástica de alta densidad</li><li>Núcleo HR</li><li>Funda lavable</li><li>Entrega en 48h</li></ul>',
      product_type: 'Colchón',
      tags: 'colchon, viscoelastico, descanso, entrega-48h',
      variants: [
        { option1: '90x190', price: '199.00', sku: 'COLVC-90' },
        { option1: '105x190', price: '219.00', sku: 'COLVC-105' },
        { option1: '135x190', price: '249.00', sku: 'COLVC-135' },
        { option1: '150x190', price: '269.00', sku: 'COLVC-150' },
        { option1: '160x200', price: '289.00', sku: 'COLVC-160' },
        { option1: '180x200', price: '319.00', sku: 'COLVC-180' },
      ],
      options: [{ name: 'Medida' }],
    },
    {
      handle: 'base-tapizada-nordic',
      title: 'Base Tapizada Nordic',
      body_html: '<p>Base tapizada de diseño nórdico con patas de madera natural. Elegante y resistente, disponible en varios colores.</p><ul><li>Patas de madera natural</li><li>Tapizado nórdico</li><li>Varios colores disponibles</li><li>Montaje incluido</li></ul>',
      product_type: 'Base Tapizada',
      tags: 'base-tapizada, nordico, diseño, entrega-48h',
      variants: [
        { option1: '90x190', price: '179.00', sku: 'BASNO-90' },
        { option1: '105x190', price: '199.00', sku: 'BASNO-105' },
        { option1: '135x190', price: '229.00', sku: 'BASNO-135' },
        { option1: '150x190', price: '249.00', sku: 'BASNO-150' },
        { option1: '160x200', price: '269.00', sku: 'BASNO-160' },
        { option1: '180x200', price: '299.00', sku: 'BASNO-180' },
      ],
      options: [{ name: 'Medida' }],
    },
    {
      handle: 'canape-ottoman-deluxe',
      title: 'Canapé Ottoman Deluxe',
      body_html: '<p>Canapé ottoman de apertura frontal con tapizado deluxe. Máximo confort y estilo para tu dormitorio.</p><ul><li>Apertura frontal tipo ottoman</li><li>Tapizado deluxe</li><li>Gran capacidad</li><li>Montaje incluido</li></ul>',
      product_type: 'Canapé',
      tags: 'canape, ottoman, deluxe, entrega-48h',
      variants: [
        { option1: '135x190', price: '349.00', sku: 'CANOT-135' },
        { option1: '150x190', price: '379.00', sku: 'CANOT-150' },
        { option1: '160x200', price: '399.00', sku: 'CANOT-160' },
        { option1: '180x200', price: '429.00', sku: 'CANOT-180' },
      ],
      options: [{ name: 'Medida' }],
    },
    {
      handle: 'pack-completo-descanso',
      title: 'Pack Completo Descanso',
      body_html: '<p>Pack completo: canapé + colchón viscoelástico + almohadas de regalo. Todo lo que necesitas para tu nuevo dormitorio en una sola entrega.</p><ul><li>Canapé abatible incluido</li><li>Colchón viscoelástico incluido</li><li>Almohadas de regalo</li><li>Entrega e instalación en 48h</li></ul>',
      product_type: 'Pack',
      tags: 'pack, canape, colchon, oferta, entrega-48h',
      variants: [
        { option1: '90x190', price: '399.00', sku: 'PACKC-90' },
        { option1: '135x190', price: '449.00', sku: 'PACKC-135' },
        { option1: '150x190', price: '499.00', sku: 'PACKC-150' },
        { option1: '160x200', price: '549.00', sku: 'PACKC-160' },
        { option1: '180x200', price: '599.00', sku: 'PACKC-180' },
      ],
      options: [{ name: 'Medida' }],
    },
  ];

  const createdProducts = [];

  for (const product of products) {
    console.log(`Creating: ${product.title}...`);
    const res = await fetch(`${API}/products.json`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ product: { ...product, status: 'active', published: true } }),
    });
    const data = await res.json();
    if (res.status === 201) {
      const p = data.product;
      console.log(`  ✓ Created: ${p.title} (id: ${p.id})`);
      console.log(`  Variants:`);
      p.variants.forEach(v => console.log(`    - ${v.option1}: id=${v.id}, price=${v.price}`));
      createdProducts.push({ handle: product.handle, id: p.id, variants: p.variants.map(v => ({ size: v.option1, id: v.id, price: v.price })) });
    } else {
      console.log(`  ✗ Failed: ${res.status}`, JSON.stringify(data));
    }
  }

  console.log('\n=== PRODUCT MAP (for checkout URLs) ===');
  console.log(JSON.stringify(createdProducts, null, 2));

  await conn.end();
}

main().catch(console.error);
