import { createConnection } from 'mysql2/promise';

const db = await createConnection(process.env.DATABASE_URL);
const [tokenRows] = await db.execute('SELECT accessToken FROM shopify_tokens LIMIT 1');
const TOKEN = tokenRows[0]?.accessToken;
const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const API = `https://${DOMAIN}/admin/api/2024-01`;

async function shopify(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      'X-Shopify-Access-Token': TOKEN,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) {
    console.error(`Error ${method} ${path}:`, JSON.stringify(data));
    throw new Error(`Shopify API error: ${res.status}`);
  }
  return data;
}

// ─── 1. Update store currency to EUR ─────────────────────────────────────────
console.log('\n1. Updating store currency to EUR...');
try {
  await shopify('PUT', '/shop.json', {
    shop: { currency: 'EUR', money_format: '€{{amount}}', money_with_currency_format: '€{{amount}} EUR' }
  });
  console.log('   ✓ Currency updated to EUR');
} catch (e) {
  console.log('   ⚠ Currency update skipped (may need manual update in Shopify admin)');
}

// ─── 2. Create Collections ────────────────────────────────────────────────────
console.log('\n2. Creating collections...');

const collections = [
  { title: 'Canapés Abatibles', body_html: '<p>Canapés abatibles con gran capacidad de almacenaje. Tapizados en tela o polipiel, con tapa 3D transpirable. Entrega en 48 horas.</p>', sort_order: 'best-selling' },
  { title: 'Bases Tapizadas', body_html: '<p>Bases tapizadas de alta calidad, disponibles en tela 3D y polipiel. Fabricadas en España. Entrega en 48 horas.</p>', sort_order: 'best-selling' },
  { title: 'Colchones Económicos', body_html: '<p>Colchones de calidad a precio asequible. Muelles ensacados y viscoelásticos desde €129. La mejor relación calidad-precio del mercado.</p>', sort_order: 'price-asc' },
  { title: 'Colchones Premium', body_html: '<p>Colchones de alta gama con tecnología avanzada. Muelles ensacados premium, viscoelástico multicapa y látex natural. El descanso que mereces.</p>', sort_order: 'price-asc' },
  { title: 'Ofertas y Packs', body_html: '<p>Ahorra comprando base + colchón juntos. Descuentos especiales en packs seleccionados.</p>', sort_order: 'best-selling' },
];

const collectionIds = {};
for (const col of collections) {
  try {
    const result = await shopify('POST', '/custom_collections.json', { custom_collection: col });
    collectionIds[col.title] = result.custom_collection.id;
    console.log(`   ✓ Created collection: ${col.title} (ID: ${result.custom_collection.id})`);
  } catch (e) {
    console.log(`   ⚠ Skipped collection: ${col.title} - ${e.message}`);
  }
}

// ─── 3. Helper to add product to collection ───────────────────────────────────
async function addToCollection(productId, collectionTitle) {
  const colId = collectionIds[collectionTitle];
  if (!colId) return;
  try {
    await shopify('POST', '/collects.json', {
      collect: { product_id: productId, collection_id: colId }
    });
  } catch (e) {
    // ignore
  }
}

// ─── 4. Create Products ───────────────────────────────────────────────────────
console.log('\n3. Creating products...');

const sizes = ['90 x 190 cm', '135 x 190 cm', '150 x 190 cm', '180 x 190 cm'];
const sizeOptions = sizes.map(s => ({ option1: s }));

function makeVariants(prices) {
  // prices: [price_90, price_135, price_150, price_180]
  return sizes.map((s, i) => ({
    option1: s,
    price: prices[i].toString(),
    requires_shipping: true,
    taxable: true,
    inventory_management: null,
    inventory_policy: 'continue',
    weight: 30,
    weight_unit: 'kg',
  }));
}

