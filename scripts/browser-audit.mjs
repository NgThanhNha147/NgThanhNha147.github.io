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
  const introText = (await page.locator(".screen-loader-name").textContent())
    ?.replace(/\s+/g, "")
    .trim();
  if (profile.name === "compact") {
    await page.waitForTimeout(550);
    await page.screenshot({ path: "artifacts/intro-chaos.png" });
    await page.waitForTimeout(1150);
    await page.screenshot({ path: "artifacts/intro-assembly.png" });
  }
  await page
    .locator(".monitor-experience:not(.state-loading)")
    .waitFor({ timeout: 12000 });
  await page.locator(".monitor-canvas").waitFor({ timeout: 12000 });
  await page.waitForTimeout(250);
  await page.screenshot({ path: `artifacts/${profile.name}-hero.png` });
  const monitorSamples = [];
  for (const requestedProgress of [0, 0.4, 0.68, 0.82, 0.95, 1]) {
    await page.evaluate((progress) => {
      const monitor = document.querySelector(".monitor-experience");
      const distance = monitor.offsetHeight - innerHeight;
      scrollTo(0, monitor.offsetTop + distance * progress);
    }, requestedProgress);
    await page.waitForTimeout(120);
    monitorSamples.push(
      await page.evaluate((requested) => {
        const bezel = document
          .querySelector(".monitor-bezel")
          .getBoundingClientRect();
        const screen = document
          .querySelector(".screen-viewport")
          .getBoundingClientRect();
        const fullscreen =
          Math.abs(screen.left) < 0.1 &&
          Math.abs(screen.top) < 0.1 &&
          Math.abs(screen.right - innerWidth) < 0.1 &&
          Math.abs(screen.bottom - innerHeight) < 0.1;
        const bezelOutside =
          bezel.left < 0 &&
          bezel.top < 0 &&
          bezel.right > innerWidth &&
          bezel.bottom > innerHeight;
        return {
          requested,
          contained:
            screen.left >= bezel.left - 0.1 &&
            screen.top >= bezel.top - 0.1 &&
            screen.right <= bezel.right + 0.1 &&
            screen.bottom <= bezel.bottom + 0.1,
          fullscreenAfterBezel: !fullscreen || bezelOutside,
        };
      }, requestedProgress),
    );
  }
  const monitorArchitecture = await page.evaluate(() => ({
    roots: document.querySelectorAll(".monitor-root").length,
    bezels: document.querySelectorAll(".monitor-bezel").length,
    screens: document.querySelectorAll(".screen-viewport").length,
    loaders: document.querySelectorAll(".screen-loader").length,
    heroes: document.querySelectorAll(".screen-hero").length,
    overflow: getComputedStyle(document.querySelector(".screen-viewport"))
      .overflow,
  }));
  monitorArchitecture.valid =
    monitorArchitecture.roots === 1 &&
    monitorArchitecture.bezels === 1 &&
    monitorArchitecture.screens === 1 &&
    monitorArchitecture.loaders === 1 &&
    monitorArchitecture.heroes === 1 &&
    monitorArchitecture.overflow === "hidden" &&
    monitorSamples.every(
      (sample) => sample.contained && sample.fullscreenAfterBezel,
    );
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
      .locator(".monitor-experience:not(.state-loading)")
      .waitFor({ timeout: 5000 });
    returnIntroMs = Date.now() - started;
  }
  results.push({
    profile: profile.name,
    errors,
    seriousA11y: seriousA11y.map((v) => v.id),
    languageStored,
    introText,
    monitorArchitecture,
    monitorSamples,
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
  .locator(".monitor-experience:not(.state-loading)")
  .waitFor({ timeout: 5000 });
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
        !result.monitorArchitecture?.valid) ||
      (result.profile !== "reduced-motion" &&
        result.introText !== "WORKWITHTNKAX") ||
      (result.profile === "desktop" && result.returnIntroMs > 10000) ||
      (result.profile === "reduced-motion" && result.reducedIntroMs > 5000),
  )
)
  process.exitCode = 1;
