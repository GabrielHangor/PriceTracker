import { calculateChange } from "@/scrapping/updatePriceChanges.js";
import { Decimal } from "@prisma/client/runtime/library";
import { describe, it, expect } from "vitest";

describe("calculateChange", () => {
  it("should handle a price history with stable prices", () => {
    const priceHistory = [
      { date: new Date("2023-01-01"), price: new Decimal(100) },
      { date: new Date("2023-01-02"), price: new Decimal(100) },
      { date: new Date("2023-01-03"), price: new Decimal(100) },
      { date: new Date("2023-01-04"), price: new Decimal(100) },
      { date: new Date("2023-01-05"), price: new Decimal(100) },
      { date: new Date("2023-01-06"), price: new Decimal(100) },
      { date: new Date("2023-01-07"), price: new Decimal(100) },
      { date: new Date("2023-01-08"), price: new Decimal(100) },
      { date: new Date("2023-01-09"), price: new Decimal(100) },
      { date: new Date("2023-01-10"), price: new Decimal(100) },
    ];
    const result = calculateChange(priceHistory, new Date("2023-01-01"));
    expect(result).toEqual({ previousPrice: 100, currentPrice: 100, deltaPercent: 0 });
  });

  it("should handle a price history with increasing prices", () => {
    const priceHistory = [
      { date: new Date("2023-01-01"), price: new Decimal(100) },
      { date: new Date("2023-01-02"), price: new Decimal(110) },
      { date: new Date("2023-01-03"), price: new Decimal(120) },
      { date: new Date("2023-01-04"), price: new Decimal(130) },
      { date: new Date("2023-01-05"), price: new Decimal(140) },
      { date: new Date("2023-01-06"), price: new Decimal(150) },
      { date: new Date("2023-01-07"), price: new Decimal(160) },
      { date: new Date("2023-01-08"), price: new Decimal(170) },
      { date: new Date("2023-01-09"), price: new Decimal(180) },
      { date: new Date("2023-01-10"), price: new Decimal(190) },
    ];
    const result = calculateChange(priceHistory, new Date("2023-01-01"));
    expect(result).toEqual({ previousPrice: 100, currentPrice: 190, deltaPercent: 90 });
  });

  it("should handle a price history with decreasing prices", () => {
    const priceHistory = [
      { date: new Date("2023-01-01"), price: new Decimal(190) },
      { date: new Date("2023-01-02"), price: new Decimal(180) },
      { date: new Date("2023-01-03"), price: new Decimal(170) },
      { date: new Date("2023-01-04"), price: new Decimal(160) },
      { date: new Date("2023-01-05"), price: new Decimal(150) },
      { date: new Date("2023-01-06"), price: new Decimal(140) },
      { date: new Date("2023-01-07"), price: new Decimal(130) },
      { date: new Date("2023-01-08"), price: new Decimal(120) },
      { date: new Date("2023-01-09"), price: new Decimal(110) },
      { date: new Date("2023-01-10"), price: new Decimal(100) },
    ];
    const result = calculateChange(priceHistory, new Date("2023-01-01"));
    expect(result).toEqual({ previousPrice: 190, currentPrice: 100, deltaPercent: -47.37 });
  });

  it("should handle a price history with random prices", () => {
    const priceHistory = [
      { date: new Date("2023-01-01"), price: new Decimal(100) },
      { date: new Date("2023-01-02"), price: new Decimal(150) },
      { date: new Date("2023-01-03"), price: new Decimal(120) },
      { date: new Date("2023-01-04"), price: new Decimal(130) },
      { date: new Date("2023-01-05"), price: new Decimal(110) },
      { date: new Date("2023-01-06"), price: new Decimal(140) },
      { date: new Date("2023-01-07"), price: new Decimal(160) },
      { date: new Date("2023-01-08"), price: new Decimal(170) },
      { date: new Date("2023-01-09"), price: new Decimal(180) },
      { date: new Date("2023-01-10"), price: new Decimal(190) },
    ];
    const result = calculateChange(priceHistory, new Date("2023-01-01"));
    expect(result).toEqual({ previousPrice: 100, currentPrice: 190, deltaPercent: 90 });
  });

  it("should handle a price history with mixed prices and a different since date", () => {
    const priceHistory = [
      { date: new Date("2023-01-01"), price: new Decimal(100) },
      { date: new Date("2023-01-02"), price: new Decimal(150) },
      { date: new Date("2023-01-03"), price: new Decimal(200) },
      { date: new Date("2023-01-04"), price: new Decimal(250) },
      { date: new Date("2023-01-05"), price: new Decimal(300) },
      { date: new Date("2023-01-06"), price: new Decimal(350) },
      { date: new Date("2023-01-07"), price: new Decimal(400) },
      { date: new Date("2023-01-08"), price: new Decimal(450) },
      { date: new Date("2023-01-09"), price: new Decimal(500) },
      { date: new Date("2023-01-10"), price: new Decimal(550) },
    ];
    const result = calculateChange(priceHistory, new Date("2023-01-05"));
    expect(result).toEqual({ previousPrice: 300, currentPrice: 550, deltaPercent: 83.33 });
  });

  it("should handle a price history with all prices being zero", () => {
    const priceHistory = [
      { date: new Date("2023-01-01"), price: new Decimal(0) },
      { date: new Date("2023-01-02"), price: new Decimal(0) },
      { date: new Date("2023-01-03"), price: new Decimal(0) },
      { date: new Date("2023-01-04"), price: new Decimal(0) },
      { date: new Date("2023-01-05"), price: new Decimal(0) },
      { date: new Date("2023-01-06"), price: new Decimal(0) },
      { date: new Date("2023-01-07"), price: new Decimal(0) },
      { date: new Date("2023-01-08"), price: new Decimal(0) },
      { date: new Date("2023-01-09"), price: new Decimal(0) },
      { date: new Date("2023-01-10"), price: new Decimal(0) },
    ];
    const result = calculateChange(priceHistory, new Date("2023-01-01"));
    expect(result).toEqual({ previousPrice: 0, currentPrice: 0, deltaPercent: 0 });
  });

  it("should handle a price history with significant price drops", () => {
    const priceHistory = [
      { date: new Date("2023-01-01"), price: new Decimal(1000) },
      { date: new Date("2023-01-02"), price: new Decimal(900) },
      { date: new Date("2023-01-03"), price: new Decimal(800) },
      { date: new Date("2023-01-04"), price: new Decimal(700) },
      { date: new Date("2023-01-05"), price: new Decimal(600) },
      { date: new Date("2023-01-06"), price: new Decimal(500) },
      { date: new Date("2023-01-07"), price: new Decimal(400) },
      { date: new Date("2023-01-08"), price: new Decimal(300) },
      { date: new Date("2023-01-09"), price: new Decimal(200) },
      { date: new Date("2023-01-10"), price: new Decimal(100) },
    ];
    const result = calculateChange(priceHistory, new Date("2023-01-01"));
    expect(result).toEqual({ previousPrice: 1000, currentPrice: 100, deltaPercent: -90 });
  });

  it("should handle a price history with significant price increases", () => {
    const priceHistory = [
      { date: new Date("2023-01-01"), price: new Decimal(100) },
      { date: new Date("2023-01-02"), price: new Decimal(200) },
      { date: new Date("2023-01-03"), price: new Decimal(300) },
      { date: new Date("2023-01-04"), price: new Decimal(400) },
      { date: new Date("2023-01-05"), price: new Decimal(500) },
      { date: new Date("2023-01-06"), price: new Decimal(600) },
      { date: new Date("2023-01-07"), price: new Decimal(700) },
      { date: new Date("2023-01-08"), price: new Decimal(800) },
      { date: new Date("2023-01-09"), price: new Decimal(900) },
      { date: new Date("2023-01-10"), price: new Decimal(1000) },
    ];
    const result = calculateChange(priceHistory, new Date("2023-01-01"));
    expect(result).toEqual({ previousPrice: 100, currentPrice: 1000, deltaPercent: 900 });
  });

  it("should handle a price history with prices fluctuating up and down", () => {
    const priceHistory = [
      { date: new Date("2023-01-01"), price: new Decimal(100) },
      { date: new Date("2023-01-02"), price: new Decimal(150) },
      { date: new Date("2023-01-03"), price: new Decimal(120) },
      { date: new Date("2023-01-04"), price: new Decimal(170) },
      { date: new Date("2023-01-05"), price: new Decimal(110) },
      { date: new Date("2023-01-06"), price: new Decimal(160) },
      { date: new Date("2023-01-07"), price: new Decimal(130) },
      { date: new Date("2023-01-08"), price: new Decimal(180) },
      { date: new Date("2023-01-09"), price: new Decimal(140) },
      { date: new Date("2023-01-10"), price: new Decimal(190) },
    ];
    const result = calculateChange(priceHistory, new Date("2023-01-01"));
    expect(result).toEqual({ previousPrice: 100, currentPrice: 190, deltaPercent: 90 });
  });

  it("should handle a price history with prices fluctuating and a different since date", () => {
    const priceHistory = [
      { date: new Date("2023-01-01"), price: new Decimal(100) },
      { date: new Date("2023-01-02"), price: new Decimal(150) },
      { date: new Date("2023-01-03"), price: new Decimal(120) },
      { date: new Date("2023-01-04"), price: new Decimal(170) },
      { date: new Date("2023-01-05"), price: new Decimal(110) },
      { date: new Date("2023-01-06"), price: new Decimal(160) },
      { date: new Date("2023-01-07"), price: new Decimal(130) },
      { date: new Date("2023-01-08"), price: new Decimal(180) },
      { date: new Date("2023-01-09"), price: new Decimal(140) },
      { date: new Date("2023-01-10"), price: new Decimal(190) },
    ];
    const result = calculateChange(priceHistory, new Date("2023-01-05"));
    expect(result).toEqual({ previousPrice: 110, currentPrice: 190, deltaPercent: 72.73 });
  });

  it("should handle a price history with stable floating-point prices", () => {
    const priceHistory = [
      { date: new Date("2023-01-01"), price: new Decimal(100.5) },
      { date: new Date("2023-01-02"), price: new Decimal(100.5) },
      { date: new Date("2023-01-03"), price: new Decimal(100.5) },
      { date: new Date("2023-01-04"), price: new Decimal(100.5) },
      { date: new Date("2023-01-05"), price: new Decimal(100.5) },
      { date: new Date("2023-01-06"), price: new Decimal(100.5) },
      { date: new Date("2023-01-07"), price: new Decimal(100.5) },
      { date: new Date("2023-01-08"), price: new Decimal(100.5) },
      { date: new Date("2023-01-09"), price: new Decimal(100.5) },
      { date: new Date("2023-01-10"), price: new Decimal(100.5) },
    ];
    const result = calculateChange(priceHistory, new Date("2023-01-01"));
    expect(result).toEqual({ previousPrice: 100.5, currentPrice: 100.5, deltaPercent: 0 });
  });

  it("should handle a price history with increasing floating-point prices", () => {
    const priceHistory = [
      { date: new Date("2023-01-01"), price: new Decimal(100.5) },
      { date: new Date("2023-01-02"), price: new Decimal(110.75) },
      { date: new Date("2023-01-03"), price: new Decimal(120.25) },
      { date: new Date("2023-01-04"), price: new Decimal(130.5) },
      { date: new Date("2023-01-05"), price: new Decimal(140.75) },
      { date: new Date("2023-01-06"), price: new Decimal(150.5) },
      { date: new Date("2023-01-07"), price: new Decimal(160.25) },
      { date: new Date("2023-01-08"), price: new Decimal(170.75) },
      { date: new Date("2023-01-09"), price: new Decimal(180.5) },
      { date: new Date("2023-01-10"), price: new Decimal(190.25) },
    ];
    const result = calculateChange(priceHistory, new Date("2023-01-01"));
    expect(result).toEqual({ previousPrice: 100.5, currentPrice: 190.25, deltaPercent: 89.3 });
  });

  it("should handle a price history with decreasing floating-point prices", () => {
    const priceHistory = [
      { date: new Date("2023-01-01"), price: new Decimal(190.25) },
      { date: new Date("2023-01-02"), price: new Decimal(180.5) },
      { date: new Date("2023-01-03"), price: new Decimal(170.75) },
      { date: new Date("2023-01-04"), price: new Decimal(160.25) },
      { date: new Date("2023-01-05"), price: new Decimal(150.5) },
      { date: new Date("2023-01-06"), price: new Decimal(140.75) },
      { date: new Date("2023-01-07"), price: new Decimal(130.5) },
      { date: new Date("2023-01-08"), price: new Decimal(120.25) },
      { date: new Date("2023-01-09"), price: new Decimal(110.75) },
      { date: new Date("2023-01-10"), price: new Decimal(100.5) },
    ];
    const result = calculateChange(priceHistory, new Date("2023-01-01"));
    expect(result).toEqual({ previousPrice: 190.25, currentPrice: 100.5, deltaPercent: -47.17 });
  });

  it("should handle a price history with random floating-point prices", () => {
    const priceHistory = [
      { date: new Date("2023-01-01"), price: new Decimal(100.5) },
      { date: new Date("2023-01-02"), price: new Decimal(150.75) },
      { date: new Date("2023-01-03"), price: new Decimal(120.25) },
      { date: new Date("2023-01-04"), price: new Decimal(130.5) },
      { date: new Date("2023-01-05"), price: new Decimal(110.75) },
      { date: new Date("2023-01-06"), price: new Decimal(140.25) },
      { date: new Date("2023-01-07"), price: new Decimal(160.5) },
      { date: new Date("2023-01-08"), price: new Decimal(170.75) },
      { date: new Date("2023-01-09"), price: new Decimal(180.5) },
      { date: new Date("2023-01-10"), price: new Decimal(190.25) },
    ];
    const result = calculateChange(priceHistory, new Date("2023-01-01"));
    expect(result).toEqual({ previousPrice: 100.5, currentPrice: 190.25, deltaPercent: 89.3 });
  });

  it("should handle a price history with mixed floating-point prices and a different since date", () => {
    const priceHistory = [
      { date: new Date("2023-01-01"), price: new Decimal(100.5) },
      { date: new Date("2023-01-02"), price: new Decimal(150.75) },
      { date: new Date("2023-01-03"), price: new Decimal(200.25) },
      { date: new Date("2023-01-04"), price: new Decimal(250.5) },
      { date: new Date("2023-01-05"), price: new Decimal(300.75) },
      { date: new Date("2023-01-06"), price: new Decimal(350.25) },
      { date: new Date("2023-01-07"), price: new Decimal(400.5) },
      { date: new Date("2023-01-08"), price: new Decimal(450.75) },
      { date: new Date("2023-01-09"), price: new Decimal(500.5) },
      { date: new Date("2023-01-10"), price: new Decimal(550.25) },
    ];
    const result = calculateChange(priceHistory, new Date("2023-01-05"));
    expect(result).toEqual({ previousPrice: 300.75, currentPrice: 550.25, deltaPercent: 82.96 });
  });

  it("should handle a price history with significant floating-point price drops", () => {
    const priceHistory = [
      { date: new Date("2023-01-01"), price: new Decimal(1000.5) },
      { date: new Date("2023-01-02"), price: new Decimal(900.75) },
      { date: new Date("2023-01-03"), price: new Decimal(800.25) },
      { date: new Date("2023-01-04"), price: new Decimal(700.5) },
      { date: new Date("2023-01-05"), price: new Decimal(600.75) },
      { date: new Date("2023-01-06"), price: new Decimal(500.25) },
      { date: new Date("2023-01-07"), price: new Decimal(400.5) },
      { date: new Date("2023-01-08"), price: new Decimal(300.75) },
      { date: new Date("2023-01-09"), price: new Decimal(200.25) },
      { date: new Date("2023-01-10"), price: new Decimal(100.5) },
    ];
    const result = calculateChange(priceHistory, new Date("2023-01-01"));
    expect(result).toEqual({ previousPrice: 1000.5, currentPrice: 100.5, deltaPercent: -89.96 });
  });

  it("should handle a price history with significant floating-point price increases", () => {
    const priceHistory = [
      { date: new Date("2023-01-01"), price: new Decimal(100.5) },
      { date: new Date("2023-01-02"), price: new Decimal(200.75) },
      { date: new Date("2023-01-03"), price: new Decimal(300.25) },
      { date: new Date("2023-01-04"), price: new Decimal(400.5) },
      { date: new Date("2023-01-05"), price: new Decimal(500.75) },
      { date: new Date("2023-01-06"), price: new Decimal(600.25) },
      { date: new Date("2023-01-07"), price: new Decimal(700.5) },
      { date: new Date("2023-01-08"), price: new Decimal(800.75) },
      { date: new Date("2023-01-09"), price: new Decimal(900.5) },
      { date: new Date("2023-01-10"), price: new Decimal(1000.25) },
    ];
    const result = calculateChange(priceHistory, new Date("2023-01-01"));
    expect(result).toEqual({ previousPrice: 100.5, currentPrice: 1000.25, deltaPercent: 895.27 });
  });

  it("should handle a price history with floating-point prices fluctuating up and down", () => {
    const priceHistory = [
      { date: new Date("2023-01-01"), price: new Decimal(100.5) },
      { date: new Date("2023-01-02"), price: new Decimal(150.75) },
      { date: new Date("2023-01-03"), price: new Decimal(120.25) },
      { date: new Date("2023-01-04"), price: new Decimal(170.5) },
      { date: new Date("2023-01-05"), price: new Decimal(110.75) },
      { date: new Date("2023-01-06"), price: new Decimal(160.25) },
      { date: new Date("2023-01-07"), price: new Decimal(130.5) },
      { date: new Date("2023-01-08"), price: new Decimal(180.75) },
      { date: new Date("2023-01-09"), price: new Decimal(140.5) },
      { date: new Date("2023-01-10"), price: new Decimal(190.25) },
    ];
    const result = calculateChange(priceHistory, new Date("2023-01-01"));
    expect(result).toEqual({ previousPrice: 100.5, currentPrice: 190.25, deltaPercent: 89.3 });
  });

  it("should handle a price history with floating-point prices fluctuating and a different since date", () => {
    const priceHistory = [
      { date: new Date("2023-01-01"), price: new Decimal(100.5) },
      { date: new Date("2023-01-02"), price: new Decimal(150.75) },
      { date: new Date("2023-01-03"), price: new Decimal(120.25) },
      { date: new Date("2023-01-04"), price: new Decimal(170.5) },
      { date: new Date("2023-01-05"), price: new Decimal(110.75) },
      { date: new Date("2023-01-06"), price: new Decimal(160.25) },
      { date: new Date("2023-01-07"), price: new Decimal(130.5) },
      { date: new Date("2023-01-08"), price: new Decimal(180.75) },
      { date: new Date("2023-01-09"), price: new Decimal(140.5) },
      { date: new Date("2023-01-10"), price: new Decimal(190.25) },
    ];
    const result = calculateChange(priceHistory, new Date("2023-01-05"));
    expect(result).toEqual({ previousPrice: 110.75, currentPrice: 190.25, deltaPercent: 71.78 });
  });
});
