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
    expect(screen.getAllByText("Disponible ahora").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Entrega Express").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Canapé Express de Gran Capacidad").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Entrega y montaje gratis hasta 25 km de Madrid centro.").length).toBeGreaterThan(0);
    expect(screen.getAllByText("¿Más lejos? Te damos la ruta más económica o el precio para el día que lo necesitas.").length).toBeGreaterThan(0);
  });

  it("keeps Express to size and colour, then reveals the matching preview", async () => {
    const user = userEvent.setup();
    renderHome();

    expect(screen.queryByRole("button", { name: /Solo colchón/i })).toBeNull();
    expect(screen.queryByAltText("Canapé Express de Gran Capacidad en acabado Cambrian")).toBeNull();
    expect(screen.getByRole("button", { name: /Consultar mi selección por WhatsApp/i }).hasAttribute("disabled")).toBe(true);

    await user.selectOptions(screen.getByRole("combobox"), "135 × 190 cm");
    expect(screen.getByRole("button", { name: /Consultar mi selección por WhatsApp/i }).hasAttribute("disabled")).toBe(true);
    await user.click(screen.getByRole("button", { name: "Cambrian" }));

    expect(screen.getByAltText("Canapé Express de Gran Capacidad en acabado Cambrian")).toBeTruthy();
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
    await user.click(screen.getByRole("button", { name: /Solo colchón/i }));

    expect(screen.queryByText("Compara los dos canapés")).toBeNull();
    expect(screen.getAllByText("Solo colchón").length).toBeGreaterThan(0);
  });
});
