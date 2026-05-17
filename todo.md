# Descanso Rápido Castilla — Full Project TODO

## Phase 1: Product Images
- [x] Generate clean AI product images: Colchón Hybrid HR
- [x] Generate clean AI product images: Colchón New Memory HR
- [x] Generate clean AI product images: Canapé Excellent (wood)
- [x] Generate clean AI product images: Canapé Premium (polipiel)
- [x] Generate clean AI product images: Canapé Articulado Motorizado
- [x] Generate clean AI product images: Base Tapizada Lucy
- [x] Generate lifestyle/hero image for homepage
- [ ] Upload all product images to Shopify products (requires write_products scope)

## Phase 2: Shopify Products & Collections
- [x] Shopify OAuth connected (token stored in DB)
- [ ] Fix write_products API scope (reinstall app or request approval from Shopify)
- [ ] Set store currency to EUR — MANUAL STEP REQUIRED: Go to Shopify Admin > Settings > General > Store currency > Change to EUR
- [ ] Create collection: Canapés Abatibles
- [ ] Create collection: Bases Tapizadas
- [ ] Create collection: Colchones
- [ ] Create all products with placeholder prices (blocked by write scope)
- [ ] Add placeholder prices (to be updated when supplier pricing confirmed)

## Phase 3: Shopify Storefront
- [x] Light, homely design theme (warm whites, natural tones)
- [x] Homepage hero with 48h delivery banner
- [x] Mobile showroom section ("Te visitamos en casa — Fuenlabrada y alrededores")
- [x] Payment methods section: Efectivo / Bizum / Tarjeta / Contrareembolso
- [x] WhatsApp Business floating button (click to chat)
- [x] Product grid with 6 products (placeholder prices — update when confirmed)
- [x] Upsell prompts on product cards
- [x] Testimonials section
- [x] Delivery info section
- [x] Contact/booking page for mobile showroom visits (/reservar-visita)
- [x] Update WhatsApp number (set to 34711204284 across all pages including ReservarVisita)

## Phase 4: Admin App Frontend
- [x] Dashboard home with stats (enquiries, bookings, Shopify status)
- [x] Enquiry inbox with AI reply suggestions (/enquiries)
- [x] Mobile showroom scheduler with status management (/showroom)
- [ ] Product manager page (full implementation)
- [ ] Delivery tracker

## Phase 5: Wallapop & Facebook Marketplace
- [x] Write Wallapop listings for all products (marketing/marketplace-listings.md)
- [x] Write Facebook Marketplace listings for all products
- [x] Write Milanuncios listings
- [x] Write posting guide (how often to refresh, best times)

## Phase 6: Instagram Ads & Social Media
- [x] Instagram campaign guide (marketing/instagram-campaign-guide.md)
- [x] Ad copy variants for 4 key messages
- [x] WhatsApp Business auto-reply messages
- [x] Budget recommendation (€100–300/month)
- [x] Content calendar and posting strategy
- [ ] Create visual ad creatives (images/video)

## Phase 7: Final Delivery
- [x] Full site review and polish
- [x] TypeScript zero errors
- [x] Checkpoint saved
- [x] Published to descansoshop-ntep5r75.manus.space
- [ ] Partner showcase document prepared
- [ ] Handover notes: what to update when prices confirmed

## Phase 8: Internationalisation (EN/ES Toggle)
- [ ] Create LanguageContext with ES/EN toggle
- [ ] Add translations file covering all storefront copy
- [ ] Wire Home.tsx to language context
- [ ] Wire ProductDetail.tsx to language context
- [ ] Wire ReservarVisita.tsx to language context
- [ ] Add discreet ES/EN toggle button to nav header
