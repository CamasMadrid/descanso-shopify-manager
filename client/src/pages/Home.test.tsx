// @vitest-environment jsdom
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Home from "./Home";

function renderHome() {
  return render(
    <LanguageProvider>
      <Home />
    </LanguageProvider>,
  );
}

afterEach(() => cleanup());

describe("Pack Express homepage", () => {
  it("renders the genuine Pack Express as the default in-stock selection", () => {
    renderHome();

    expect(screen.getAllByText("Pack Express: cama + colchón").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Cama matrimonio 135 × 190 · €269").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Descuento al comprar 2 camas**").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Camas desde €249").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Entrega gratis*").length).toBeGreaterThan(0);
    expect(screen.getByText("*Dentro de 25 km de Madrid centro y otras zonas seleccionadas. Contacta para confirmación.")).toBeTruthy();
    expect(screen.getByText("**Mismo día, misma dirección y cualquier medida. Contacta para confirmar el descuento.")).toBeTruthy();
    expect(screen.getAllByText("Disponible ahora").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Entrega Express").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Canapé Express de Gran Capacidad").length).toBeGreaterThan(0);
    expect(screen.getAllByText("¿Más lejos? Te damos la ruta más económica o el precio para el día que lo necesitas.").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Solo canapé" }).getAttribute("href")).toContain("https://wa.me/34711204284");
    expect(screen.getByRole("link", { name: "Solo colchón" }).getAttribute("href")).toContain("https://wa.me/34711204284");
  });

  it("keeps Express to size and colour, then reveals the matching preview", async () => {
    const user = userEvent.setup();
    renderHome();

    expect(screen.queryByAltText("Canapé Express de Gran Capacidad en acabado Cambrian")).toBeNull();
    expect(screen.getByRole("button", { name: /Consultar mi selección por WhatsApp/i }).hasAttribute("disabled")).toBe(true);

    await user.selectOptions(screen.getByRole("combobox"), "135 × 190 cm");
    expect(screen.getByRole("button", { name: /Consultar mi selección por WhatsApp/i }).hasAttribute("disabled")).toBe(true);
    expect(screen.getByRole("option", { name: "135 × 190 cm — €269" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Cambrian" }));

    expect(screen.getByAltText("Canapé Express de Gran Capacidad en acabado Cambrian")).toBeTruthy();
    expect(screen.getByText("€269")).toBeTruthy();
    expect(screen.getByRole("button", { name: /Consultar mi selección por WhatsApp/i }).hasAttribute("disabled")).toBe(false);
  });

  it("switches the rendered mattress and storage-bed alternatives to September", async () => {
    const user = userEvent.setup();
    renderHome();

    await user.click(screen.getByRole("button", { name: /Ver opciones para septiembre/i }));

    expect(screen.getAllByText("Desde septiembre").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Esencial").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Confort").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Premium").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Canapé de Madera con Almacenaje").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Nórdico").length).toBeGreaterThan(0);

    await user.selectOptions(screen.getByRole("combobox"), "135 × 190 cm");
    await user.click(screen.getByRole("button", { name: "Nórdico" }));
    expect(screen.getByAltText("Canapé de Madera con Almacenaje en acabado Nórdico")).toBeTruthy();
  });

  it("removes the storage-bed comparison when the customer wants only a mattress", async () => {
    const user = userEvent.setup();
    renderHome();

    await user.click(screen.getByRole("button", { name: /Ver opciones para septiembre/i }));
    await user.click(screen.getAllByRole("button", { name: /Solo colchón/i })[0]);

    expect(screen.queryByText("Compara los dos canapés")).toBeNull();
    expect(screen.getAllByText("Solo colchón").length).toBeGreaterThan(0);
  });
});