const products = [
  // ── CANAPÉS ABATIBLES ──
  {
    title: 'Canapé Abatible Básico',
    body_html: `<p><strong>Canapé abatible con tapa 3D transpirable</strong> — la solución perfecta para ganar espacio en tu dormitorio sin sacrificar estilo.</p>
<ul>
  <li>Tapa 3D transpirable de alta calidad</li>
  <li>Estructura reforzada de madera aglomerada</li>
  <li>Gran capacidad de almacenaje (altura 32 cm)</li>
  <li>Esquinas redondeadas para mayor seguridad</li>
  <li>Disponible en blanco, gris y beige</li>
  <li><strong>Entrega en 48 horas</strong> con montaje incluido</li>
</ul>
<p>💳 Pago en efectivo, Bizum, tarjeta o contrareembolso</p>`,
    vendor: 'Descanso Rápido Castilla',
    product_type: 'Canapé Abatible',
    tags: 'canape, abatible, almacenaje, dormitorio, entrega-48h',
    options: [{ name: 'Tamaño' }],
    variants: makeVariants([199, 249, 299, 349]),
    collections: ['Canapés Abatibles'],
  },
  {
    title: 'Canapé Abatible Premium Polipiel',
    body_html: `<p><strong>Canapé abatible tapizado en polipiel de alta calidad</strong> — elegancia y funcionalidad para el dormitorio que siempre soñaste.</p>
<ul>
  <li>Tapizado en polipiel premium, fácil de limpiar</li>
  <li>Tapa 3D transpirable extraíble</li>
  <li>Gran capacidad de almacenaje (altura 35 cm)</li>
  <li>Estructura reforzada con patas niveladoras</li>
  <li>Disponible en blanco, gris antracita, beige y marrón</li>
  <li><strong>Entrega en 48 horas</strong> con montaje incluido</li>
</ul>
<p>💳 Pago en efectivo, Bizum, tarjeta o contrareembolso</p>`,
    vendor: 'Descanso Rápido Castilla',
    product_type: 'Canapé Abatible',
    tags: 'canape, abatible, polipiel, premium, almacenaje, entrega-48h',
    options: [{ name: 'Tamaño' }],
    variants: makeVariants([349, 449, 499, 599]),
    collections: ['Canapés Abatibles'],
  },

  // ── BASES TAPIZADAS ──
  {
    title: 'Base Tapizada Tela 3D',
    body_html: `<p><strong>Base tapizada en tela 3D transpirable</strong> — soporte firme y transpirable para un descanso perfecto.</p>
<ul>
  <li>Tejido 3D transpirable de alta calidad</li>
  <li>5 barras transversales reforzadas</li>
  <li>Patas regulables en altura (25 cm)</li>
  <li>Fabricada en España</li>
  <li>Disponible en gris, beige y blanco</li>
  <li><strong>Entrega en 48 horas</strong></li>
</ul>
<p>💳 Pago en efectivo, Bizum, tarjeta o contrareembolso</p>`,
    vendor: 'Descanso Rápido Castilla',
    product_type: 'Base Tapizada',
    tags: 'base, tapizada, somier, dormitorio, entrega-48h',
    options: [{ name: 'Tamaño' }],
    variants: makeVariants([129, 169, 199, 229]),
    collections: ['Bases Tapizadas'],
  },
  {
    title: 'Base Tapizada Premium Polipiel',
    body_html: `<p><strong>Base tapizada en polipiel premium</strong> — el complemento perfecto para tu colchón de alta gama.</p>
<ul>
  <li>Tapizado en polipiel premium resistente</li>
  <li>Estructura de madera maciza reforzada</li>
  <li>6 barras transversales de alta resistencia</li>
  <li>Patas cromadas regulables</li>
  <li>Disponible en blanco, negro, gris antracita y beige</li>
  <li><strong>Entrega en 48 horas</strong></li>
</ul>
<p>💳 Pago en efectivo, Bizum, tarjeta o contrareembolso</p>`,
    vendor: 'Descanso Rápido Castilla',
    product_type: 'Base Tapizada',
    tags: 'base, tapizada, polipiel, premium, entrega-48h',
    options: [{ name: 'Tamaño' }],
    variants: makeVariants([229, 299, 349, 379]),
    collections: ['Bases Tapizadas'],
  },

  // ── COLCHONES ECONÓMICOS ──
  {
    title: 'Colchón Descanso Esencial — Muelles Ensacados',
    body_html: `<p><strong>Colchón de muelles ensacados</strong> — calidad garantizada al mejor precio. Ideal para habitaciones de invitados o presupuesto ajustado.</p>
<ul>
  <li>500 muelles ensacados individualmente</li>
  <li>Altura 22 cm</li>
  <li>Acolchado con espuma HR de alta densidad</li>
  <li>Tejido antiácaros e hipoalergénico</li>
  <li>Doble cara (verano/invierno)</li>
  <li><strong>Entrega en 48 horas</strong></li>
</ul>
<p>💳 Pago en efectivo, Bizum, tarjeta o contrareembolso</p>`,
    vendor: 'Descanso Rápido Castilla',
    product_type: 'Colchón',
    tags: 'colchon, muelles-ensacados, economico, entrega-48h',
    options: [{ name: 'Tamaño' }],
    variants: makeVariants([149, 189, 219, 249]),
    collections: ['Colchones Económicos'],
  },
  {
    title: 'Colchón Confort Visco — Viscoelástico',
    body_html: `<p><strong>Colchón viscoelástico</strong> — se adapta perfectamente a tu cuerpo para un descanso reparador. Excelente relación calidad-precio.</p>
<ul>
  <li>Núcleo de espuma HR de alta densidad</li>
  <li>Capa de viscoelástica de 3 cm</li>
  <li>Altura 20 cm</li>
  <li>Tejido stretch transpirable antiácaros</li>
  <li>Tratamiento antibacterias</li>
  <li><strong>Entrega en 48 horas</strong></li>
</ul>
<p>💳 Pago en efectivo, Bizum, tarjeta o contrareembolso</p>`,
    vendor: 'Descanso Rápido Castilla',
    product_type: 'Colchón',
    tags: 'colchon, viscoelastico, economico, entrega-48h',
    options: [{ name: 'Tamaño' }],
    variants: makeVariants([129, 169, 199, 219]),
    collections: ['Colchones Económicos'],
  },

  // ── COLCHONES PREMIUM ──
  {
    title: 'Colchón Muelles Premium 1000',
    body_html: `<p><strong>Colchón de 1000 muelles ensacados con capa viscoelástica</strong> — el equilibrio perfecto entre soporte y confort para un descanso de lujo.</p>
<ul>
  <li>1000 muelles ensacados de alta resistencia</li>
  <li>Capa de viscoelástica de 5 cm</li>
  <li>Altura 30 cm</li>
  <li>7 zonas de confort diferenciadas</li>
  <li>Tejido 3D transpirable premium</li>
  <li>Tratamiento antiácaros, antibacterias e hipoalergénico</li>
  <li><strong>Entrega en 48 horas</strong></li>
</ul>
<p>💳 Pago en efectivo, Bizum, tarjeta o contrareembolso</p>`,
    vendor: 'Descanso Rápido Castilla',
    product_type: 'Colchón',
    tags: 'colchon, muelles-ensacados, premium, viscoelastico, entrega-48h',
    options: [{ name: 'Tamaño' }],
    variants: makeVariants([349, 449, 499, 599]),
    collections: ['Colchones Premium'],
  },
  {
    title: 'Colchón Viscoelástico Premium Multicapa',
    body_html: `<p><strong>Colchón viscoelástico multicapa con gel de refrigeración</strong> — tecnología avanzada para los que no quieren compromisos en su descanso.</p>
<ul>
  <li>Núcleo de espuma HR de ultra alta densidad</li>
  <li>Capa de gel viscoelástico de 6 cm (efecto refrigerante)</li>
  <li>Altura 28 cm</li>
  <li>Tejido 3D transpirable con tratamiento termorregulador</li>
  <li>Antiácaros, antibacterias, hipoalergénico</li>
  <li>Doble cara adaptada a cada estación</li>
  <li><strong>Entrega en 48 horas</strong></li>
</ul>
<p>💳 Pago en efectivo, Bizum, tarjeta o contrareembolso</p>`,
    vendor: 'Descanso Rápido Castilla',
    product_type: 'Colchón',
    tags: 'colchon, viscoelastico, premium, gel, multicapa, entrega-48h',
    options: [{ name: 'Tamaño' }],
    variants: makeVariants([299, 389, 449, 499]),
    collections: ['Colchones Premium'],
  },
  {
    title: 'Colchón Látex Natural Premium',
    body_html: `<p><strong>Colchón de látex natural</strong> — el producto más exclusivo de nuestra colección. Máxima adaptabilidad, transpirabilidad y durabilidad.</p>
<ul>
  <li>Núcleo de látex natural 100% (certificado Oeko-Tex)</li>
  <li>Espuma HR de alta densidad en capas laterales</li>
  <li>Altura 30 cm</li>
  <li>7 zonas de confort con perforaciones para máxima transpirabilidad</li>
  <li>Tejido de algodón orgánico premium</li>
  <li>Antiácaros natural, antibacterias, hipoalergénico</li>
  <li>Duración estimada: 15-20 años</li>
  <li><strong>Entrega en 48 horas</strong></li>
</ul>
<p>💳 Pago en efectivo, Bizum, tarjeta o contrareembolso</p>`,
    vendor: 'Descanso Rápido Castilla',
    product_type: 'Colchón',
    tags: 'colchon, latex, natural, premium, organico, entrega-48h',
    options: [{ name: 'Tamaño' }],
    variants: makeVariants([449, 579, 649, 749]),
    collections: ['Colchones Premium'],
  },

  // ── UPSELL / ACCESORIOS ──
  {
    title: 'Topper Viscoelástico 5 cm',
    body_html: `<p><strong>Topper viscoelástico de 5 cm</strong> — transforma cualquier colchón en una experiencia de descanso premium al instante.</p>
<ul>
  <li>Viscoelástica de alta densidad, 5 cm</li>
  <li>Funda extraíble lavable a máquina</li>
  <li>Antiácaros e hipoalergénico</li>
  <li>Compatible con todos nuestros colchones</li>
  <li><strong>Entrega en 48 horas</strong></li>
</ul>`,
    vendor: 'Descanso Rápido Castilla',
    product_type: 'Accesorio',
    tags: 'topper, viscoelastico, accesorio, upsell, entrega-48h',
    options: [{ name: 'Tamaño' }],
    variants: makeVariants([49, 69, 79, 99]),
    collections: ['Ofertas y Packs'],
  },
  {
    title: 'Almohada Viscoelástica Premium',
    body_html: `<p><strong>Almohada viscoelástica</strong> — el complemento perfecto para completar tu experiencia de descanso.</p>
<ul>
  <li>Relleno de viscoelástica de alta densidad</li>
  <li>Funda de tejido 3D transpirable</li>
  <li>Antiácaros e hipoalergénica</li>
  <li>Altura regulable</li>
  <li><strong>Entrega en 48 horas</strong></li>
</ul>`,
    vendor: 'Descanso Rápido Castilla',
    product_type: 'Accesorio',
    tags: 'almohada, viscoelastica, accesorio, upsell, entrega-48h',
    options: [{ name: 'Medida' }],
    variants: [
      { option1: '50 x 70 cm', price: '29', requires_shipping: true, taxable: true, inventory_management: null, inventory_policy: 'continue' },
      { option1: '70 x 70 cm', price: '39', requires_shipping: true, taxable: true, inventory_management: null, inventory_policy: 'continue' },
    ],
    collections: ['Ofertas y Packs'],
  },
  {
    title: 'Protector de Colchón Impermeable',
    body_html: `<p><strong>Protector de colchón impermeable y transpirable</strong> — protege tu inversión y mantén tu colchón como nuevo durante años.</p>
<ul>
  <li>100% impermeable</li>
  <li>Transpirable y silencioso</li>
  <li>Lavable a 60°C</li>
  <li>Ajuste elástico para colchones hasta 35 cm de altura</li>
  <li><strong>Entrega en 48 horas</strong></li>
</ul>`,
    vendor: 'Descanso Rápido Castilla',
    product_type: 'Accesorio',
    tags: 'protector, colchon, impermeable, accesorio, upsell, entrega-48h',
    options: [{ name: 'Tamaño' }],
    variants: makeVariants([19, 25, 29, 39]),
    collections: ['Ofertas y Packs'],
  },
];

// Create all products
const createdProducts = [];
for (const { collections: productCollections, ...productData } of products) {
  try {
    const result = await shopify('POST', '/products.json', { product: { ...productData, status: 'active' } });
    const product = result.product;
    createdProducts.push(product);
    console.log(`   ✓ Created: ${product.title} (ID: ${product.id})`);

    // Add to collections
    for (const colName of productCollections) {
      await addToCollection(product.id, colName);
    }
  } catch (e) {
    console.log(`   ✗ Failed: ${productData.title} — ${e.message}`);
  }
}

console.log(`\n✅ Done! Created ${createdProducts.length} products and ${Object.keys(collectionIds).length} collections.`);
console.log('\nProduct IDs:');
createdProducts.forEach(p => console.log(`  ${p.id}: ${p.title}`));

await db.end();
