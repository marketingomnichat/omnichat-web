import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { isSafeRelativePath, matchRedirect } from "../lib/redirects";
import { isFresh, fetchRedirectRules, __resetRedirectCacheForTest } from "../proxy";
import type { sanityFetch } from "../lib/sanity/client";

const redirects = [
  { from: "/blog/antigo", to: "/blog/novo", permanent: true },
  { from: "/precos/", to: "/precos", permanent: true },
];

describe("matchRedirect", () => {
  it("match exato", () => {
    expect(matchRedirect("/blog/antigo", redirects)).toEqual({ to: "/blog/novo", permanent: true });
  });
  it("destino igual ao path atual nunca redireciona (evita loop)", () => {
    // A regra {from:"/precos/", to:"/precos"} casa com "/precos" após
    // normalização, mas o destino é o próprio path atual — redirecionar
    // aqui geraria loop infinito. Deve retornar null.
    expect(matchRedirect("/precos", redirects)).toBeNull();
  });
  it("sem match retorna null", () => {
    expect(matchRedirect("/qualquer", redirects)).toBeNull();
  });
  it("não redireciona para si mesmo", () => {
    expect(matchRedirect("/precos", [{ from: "/precos", to: "/precos", permanent: true }])).toBeNull();
  });
});

describe("isFresh", () => {
  it("returns true when within TTL", () => {
    expect(isFresh(1000, 1500, 60_000)).toBe(true);
  });
  it("returns false when past TTL", () => {
    expect(isFresh(1000, 70_000, 60_000)).toBe(false);
  });
  it("returns false when exactly at TTL boundary", () => {
    expect(isFresh(1000, 61_000, 60_000)).toBe(false);
  });
});

describe("fetchRedirectRules", () => {
  beforeEach(() => {
    __resetRedirectCacheForTest();
    vi.restoreAllMocks();
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns empty array when fetcher throws and no cache exists", async () => {
    const throwingFetcher = vi.fn().mockRejectedValue(new Error("Sanity outage"));
    const result = await fetchRedirectRules(throwingFetcher as typeof sanityFetch);
    expect(result).toEqual([]);
  });

  it("returns rules on successful fetch", async () => {
    const rules = [{ from: "/old", to: "/new", permanent: true }];
    const successFetcher = vi.fn().mockResolvedValue(rules);
    const result = await fetchRedirectRules(successFetcher as typeof sanityFetch);
    expect(result).toEqual(rules);
  });

  it("returns stale cached rules when fetcher throws after TTL expiry", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);

    // Seed the cache with a successful fetch at t=0.
    const rules = [{ from: "/velho", to: "/novo", permanent: true }];
    const successFetcher = vi.fn().mockResolvedValue(rules);
    await fetchRedirectRules(successFetcher as typeof sanityFetch);

    // Advance past the 60s TTL so the cache is stale.
    vi.setSystemTime(61_000);

    // Fetcher now fails: must fall back to the stale cached rules.
    const throwingFetcher = vi.fn().mockRejectedValue(new Error("Sanity outage"));
    const result = await fetchRedirectRules(throwingFetcher as typeof sanityFetch);
    expect(throwingFetcher).toHaveBeenCalledOnce();
    expect(result).toEqual(rules);
  });

  it("serves fresh cache without calling the fetcher", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);

    const rules = [{ from: "/a", to: "/b", permanent: false }];
    const successFetcher = vi.fn().mockResolvedValue(rules);
    await fetchRedirectRules(successFetcher as typeof sanityFetch);

    // Still within TTL: second call must not hit the fetcher.
    vi.setSystemTime(30_000);
    const secondFetcher = vi.fn().mockRejectedValue(new Error("should not be called"));
    const result = await fetchRedirectRules(secondFetcher as typeof sanityFetch);
    expect(secondFetcher).not.toHaveBeenCalled();
    expect(result).toEqual(rules);
  });
});

describe("isSafeRelativePath", () => {
  it("aceita caminho relativo simples", () => {
    expect(isSafeRelativePath("/x")).toBe(true);
    expect(isSafeRelativePath("/blog/novo?a=1")).toBe(true);
  });
  it("rejeita protocol-relative", () => {
    expect(isSafeRelativePath("//evil.com")).toBe(false);
  });
  it("rejeita URL absoluta", () => {
    expect(isSafeRelativePath("https://evil.com")).toBe(false);
  });
  it("rejeita backslash após a barra", () => {
    expect(isSafeRelativePath("/\\evil.com")).toBe(false);
  });
});
