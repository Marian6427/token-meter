import { useState, useEffect } from "react";

const PRICING = {
  "claude-opus-4": { input: 15.0, output: 75.0 },
  "claude-sonnet-4": { input: 3.0, output: 15.0 },
  "gpt-4o": { input: 2.5, output: 10.0 },
  default: { input: 3.0, output: 15.0 },
};

const STATUS_COLORS = {
  active: "#22c55e",
  idle: "#94a3b8",
  warning: "#f59e0b",
  critical: "#ef4444",
};

const fmt = (n) => {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return "" + n;
};

const fmtCost = (n) => (n < 0.01 ? "<$0.01" : "$" + n.toFixed(2));

const calcCost = (inp, out, model = "default") => {
  const p = PRICING[model] || PRICING.default;
  return (inp / 1e6) * p.input + (out / 1e6) * p.output;
};

export default function TokenMeter({ apps = [] }) {
  const [collapsed, setCollapsed] = useState(false);

  const totalCost = apps.reduce(
    (s, a) => s + calcCost(a.inputTokens || 0, a.outputTokens || 0, a.model),
    0
  );
  const totalTokens = apps.reduce(
    (s, a) => s + (a.inputTokens || 0) + (a.outputTokens || 0),
    0
  );
  const costColor =
    totalCost > 5 ? "#ef4444" : totalCost > 1 ? "#f59e0b" : "#22c55e";

  return (
    <div
      style={{
        width: collapsed ? 220 : 380,
        background: "rgba(15,15,20,0.95)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 16,
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        fontFamily: "'JetBrains Mono', monospace",
        color: "#e2e8f0",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: costColor,
            }}
          />
          <span style={{ fontSize: 13, fontWeight: 700 }}>TOKEN METER</span>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "none",
            color: "#94a3b8",
            width: 28,
            height: 28,
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          {collapsed ? "\u25b8" : "\u25be"}
        </button>
      </div>

      {/* Summary */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 16px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              color: "#64748b",
              textTransform: "uppercase",
            }}
          >
            Session Cost
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: costColor }}>
            {fmtCost(totalCost)}
          </div>
        </div>
        {!collapsed && (
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 10,
                color: "#64748b",
                textTransform: "uppercase",
              }}
            >
              Tokens
            </div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              {fmt(totalTokens)}
            </div>
          </div>
        )}
      </div>

      {/* App list */}
      {!collapsed && apps.length > 0 && (
        <div style={{ padding: "4px 8px 12px" }}>
          {apps.map((app, i) => {
            const cost = calcCost(
              app.inputTokens || 0,
              app.outputTokens || 0,
              app.model
            );
            const sc = STATUS_COLORS[app.status] || "#94a3b8";
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: 8,
                  borderRadius: 10,
                  borderLeft: `2px solid ${sc}`,
                  marginBottom: 2,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 600 }}>
                      {app.name}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: cost > 2 ? "#ef4444" : "#94a3b8",
                      }}
                    >
                      {fmtCost(cost)}
                    </span>
                  </div>
                  <div
                    style={{ fontSize: 10, color: "#64748b", marginTop: 4 }}
                  >
                    \u2191{fmt(app.inputTokens || 0)} \u2193
                    {fmt(app.outputTokens || 0)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
