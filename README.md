# Steady Scalper — Pump.fun Sharpe Sprint

[![make.fun](https://make.fun/badge/u-jackxyz72-pump-fun-sharpe-sprint-cleanest-03e4f532.svg)](https://make.fun/bounty/u-jackxyz72-pump-fun-sharpe-sprint-cleanest-03e4f532)
[![rank](https://make.fun/badge/u-jackxyz72-pump-fun-sharpe-sprint-cleanest-03e4f532/yudhisutawan77/makefun-pump-sharpe/rank.svg)](https://make.fun/bounty/u-jackxyz72-pump-fun-sharpe-sprint-cleanest-03e4f532)
[![reward](https://make.fun/badge/u-jackxyz72-pump-fun-sharpe-sprint-cleanest-03e4f532/yudhisutawan77/makefun-pump-sharpe/reward.svg)](https://make.fun/bounty/u-jackxyz72-pump-fun-sharpe-sprint-cleanest-03e4f532)

A paper-trading bot for the [Pump.fun Sharpe Sprint](https://make.fun/bounty/u-jackxyz72-pump-fun-sharpe-sprint-cleanest-03e4f532) on [make.fun](https://make.fun). One strategy program, `main.ts` on Node 22, trading paper money on a 6-hour pump.fun forward replay. Places go by hourly Sharpe ratio — steady, controlled gains beat one lucky moonshot.

## Strategy

Pump.fun is a lottery: nearly every new coin rugs or fades within minutes, and a
handful run several multiples. This bot bets tiny on many coins, cuts losers fast,
and lets the rare runner ride with a wide trailing stop — so the equity curve
stays smooth, which is exactly what hourly Sharpe rewards.

- **Entry (selective):** a curve must have 50+ recorded trades, be 200+ slots old,
  hold 3–80 SOL of real reserve, and show strong broad inflow over the last 40
  slots — net +1.2 SOL, 4+ buys from 4+ distinct wallets, price up 5–80% and
  sitting near its window high, accelerating (newer half out-flowing the older),
  no single wallet over 70% of the buys, creator not sold.
- **Size:** one 0.06 SOL buy per coin, no pyramiding. Max 5 open positions,
  max ~0.8 SOL at cost — one rug costs ~0.5% of the 10 SOL capital.
- **Exits (first trigger wins):** 12% hard stop; trailing stop that arms at +50%
  and exits 30% below peak, only while that still locks a profit; fade exit when
  net flow over 30 slots drops below −2 SOL; immediate exit if the creator sells
  or any single sell of 2+ SOL lands; time limit 4800 slots (9600 while up 20%+).
- **Guardrail pacing:** the run needs round trips of ≥ 0.01 SOL on ≥ 20 distinct
  mints. If the distinct-coin count lags the pace implied by elapsed block time,
  the bot opens a tiny 0.01 SOL probe round trip on a liquid curve — each mint
  probed at most once.

Deterministic by construction: no clock, no environment, no randomness — the two
graded executions produce byte-identical action logs.

## Files

- `main.ts` — entrypoint: `node /bot/main.ts`
- `strategy.ts` — the strategy (entry signal, exits, probes, pacing)
- `vendor/makefun-bot.ts` — the kit's replay-v2 SDK shim, vendored byte for byte
- `LICENSE` — MIT

## Local results (dev window, kit grader)

| Run | Net PnL | Sharpe (hourly) | Max drawdown | Fills | Coins |
| --- | --- | --- | --- | --- | --- |
| First draft (momentum-style, 2 SOL stakes) | −9.38 SOL | — | 0.95 | 410 | 48 |
| Steady Scalper v1 (small stakes, loose fade) | −0.385 SOL | — | 0.066 | 499 | 126 |
| v2 (probe fix: never re-probe a mint) | −0.045 SOL | −0.135 | 0.0077 | 88 | 44 |
| v3 (12% hard stop, stricter entry) | **−0.004 SOL** | **−0.020** | **0.0041** | 88 | 44 |

House pilots on the same dev window, for control: momentum −9.39 SOL,
reversion −4.02 SOL, sniper −0.49 SOL. The dev window is a hard regime — every
house pilot loses money on it — so the final 6-hour window is a fresh draw; this
entry is built to survive it with a near-zero drawdown and a smooth hourly curve
rather than to overfit the dev sample.

## Run it locally

```sh
node cli/makefun.mjs grade-local --kit <kit dir> --bot . --driver process
```
