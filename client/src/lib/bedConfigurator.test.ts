import { describe, expect, it } from "vitest";
import {
  EXPRESS_COLOURS,
  PREMIUM_FINISHES,
  STANDARD_SIZES,
  buildWhatsAppEnquiry,
  getAvailableFinishes,
} from "./bedConfigurator";

describe("bed configurator rules", () => {
  it("keeps the custom-size route available without adding more standard size choices", () => {
    expect(STANDARD_SIZES).toContain("Necesito otra medida");
    expect(STANDARD_SIZES).toContain("120 × 190 cm");
    expect(STANDARD_SIZES).toHaveLength(6);
  });

  it("uses five in-stock Express colours and four September premium finishes", () => {
    expect(getAvailableFinishes("express")).toEqual(EXPRESS_COLOURS);
    expect(getAvailableFinishes("premium")).toEqual(PREMIUM_FINISHES);
    expect(EXPRESS_COLOURS).toHaveLength(5);
    expect(PREMIUM_FINISHES).toHaveLength(4);
    expect(PREMIUM_FINISHES).toContain("Cambrian");
    expect(PREMIUM_FINISHES).not.toContain("Cerezo");
  });

  it("builds a Spanish Pack Express WhatsApp enquiry with the in-stock mattress and storage bed", () => {
    const url = buildWhatsAppEnquiry({
      purchaseType: "pack",
      availability: "express",
      size: "135 × 190 cm",
      mattressTier: "express",
      canapeStyle: "express",
      finish: "Cerezo",
      postcode: "28001",
      deliveryNeed: "flexible",
    }, "es");

    const message = decodeURIComponent(url.split("text=")[1] ?? "");
    expect(url).toContain("https://wa.me/34711204284");
    expect(message).toContain("Producto: Pack cama + colchón");
    expect(message).toContain("Disponibilidad: Disponible ahora");
    expect(message).toContain("Colchón: Entrega Express");
    expect(message).toContain("Canapé: Canapé Express de Gran Capacidad");
    expect(message).toContain("Color / acabado: Cerezo");
    expect(message).toContain("Código postal: 28001");
  });

  it("carries the 120 × 190 cm Express size into the WhatsApp enquiry", () => {
    const url = buildWhatsAppEnquiry({
      purchaseType: "pack",
      availability: "express",
      size: "120 × 190 cm",
      mattressTier: "express",
      canapeStyle: "express",
      finish: "Cambrian",
      postcode: "28001",
      deliveryNeed: "flexible",
    }, "es");

    const message = decodeURIComponent(url.split("text=")[1] ?? "");
    expect(message).toContain("Medida: 120 × 190 cm");
  });

  it("builds a custom-size September enquiry with a requested delivery date", () => {
    const url = buildWhatsAppEnquiry({
      purchaseType: "pack",
      availability: "september",
      size: "Necesito otra medida",
      mattressTier: "premium",
      canapeStyle: "premium",
      finish: "Nórdico",
      postcode: "28931",
      deliveryNeed: "specific",
    }, "es");

    const message = decodeURIComponent(url.split("text=")[1] ?? "");
    expect(message).toContain("Disponibilidad: Desde septiembre");
    expect(message).toContain("Necesito otra medida: ____ × ____ cm");
    expect(message).toContain("Fecha ideal de entrega: ____");
    expect(message).toContain("¿Podéis confirmarme disponibilidad y precio para esta medida?");
  });
});
