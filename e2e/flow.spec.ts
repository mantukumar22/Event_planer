import { test, expect } from '@playwright/test';

test.describe('EventCraft AI E2E User Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
  });

  test('completes full event planning journey: landing -> intake -> plan -> export', async ({ page }) => {
    // 1. Landing Page Verification
    await expect(page.locator('h1')).toContainText(/ROYAL EVENT ARCHITECTURE/i);
    const startCta = page.locator('a[href="#intake-form"]').first();
    await expect(startCta).toBeVisible();
    await startCta.click();

    // 2. Intake Form Interaction
    const titleInput = page.locator('#eventTitle');
    await expect(titleInput).toBeVisible();
    await titleInput.fill('E2E Royal Gala');

    const dateInput = page.locator('#eventDate');
    await dateInput.fill('2027-09-20');

    const guestCountInput = page.locator('#guestCount');
    await guestCountInput.fill('120');

    const budgetInput = page.locator('#totalBudget');
    await budgetInput.fill('25000');

    const locationInput = page.locator('#location');
    await locationInput.fill('London, UK');

    const themeInput = page.locator('#themeVibe');
    await themeInput.fill('Dark Velvet Royal Chic');

    // Submit Intake Form
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    // 3. Plan View Rendered
    const planHeading = page.locator('#event-overview-title');
    await expect(planHeading).toBeVisible({ timeout: 15000 });
    await expect(planHeading).toContainText('E2E Royal Gala');

    // 4. Budget Tab Verification & What-If Slider
    await expect(page.locator('#tab-budget')).toBeVisible();
    const guestSlider = page.locator('input[type="range"][aria-label="Guest count what-if slider"]');
    if (await guestSlider.isVisible()) {
      await guestSlider.fill('150');
      await expect(page.locator('text=Simulated Spend')).toBeVisible();
    }

    // 5. Timeline Tab & Task Check-off
    const timelineTab = page.locator('#tab-timeline');
    await timelineTab.click();
    await expect(page.locator('#panel-timeline')).toBeVisible();

    // Toggle a task checkbox
    const firstCheckbox = page.locator('#panel-timeline input[type="checkbox"]').first();
    await expect(firstCheckbox).toBeVisible();
    await firstCheckbox.click();

    // 6. Day-of Run-of-Show Toggle
    const dayOfToggle = page.locator('button:has-text("Day-of Run of Show")');
    if (await dayOfToggle.isVisible()) {
      await dayOfToggle.click();
      await expect(page.locator('text=Vendor Load-In')).toBeVisible();
    }

    // 7. Export Modal
    const exportBtn = page.locator('button:has-text("Export CSV / .ICS")');
    await exportBtn.click();
    const exportModal = page.locator('div[role="dialog"]');
    await expect(exportModal).toBeVisible();
    await expect(exportModal.locator('text=iCalendar (.ics) Schedule')).toBeVisible();
    await page.locator('button[aria-label="Close export modal"]').click();
    await expect(exportModal).not.toBeVisible();

    // 8. Ask the Planner Chat Box
    const chatInput = page.locator('input[placeholder*="Ask about vendors"]');
    if (await chatInput.isVisible()) {
      await chatInput.fill('What is our catering budget?');
      await page.keyboard.press('Enter');
      await expect(page.locator('div[role="log"]')).toContainText(/catering|budget/i, { timeout: 10000 });
    }
  });

  test('validates form fields and displays accessible error summary on invalid submit', async ({ page }) => {
    // Navigate to form and clear title
    const titleInput = page.locator('#eventTitle');
    await titleInput.fill('');

    // Trigger immediate submit
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    // Verify Error Summary with role="alert" appears
    const errorSummary = page.locator('div[role="alert"]').first();
    await expect(errorSummary).toBeVisible();
  });
});
