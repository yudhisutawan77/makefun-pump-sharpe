// Steady Scalper — entrypoint for the pump.fun Sharpe sprint (agent-fun/replay/v2).
// The grader runs `node /bot/main.ts` with this directory mounted at /bot; the
// strategy lives in strategy.ts and the SDK shim is vendored byte for byte.

import { runBot } from './vendor/makefun-bot.ts';
import { createStrategy, DEFAULT_PARAMS } from './strategy.ts';

const bot = createStrategy(DEFAULT_PARAMS);
await runBot({
  ...bot,
  // Diagnostics go to stderr only: stdout carries the replies, and anything
  // else there would break the wire protocol.
  onDone(state, done) {
    const sol = (n: bigint) => (Number(n) / 1e9).toFixed(4);
    console.error(
      `done: cash ${sol(BigInt(done.account.cash_lamports))} SOL, ` +
        `open positions ${done.account.positions.length}, ` +
        `batches answered ${state.seq + 1}`,
    );
    return bot.onDone?.(state, done);
  },
});
