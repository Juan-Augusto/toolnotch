import { isBlockedBot } from "@/lib/blockedBots";

describe("isBlockedBot", () => {
  it.each([
    "Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)",
    "Mozilla/5.0 (compatible; SemrushBot/7~bl; +http://www.semrush.com/bot.html)",
    "Mozilla/5.0 (compatible; MJ12bot/v1.4.8; http://mj12bot.com/)",
    "Mozilla/5.0 (Linux; Android 5.0) AppleWebKit/537.36 (compatible; Amazonbot/0.1)",
    "mozilla/5.0 (compatible; petalbot;+https://webmaster.petalsearch.com/site/petalbot)",
  ])("blocks %s", (ua) => {
    expect(isBlockedBot(ua)).toBe(true);
  });

  it.each([
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
    "Mediapartners-Google",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36",
  ])("allows %s", (ua) => {
    expect(isBlockedBot(ua)).toBe(false);
  });

  it("allows missing user agent", () => {
    expect(isBlockedBot(null)).toBe(false);
    expect(isBlockedBot("")).toBe(false);
  });
});
