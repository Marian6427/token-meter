# 🔥 Token Meter

**Task manager for your AI spend.** A floating widget that shows real-time token consumption per third-party app in AI chat interfaces — and actively controls model routing based on your budget.

## What it does

- Shows which app/model is burning how many tokens — right now
- Estimates session cost and monthly projection
- **Actively routes queries to the cheapest capable model based on remaining budget**
- Warns you when a model gets downgraded due to budget limits

## Why

You pay $200/month. An agent silently burns $30 per task. You don't know until it's too late.

**You can't optimize what you can't measure. And you can't regulate what you can't see.**

## Smart Router + Token Meter

Unlike existing LLM cost tools (LiteLLM, Langfuse, Bifrost) which are **backend tools for developers**, Token Meter is a **user-facing widget that both displays AND controls routing** in real-time.

```
User sends message
       ↓
Smart Router classifies query complexity
       ↓
Token Meter checks remaining budget
       ↓
Budget allows Tier 3? → Grok ($0.05/req)
Budget allows Tier 2? → Claude Haiku ($0.001/req)
Budget allows Tier 1? → Cascade 2 (free, local)
Budget exhausted?     → DeepSeek R1 (free, local)
       ↓
Model responds → Token Meter records cost → Budget updates
       ↓
Frontend shows: cost, model, budget bar, downgrade warning
```

### Routing Hierarchy

| Tier | Model | Cost | Triggers |
|------|-------|------|----------|
| 0 | CoinGecko API | $0 | Crypto prices (no LLM needed) |
| 0 | DeepSeek R1 8B | $0 | Greetings, simple questions |
| 1 | Nemotron Cascade 2 | $0 | Tool calling, system tasks |
| 2 | Claude Haiku 4.5 | ~$0.001 | Medium complexity, translation |
| 3 | Grok | ~$0.05 | Trading analysis, vision, complex reasoning |

### Budget-Aware Downgrade

When daily budget runs low, the router automatically downgrades:

- **$5.00+ remaining** → All models available
- **$2.00-$5.00** → Up to Haiku (no Grok)
- **$0.50-$2.00** → Up to Cascade 2 (local only + Haiku)
- **$0 remaining** → Free models only (DeepSeek, Cascade 2)

User sees a ⚠️ warning: `grok → claude-haiku-4-5 (budget)`

## Architecture

- **Backend**: Python Smart Router (`smart_router.py`) with `TokenMeterSession` class
- **Frontend**: Floating widget in chat with budget bar, model breakdown, downgrade alerts
- **SSE Events**: `__MODEL:`, `__TOKENS:`, `__BUDGET:` sent in real-time stream

## Quick start

```bash
npm install && npm run dev
```

## What makes this different

| Existing tools | Token Meter |
|---|---|
| Backend dashboards for devs | User-facing widget in chat |
| Monitor after the fact | Regulate in real-time |
| Single provider tracking | Multi-model routing + local models |
| Enterprise pricing | Open source, self-hosted |

## Inspired by

- The Claude Code / Open Claw incident (2025-2026)
- Jevons Paradox — efficiency increases consumption
- The missing transparency in AI pricing

## License

MIT

---

*Built because transparency beats outrage. And regulation beats monitoring.*
