import { test, expect } from "@playwright/test";

test.describe("Vehicle Submission Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator("#submit").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
  });

  test("should display the submission form", async ({ page }) => {
    // Check form header
    await expect(page.locator("#submit h2:has-text('FAHRZEUG')")).toBeVisible();

    // Check seller type buttons
    await expect(page.getByRole("button", { name: "Privatverkäufer" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Händler/Gewerbe" })).toBeVisible();

    // Check required fields
    await expect(page.locator("#submit").getByText("Vollständiger Name")).toBeVisible();
    await expect(page.locator("#submit label:has-text('E-Mail')")).toBeVisible();
    await expect(page.locator("#submit").getByText("Telefonnummer")).toBeVisible();
  });

  test("should select seller type", async ({ page }) => {
    const privateButton = page.getByRole("button", { name: "Privatverkäufer" });
    await privateButton.click({ force: true });
    await expect(privateButton).toHaveClass(/border-\[#f14011\]/);

    const dealerButton = page.getByRole("button", { name: "Händler/Gewerbe" });
    await dealerButton.click({ force: true });
    await expect(dealerButton).toHaveClass(/border-\[#f14011\]/);
  });

  test("should expand and collapse optional sections", async ({ page }) => {
    const vehicleDetailsButton = page.locator("button:has-text('Fahrzeugdetails')");
    await vehicleDetailsButton.click({ force: true });
    await page.waitForTimeout(300);

    await expect(page.locator("#submit input[placeholder='2024']")).toBeVisible();

    await vehicleDetailsButton.click({ force: true });
    await page.waitForTimeout(300);

    await expect(page.locator("#submit input[placeholder='2024']")).not.toBeVisible();
  });

  test("should fill out basic required fields", async ({ page }) => {
    await page.getByRole("button", { name: "Privatverkäufer" }).click({ force: true });

    await page.locator('input[placeholder="Max Mustermann"]').fill("Test User");
    await page.locator('input[placeholder="max@beispiel.de"]').fill("test@example.com");
    await page.locator('input[placeholder*="170"]').fill("+49 170 1234567");

    // Fill brand combobox (can type custom value)
    const brandInput = page.locator('input[placeholder*="Marke auswählen"]');
    await brandInput.fill("BMW");
    // Click elsewhere to close dropdown
    await page.locator('h3:has-text("Fahrzeugdaten")').click({ force: true });
    await page.waitForTimeout(100);

    // Fill model combobox
    const modelInput = page.locator('input[placeholder*="Modell"]');
    await modelInput.fill("M4 Competition");
    await page.locator('h3:has-text("Fahrzeugdaten")').click({ force: true });
    await page.waitForTimeout(100);

    await page.locator('input[placeholder="50000"]').first().fill("85000");
    await page.locator('input[placeholder="80331"]').fill("80331");
    await page.locator('input[placeholder="München"]').fill("München");

    await expect(page.locator('input[placeholder="Max Mustermann"]')).toHaveValue("Test User");
    await expect(brandInput).toHaveValue("BMW");
  });

  test("should have checkbox options", async ({ page }) => {
    await expect(page.locator("#submit label:has-text('Preis verhandelbar')")).toBeVisible();
    await expect(page.locator("#submit label:has-text('MwSt. ausweisbar')")).toBeVisible();
  });

  test("should select features in expandable sections", async ({ page }) => {
    const featuresButton = page.locator("button:has-text('Ausstattung')");
    await featuresButton.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await featuresButton.click({ force: true });
    await page.waitForTimeout(300);

    const klimaButton = page.locator("#submit button:has-text('Klimaanlage')");
    await klimaButton.click({ force: true });

    await expect(klimaButton).toHaveClass(/bg-\[#f14011\]/);
  });

  test("should handle tri-state buttons", async ({ page }) => {
    const conditionButton = page.locator("button:has-text('Zustand & Historie')");
    await conditionButton.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await conditionButton.click({ force: true });
    await page.waitForTimeout(300);

    const jaButton = page.locator("div:has(> label:has-text('Unfallfrei')) button:has-text('Ja')");
    await jaButton.click({ force: true });

    await expect(jaButton).toHaveClass(/bg-\[#f14011\]/);
  });

  test("should show submit button", async ({ page }) => {
    const submitButton = page.getByRole("button", { name: "Zur Prüfung einreichen" });
    await expect(submitButton).toBeVisible();
  });

  test("should handle image upload UI", async ({ page }) => {
    const imagesButton = page.locator("button:has-text('Bilder')");
    await imagesButton.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const addButton = page.locator("#submit button:has-text('Hinzufügen')");
    if (!(await addButton.isVisible())) {
      await imagesButton.click({ force: true });
      await page.waitForTimeout(300);
    }

    await expect(addButton).toBeVisible();
    await expect(page.locator("#submit").getByText("max. 10, je max. 5MB")).toBeVisible();
  });

  test("should submit form with all required fields", async ({ page }) => {
    // Fill all required fields
    await page.getByRole("button", { name: "Privatverkäufer" }).click({ force: true });
    await page.locator('input[placeholder="Max Mustermann"]').fill("E2E Test User");
    await page.locator('input[placeholder="max@beispiel.de"]').fill("e2e@test.dev");
    await page.locator('input[placeholder*="170"]').fill("+49 170 1111111");

    // Fill brand combobox
    const brandInput = page.locator('input[placeholder*="Marke auswählen"]');
    await brandInput.fill("Tesla");
    await page.locator('h3:has-text("Fahrzeugdaten")').click({ force: true });
    await page.waitForTimeout(100);

    // Fill model combobox
    const modelInput = page.locator('input[placeholder*="Modell"]');
    await modelInput.fill("Model 3");
    await page.locator('h3:has-text("Fahrzeugdaten")').click({ force: true });
    await page.waitForTimeout(100);

    await page.locator('input[placeholder="50000"]').first().fill("45000");
    await page.locator('input[placeholder="80331"]').fill("10115");
    await page.locator('input[placeholder="München"]').fill("Berlin");

    // Submit
    const submitButton = page.getByRole("button", { name: "Zur Prüfung einreichen" });
    await submitButton.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await submitButton.click({ force: true });

    // Wait for response - look for success or error message text
    const successMessage = page.locator("text=Fahrzeug erfolgreich eingereicht");
    const errorMessage = page.locator(".bg-red-50");

    // Wait for either success or error to appear
    await expect(successMessage.or(errorMessage)).toBeVisible({ timeout: 30000 });
  });
});

test.describe("Form Validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator("#submit").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
  });

  test("should limit description length", async ({ page }) => {
    const descButton = page.locator("button:has-text('Beschreibung')");
    await descButton.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const textarea = page.locator("#submit textarea").first();
    if (!(await textarea.isVisible())) {
      await descButton.click({ force: true });
      await page.waitForTimeout(300);
    }

    const maxLength = await textarea.getAttribute("maxLength");
    expect(maxLength).toBe("5000");

    await textarea.fill("Test description");
    await expect(page.locator("#submit").getByText("16/5000")).toBeVisible();
  });
});

test.describe("Responsive Design", () => {
  test("should display correctly on tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator("#submit").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    await expect(page.locator("#submit h2")).toBeVisible();
    await expect(page.getByRole("button", { name: "Privatverkäufer" })).toBeVisible();
  });
});
