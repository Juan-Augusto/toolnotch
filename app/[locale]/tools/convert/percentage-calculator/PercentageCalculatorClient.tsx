"use client";

import { useState } from "react";
import AppButton from "@/components/AppButton";

interface Props {
  tabs: Record<string, string>;
  percentOf: Record<string, string>;
  whatPercent: Record<string, string>;
  percentChange: Record<string, string>;
  calculate: string;
  clear: string;
}

type Tab = "percentOf" | "whatPercent" | "percentChange";

export default function PercentageCalculatorClient({
  tabs,
  percentOf,
  whatPercent,
  percentChange,
  calculate,
  clear,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("percentOf");

  // percentOf: what is X% of Y
  const [poPct, setPoPct] = useState("");
  const [poNum, setPoNum] = useState("");
  const [poResult, setPoResult] = useState<string | null>(null);

  // whatPercent: X is what % of Y
  const [wpX, setWpX] = useState("");
  const [wpY, setWpY] = useState("");
  const [wpResult, setWpResult] = useState<string | null>(null);

  // percentChange: from X to Y
  const [pcFrom, setPcFrom] = useState("");
  const [pcTo, setPcTo] = useState("");
  const [pcResult, setPcResult] = useState<string | null>(null);

  function calcPercentOf() {
    const p = parseFloat(poPct),
      n = parseFloat(poNum);
    if (!isNaN(p) && !isNaN(n))
      setPoResult(String(parseFloat(((n * p) / 100).toFixed(10))));
  }

  function calcWhatPercent() {
    const x = parseFloat(wpX),
      y = parseFloat(wpY);
    if (!isNaN(x) && !isNaN(y) && y !== 0)
      setWpResult(parseFloat(((x / y) * 100).toFixed(10)) + "%");
  }

  function calcChange() {
    const from = parseFloat(pcFrom),
      to = parseFloat(pcTo);
    if (!isNaN(from) && !isNaN(to) && from !== 0) {
      const pct = ((to - from) / from) * 100;
      const abs = Math.abs(parseFloat(pct.toFixed(10)));
      const dir = pct >= 0 ? percentChange.increase : percentChange.decrease;
      setPcResult(`${abs}% ${dir}`);
    }
  }

  function clearAll() {
    setPoPct("");
    setPoNum("");
    setPoResult(null);
    setWpX("");
    setWpY("");
    setWpResult(null);
    setPcFrom("");
    setPcTo("");
    setPcResult(null);
  }

  const tabKeys: Tab[] = ["percentOf", "whatPercent", "percentChange"];
  const tabLabels: Record<Tab, string> = {
    percentOf: tabs.percentOf,
    whatPercent: tabs.whatPercent,
    percentChange: tabs.percentChange,
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex gap-1 bg-tertiary rounded-xl p-1 mb-4">
        {tabKeys.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer hover:text-foreground ${
              activeTab === tab ? "bg-tertiary " : "text-label/70"
            }`}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      {activeTab === "percentOf" && (
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">
              {percentOf.label1}
            </span>
            <input
              type="number"
              value={poPct}
              onChange={(e) => setPoPct(e.target.value)}
              placeholder="15"
              className="input w-full"
            />
            <span className="text-sm whitespace-nowrap">
              {percentOf.label2}
            </span>
            <input
              type="number"
              value={poNum}
              onChange={(e) => setPoNum(e.target.value)}
              placeholder="200"
              className="input w-full"
            />
          </div>
          {poResult !== null && (
            <>
              <span className="uppercase text-label/70 font-semibold tracking-wider mb-2 text-xs">
                {percentOf.resultPrefix}
              </span>
              <div className="bg-tertiary p-4 rounded-xl font-bold text-lg">
                {poResult}
              </div>
            </>
          )}
          <div className="flex gap-4">
            <AppButton onClick={calcPercentOf} color="primary">
              {calculate}
            </AppButton>
            <AppButton onClick={clearAll} color="panel" className="flex-0">
              {clear}
            </AppButton>
          </div>
        </div>
      )}

      {activeTab === "whatPercent" && (
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">
              {whatPercent.label1}
            </span>
            <input
              type="number"
              value={wpX}
              onChange={(e) => setWpX(e.target.value)}
              placeholder="30"
              className="input w-full"
            />
            <span className="text-sm whitespace-nowrap">
              {whatPercent.label2}
            </span>
            <input
              type="number"
              value={wpY}
              onChange={(e) => setWpY(e.target.value)}
              placeholder="200"
              className="input w-full"
            />
          </div>
          {wpResult !== null && (
            <>
              <span className="uppercase text-label/70 font-semibold tracking-wider mb-2 text-xs">
                {whatPercent.resultPrefix}
              </span>
              <div className="bg-tertiary p-4 rounded-xl font-bold text-lg">
                {wpResult}
              </div>
            </>
          )}
          <div className="flex gap-4">
            <AppButton onClick={calcWhatPercent} color="primary">
              {calculate}
            </AppButton>
            <AppButton color="panel" className="flex-0" onClick={clearAll}>
              {clear}
            </AppButton>
          </div>
        </div>
      )}

      {activeTab === "percentChange" && (
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">
              {percentChange.label1}
            </span>
            <input
              type="number"
              value={pcFrom}
              onChange={(e) => setPcFrom(e.target.value)}
              placeholder="100"
              className="input w-full"
            />
            <span className="text-sm whitespace-nowrap">
              {percentChange.label2}
            </span>
            <input
              type="number"
              value={pcTo}
              onChange={(e) => setPcTo(e.target.value)}
              placeholder="150"
              className="input w-full"
            />
          </div>
          {pcResult !== null && (
            <>
              <span className="uppercase text-label/70 font-semibold tracking-wider mb-2 text-xs">
                {percentChange.resultPrefix}
              </span>
              <div className="bg-tertiary p-4 rounded-xl font-bold text-lg">
                {pcResult}
              </div>
            </>
          )}
          <div className="flex gap-4">
            <AppButton onClick={calcChange} color="primary">
              {calculate}
            </AppButton>
            <AppButton color="panel" onClick={clearAll} className="flex-0">
              {clear}
            </AppButton>
          </div>
        </div>
      )}
    </div>
  );
}
