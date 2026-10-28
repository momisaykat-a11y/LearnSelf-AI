import React, { useState } from "react";
import { GradeLevel, Language } from "../types";
import {
  Sun,
  Droplets,
  Zap,
  Cpu,
  Atom,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  Sliders,
} from "lucide-react";

interface ScienceLabProps {
  grade: GradeLevel;
  language: Language;
}

export const ScienceLab: React.FC<ScienceLabProps> = ({ grade, language }) => {
  const [activeSandbox, setActiveSandbox] = useState<"photosynthesis" | "ohms_law" | "atom" | "motherboard">("photosynthesis");

  // 1. Photosynthesis state
  const [sunlight, setSunlight] = useState(70);
  const [water, setWater] = useState(80);
  const [co2, setCo2] = useState(60);

  // Photosynthesis calculation: Limiting factor rate
  const glucoseRate = Math.round((Math.min(sunlight, water, co2) / 100) * 45);
  const oxygenRate = Math.round(glucoseRate * 1.2);

  // 2. Ohm's law state
  const [voltage, setVoltage] = useState(12); // Volts
  const [resistance, setResistance] = useState(6); // Ohms

  const current = (voltage / resistance).toFixed(2); // Amperes
  const power = (voltage * Number(current)).toFixed(1); // Watts

  // 3. Atom Builder state
  const [selectedElement, setSelectedElement] = useState<"H" | "C" | "O" | "Na">("O");
  const elementsData = {
    H: { name: "Hydrogen", symbol: "H", protons: 1, neutrons: 0, electrons: 1, kShell: 1, lShell: 0 },
    C: { name: "Carbon", symbol: "C", protons: 6, neutrons: 6, electrons: 6, kShell: 2, lShell: 4 },
    O: { name: "Oxygen", symbol: "O", protons: 8, neutrons: 8, electrons: 8, kShell: 2, lShell: 6 },
    Na: { name: "Sodium", symbol: "Na", protons: 11, neutrons: 12, electrons: 11, kShell: 2, lShell: 8, mShell: 1 },
  };

  // 4. Motherboard inspector state
  const [selectedPart, setSelectedPart] = useState<string>("cpu");

  const motherboardParts: Record<string, { title: string; desc: string; role: string; speed: string }> = {
    cpu: {
      title: "Central Processing Unit (CPU)",
      desc: "The primary 'brain' of the computer that performs mathematical, logical, and control calculations.",
      role: "Executes code instructions millions of times per second.",
      speed: "3.5 GHz - 5.0 GHz (Billions of clock cycles/sec)",
    },
    ram: {
      title: "Random Access Memory (RAM Slots)",
      desc: "High-speed temporary volatile memory used to hold active running apps and open tabs.",
      role: "Erased when computer is turned off. Fast access speed.",
      speed: "3200 MHz - 6000 MHz (DDR4 / DDR5)",
    },
    gpu: {
      title: "PCIe x16 Expansion Slot (Graphics Card / GPU)",
      desc: "Slot for dedicated Graphics Card responsible for 3D graphics, gaming, and video rendering.",
      role: "Processes complex spatial visual coordinates & shaders.",
      speed: "16 lanes @ 32 GB/s bandwidth",
    },
    storage: {
      title: "M.2 NVMe SSD / SATA Storage Connectors",
      desc: "Permanent non-volatile storage where the Operating System (Windows/Linux), files, and games are saved.",
      role: "Retains data even when powered off.",
      speed: "3500 MB/s - 7000 MB/s read speed",
    },
    power: {
      title: "24-Pin ATX Main Power Connector",
      desc: "Delivers regulated +12V, +5V, and +3.3V DC electrical power from Power Supply Unit (PSU) to motherboard.",
      role: "Energizes CPU VRMs, chipsets, and PCIe channels.",
      speed: "Continuous direct current delivery",
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Sandbox Selector Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
            {language === "Bengali" ? "ইন্টারেক্টিভ বিজ্ঞান ও তথ্যপ্রযুক্তি ল্যাব" : "Interactive STEM & Science Sandboxes"}
          </span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {language === "Bengali" ? "হাতে কলমে বিজ্ঞান ও প্রযুক্তি শেখা" : "Hands-On Visual Physics, Biology & CS Models"}
          </h2>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveSandbox("photosynthesis")}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeSandbox === "photosynthesis"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>Photosynthesis & Xylem</span>
          </button>

          <button
            onClick={() => setActiveSandbox("ohms_law")}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeSandbox === "ohms_law"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Ohm's Law (V=I*R)</span>
          </button>

          <button
            onClick={() => setActiveSandbox("atom")}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeSandbox === "atom"
                ? "bg-sky-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            <Atom className="w-4 h-4" />
            <span>Atom Structure</span>
          </button>

          <button
            onClick={() => setActiveSandbox("motherboard")}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeSandbox === "motherboard"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Hardware Motherboard</span>
          </button>
        </div>
      </div>

      {/* 1. Photosynthesis Sandbox */}
      {activeSandbox === "photosynthesis" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Interactive Stage */}
          <div className="lg:col-span-2 bg-gradient-to-b from-sky-100 via-emerald-50 to-emerald-100 dark:from-slate-900 dark:via-emerald-950/40 dark:to-slate-900 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-900 shadow-sm flex flex-col justify-between min-h-[380px] relative overflow-hidden">
            {/* Sun Rays Visual */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Sun
                  className="w-12 h-12 text-amber-500 animate-spin"
                  style={{ animationDuration: `${Math.max(20 - sunlight / 5, 4)}s` }}
                />
                <div>
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                    Sunlight Radiation
                  </span>
                  <div className="text-sm font-extrabold text-amber-600">{sunlight}% Intensity</div>
                </div>
              </div>

              {/* Gas Bubbles Indicator */}
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Oxygen (O2) Released: {oxygenRate} mL/min</span>
              </div>
            </div>

            {/* Plant Cell & Vascular Diagram representation */}
            <div className="my-6 flex items-center justify-center relative">
              <div className="w-48 h-48 rounded-full border-4 border-dashed border-emerald-500/40 flex items-center justify-center p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur text-center relative shadow-inner">
                {/* Chloroplast particle simulation */}
                <div className="absolute inset-2 rounded-full border border-emerald-400/30 flex items-center justify-center">
                  <div className="w-28 h-28 rounded-full bg-emerald-500/10 flex flex-col items-center justify-center p-2">
                    <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-200">
                      Chloroplast Leaf Cell
                    </span>
                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                      6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roots & Xylem Water uptake */}
            <div className="flex items-center justify-between z-10 pt-3 border-t border-emerald-200/60 dark:border-emerald-900/60 text-xs">
              <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-semibold">
                <Droplets className="w-4 h-4 text-blue-500 animate-bounce" />
                <span>Xylem Vessels: Water Uptake ({water}%)</span>
              </div>
              <div className="font-bold text-emerald-800 dark:text-emerald-200">
                Glucose Output: <span className="text-sm text-emerald-600">{glucoseRate} mg/sec</span>
              </div>
            </div>
          </div>

          {/* Right Col: Parameters & Concept Deck */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <span>Environmental Controls</span>
              </h3>

              <div className="space-y-4">
                {/* Sunlight Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Sunlight Level</span>
                    <span>{sunlight}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={sunlight}
                    onChange={(e) => setSunlight(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                {/* Water Supply Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Soil Water (H₂O)</span>
                    <span>{water}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={water}
                    onChange={(e) => setWater(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>

                {/* CO2 Concentration Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Air Carbon Dioxide (CO₂)</span>
                    <span>{co2}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={co2}
                    onChange={(e) => setCo2(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Concept Takeaway Box */}
            <div className="mt-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
              <span className="font-bold block mb-1">💡 Key Science Concept:</span>
              <span>
                Photosynthesis rate is determined by the <strong>limiting factor</strong> (the lowest reactant level). Increase water, sunlight, and CO2 together to maximize glucose production!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Ohm's Law Electrical Circuit Sandbox */}
      {activeSandbox === "ohms_law" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Stage */}
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm flex flex-col justify-between min-h-[380px] text-white relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-bold text-amber-400">Ohm's Law: V = I × R</span>
              </div>
              <div className="text-xs font-mono text-slate-400">
                Formula: <span className="text-white font-bold">I = V / R</span>
              </div>
            </div>

            {/* Circuit Diagram Visual */}
            <div className="my-6 p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center relative">
              {/* Wire Loop Box */}
              <div className="w-full max-w-md h-40 border-4 border-amber-500/60 rounded-xl relative flex items-center justify-between px-8">
                {/* Battery Source */}
                <div className="bg-slate-900 border-2 border-amber-400 px-3 py-2 rounded-lg text-center z-10 shadow-lg">
                  <div className="text-[10px] text-amber-400 font-bold uppercase">Battery (V)</div>
                  <div className="text-base font-mono font-extrabold text-white">{voltage} Volts</div>
                </div>

                {/* Resistor Component */}
                <div className="bg-slate-900 border-2 border-rose-400 px-3 py-2 rounded-lg text-center z-10 shadow-lg">
                  <div className="text-[10px] text-rose-400 font-bold uppercase">Resistor (R)</div>
                  <div className="text-base font-mono font-extrabold text-white">{resistance} Ω</div>
                </div>

                {/* Glowing Lightbulb brightness based on Power */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      backgroundColor: `rgba(245, 158, 11, ${Math.min(Number(current) / 3, 1)})`,
                      boxShadow: `0 0 ${Math.min(Number(power) * 2, 60)}px rgba(245, 158, 11, 0.8)`,
                    }}
                  >
                    <Zap className="w-8 h-8 text-slate-900 font-extrabold" />
                  </div>
                  <span className="text-[10px] font-mono text-amber-300 font-bold mt-1">
                    Bulb Power: {power} W
                  </span>
                </div>
              </div>
            </div>

            {/* Digital Ammeter Output */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs font-mono">
              <span className="text-slate-400">Ammeter Reading (Current):</span>
              <span className="text-lg font-extrabold text-amber-400">{current} Amperes (A)</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                Circuit Sliders
              </h3>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Voltage (V)</span>
                    <span>{voltage} V</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="24"
                    value={voltage}
                    onChange={(e) => setVoltage(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Resistance (R)</span>
                    <span>{resistance} Ω</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={resistance}
                    onChange={(e) => setResistance(Number(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
              <span className="font-bold block mb-1">⚡ Ohm's Rule:</span>
              <span>
                Higher Voltage pushes <strong>more current</strong>. Higher Resistance slows down current flow. If you double the resistance, the current drops by half!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Atom Structure Builder Sandbox */}
      {activeSandbox === "atom" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-950 rounded-2xl p-6 border border-slate-800 shadow-sm flex flex-col items-center justify-center min-h-[380px] text-white relative">
            {/* Element Selector */}
            <div className="absolute top-4 left-4 flex gap-2">
              {(["H", "C", "O", "Na"] as const).map((elem) => (
                <button
                  key={elem}
                  onClick={() => setSelectedElement(elem)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedElement === elem
                      ? "bg-sky-500 text-slate-950 font-extrabold"
                      : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {elem}
                </button>
              ))}
            </div>

            {/* Atomic Model Canvas */}
            <div className="w-64 h-64 rounded-full border-2 border-sky-500/30 flex items-center justify-center relative my-4">
              <div className="w-40 h-40 rounded-full border-2 border-sky-400/40 flex items-center justify-center relative animate-spin" style={{ animationDuration: '12s' }}>
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-indigo-600 flex flex-col items-center justify-center text-center shadow-lg shadow-rose-500/30">
                  <span className="text-xs font-extrabold text-white">Nucleus</span>
                  <span className="text-[10px] text-rose-200">
                    {elementsData[selectedElement].protons}P | {elementsData[selectedElement].neutrons}N
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-extrabold text-sky-400">
                {elementsData[selectedElement].name} ({elementsData[selectedElement].symbol})
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Atomic Number Z = {elementsData[selectedElement].protons} | Shells: K({elementsData[selectedElement].kShell}), L({elementsData[selectedElement].lShell})
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                Subatomic Particles Breakdown
              </h4>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex justify-between">
                  <span className="font-bold text-rose-800 dark:text-rose-300">Protons (+ charge):</span>
                  <span className="font-mono font-bold text-rose-600">{elementsData[selectedElement].protons}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex justify-between">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Neutrons (0 charge):</span>
                  <span className="font-mono font-bold text-slate-600">{elementsData[selectedElement].neutrons}</span>
                </div>

                <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 flex justify-between">
                  <span className="font-bold text-sky-800 dark:text-sky-300">Electrons (- charge):</span>
                  <span className="font-mono font-bold text-sky-600">{elementsData[selectedElement].electrons}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 text-xs text-sky-900 dark:text-sky-200 leading-relaxed">
              <span className="font-bold block mb-1">⚛️ Atom Stability:</span>
              In a neutral atom, number of positive Protons equals number of negative Electrons!
            </div>
          </div>
        </div>
      )}

      {/* 4. Computer Motherboard Hardware Inspector Sandbox */}
      {activeSandbox === "motherboard" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm flex flex-col justify-between min-h-[380px] text-white">
            <h3 className="text-sm font-bold text-purple-400 mb-2">
              Motherboard Component Interactive Inspector
            </h3>

            {/* Motherboard Layout Map */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
              {Object.keys(motherboardParts).map((partKey) => {
                const part = motherboardParts[partKey];
                const isSelected = selectedPart === partKey;
                return (
                  <button
                    key={partKey}
                    onClick={() => setSelectedPart(partKey)}
                    className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? "bg-purple-900/60 border-purple-500 ring-2 ring-purple-500/30 text-white"
                        : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <Cpu className="w-5 h-5 text-purple-400 mb-2" />
                    <span className="text-xs font-bold leading-tight">{part.title.split("(")[0]}</span>
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-slate-400">
              Click any motherboard header above to examine how computer components talk to each other!
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            {selectedPart && motherboardParts[selectedPart] && (
              <div>
                <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider block mb-1">
                  Hardware Component Spotlight
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {motherboardParts[selectedPart].title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                  {motherboardParts[selectedPart].desc}
                </p>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900">
                    <span className="font-bold text-purple-900 dark:text-purple-300 block mb-0.5">
                      Role in System:
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">{motherboardParts[selectedPart].role}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                      Transfer Speed:
                    </span>
                    <span className="font-mono font-semibold text-purple-600 dark:text-purple-400">
                      {motherboardParts[selectedPart].speed}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
