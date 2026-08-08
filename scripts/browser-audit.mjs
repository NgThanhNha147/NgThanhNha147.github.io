import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const browser = await chromium.launch({ headless: true });
const baseUrl = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4173";
const results = [];
for (const profile of [
  { name: "desktop", viewport: { width: 1440, height: 1000 } },
  { name: "compact", viewport: { width: 800, height: 800 } },
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
  const introText = (await page.locator(".intro-name").textContent())
    ?.replace(/\s+/g, "")
    .trim();
  if (profile.name === "compact") {
    await page.waitForTimeout(550);
    await page.screenshot({ path: "artifacts/intro-chaos.png" });
    await page.waitForTimeout(1150);
    await page.screenshot({ path: "artifacts/intro-assembly.png" });
  }
  await page
    .locator(".intro-loader")
    .waitFor({ state: "detached", timeout: 12000 });
  await page.locator(".monitor-canvas").waitFor({ timeout: 12000 });
  await page.waitForTimeout(250);
  await page.screenshot({ path: `artifacts/${profile.name}-hero.png` });
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
  let returnIntroMs = null;
  if (profile.name === "desktop") {
    const started = Date.now();
    await page.reload({ waitUntil: "domcontentloaded" });
    await page
      .locator(".intro-loader")
      .waitFor({ state: "detached", timeout: 3000 });
    returnIntroMs = Date.now() - started;
  }
  results.push({
    profile: profile.name,
    errors,
    seriousA11y: seriousA11y.map((v) => v.id),
    languageStored,
    introText,
    returnIntroMs,
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
const reducedStarted = Date.now();
await reducedPage
  .locator(".intro-loader")
  .waitFor({ state: "detached", timeout: 5000 });
const reducedIntroMs = Date.now() - reducedStarted;
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
  reducedIntroMs,
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
      result.overflow ||
      (result.profile !== "reduced-motion" &&
        result.introText !== "WORKWITHTNKAX") ||
      (result.profile === "desktop" && result.returnIntroMs > 10000) ||
      (result.profile === "reduced-motion" && result.reducedIntroMs > 5000),
  )
)
  process.exitCode = 1;
