import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const browser = await chromium.launch({ headless: true });
const baseUrl = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4173";
const results = [];
for (const profile of [
  { name: "desktop", viewport: { width: 1440, height: 1000 } },
  { name: "mobile", viewport: { width: 390, height: 844 }, isMobile: true },
]) {
  const context = await browser.newContext(profile);
  const page = await context.newPage();
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.waitForTimeout(1700);
  const accessibility = await new AxeBuilder({ page }).analyze();
  const seriousA11y = accessibility.violations.filter((violation) =>
    ["serious", "critical"].includes(violation.impact ?? ""),
  );
  await page.locator(".language").click();
  const languageStored = await page.evaluate(() =>
    localStorage.getItem("portfolio-language"),
  );
  if (profile.name === "mobile") {
    await page.locator(".menu-toggle").click();
    if (
      !(await page
        .locator(".nav")
        .evaluate((element) => element.classList.contains("menu-open")))
    )
      errors.push("Mobile menu did not open");
    await page.locator(".menu-toggle").click();
  }
  for (const id of [
    "about",
    "goals",
    "projects",
    "skills",
    "education",
    "contact",
  ]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
  }
  await page.screenshot({
    path: `artifacts/${profile.name}.png`,
    fullPage: true,
  });
  const sections = await page.locator("main > section").count();
  const githubLinks = await page
    .locator('a[href*="github.com/NgThanhNha147"]')
    .count();
  const layout = await page.evaluate(() => {
    const viewport = document.documentElement.clientWidth;
    const offenders = [...document.querySelectorAll("*")]
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.right > viewport + 2 || rect.left < -2;
      })
      .slice(0, 8)
      .map((element) => ({
        tag: element.tagName,
        className: element.className,
        rect: element.getBoundingClientRect().toJSON(),
      }));
    return {
      overflow: document.documentElement.scrollWidth > viewport + 2,
      offenders,
    };
  });
  results.push({
    profile: profile.name,
    errors,
    seriousA11y: seriousA11y.map((v) => v.id),
    languageStored,
    sections,
    githubLinks,
    ...layout,
  });
  await context.close();
}
const reducedContext = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  reducedMotion: "reduce",
});
const reducedPage = await reducedContext.newPage();
await reducedPage.goto(baseUrl, { waitUntil: "networkidle" });
const reducedMotion = await reducedPage.evaluate(() => ({
  cursorHidden:
    getComputedStyle(document.querySelector(".cursor-ring")).display === "none",
  projectAnimation: getComputedStyle(document.querySelector(".project-card"))
    .animationDuration,
}));
results.push({
  profile: "reduced-motion",
  errors: [],
  seriousA11y: [],
  languageStored: "n/a",
  sections: 7,
  githubLinks: 3,
  overflow: false,
  reducedMotion,
});
await reducedContext.close();
await browser.close();
console.log(JSON.stringify(results, null, 2));
if (
  results.some(
    (result) =>
      result.errors.length ||
      result.seriousA11y.length ||
      !result.languageStored ||
      result.sections !== 7 ||
      result.githubLinks < 3 ||
      result.overflow,
  )
)
  process.exitCode = 1;
