 import React, { useState } from 'react';
import { 
  Compass, Settings, ShieldCheck, Heart, 
  X, Sparkles, Monitor, Target, ShieldAlert
} from 'lucide-react';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; 

const App = () => {
  const [val, setVal] = useState("");
  const [mode, setMode] = useState("principal"); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const callAI = async (prompt, sys) => {
    if (!apiKey || apiKey.length < 5) {
      return "DIAGNOSTIC ERROR: API Key missing in Vercel. Ensure VITE_GEMINI_API_KEY is added to Environment Variables and you have REDEPLOYED.";
    }
    setIsProcessing(true);
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: sys + " Plain text only. No markdown." }] }
        }) 
      });
      if (r.status === 403) return "DIAGNOSTIC ERROR: API Key restricted or invalid.";
      const d = await r.json();
      return d.candidates[0].content.parts[0].text;
    } catch (e) { return "ORCHESTRATION FAILED: Check internet connection."; } finally { setIsProcessing(false); }
  };

  const handleAction = async () => {
    let res, sys;
    if (mode === "principal") {
        sys = "Expert strategist for GSS Garki. Optimize institutional resources.";
        res = await callAI(`Challenge: ${val}`, sys);
    } else {
        sys = "Impact auditor using Rotary 4-way test.";
        res = await callAI(`Project: ${val}`, sys);
    }
    setResult(res); setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans">
      <nav className="p-6 border-b border-white/10 bg-black/50 flex justify-between items-center">
        <div className="flex items-center gap-3 uppercase font-black tracking-widest text-sm">
          {mode === "principal" ? <Monitor className="text-yellow-500"/> : <Compass className="text-blue-500"/>}
          {mode === "principal" ? "Leadership Insight" : "Impact Auditor"}
        </div>
        <div className="flex gap-2">
            <button onClick={() => setMode("principal")} className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${mode === 'principal' ? 'bg-yellow-500 text-black' : 'bg-white/5'}`}>Principal</button>
            <button onClick={() => setMode("rotary")} className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${mode === 'rotary' ? 'bg-blue-600 text-white' : 'bg-white/5'}`}>Rotary</button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-12">
        <div className="text-center space-y-4">
            <h1 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                Strategic <br/><span className={mode === 'principal' ? 'text-yellow-500 italic' : 'text-blue-500 italic'}>Insights</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-xl mx-auto">
                Orchestrate excellence using data-driven AI intelligence.
            </p>
        </div>

        <div className="w-full max-w-xl bg-white/5 p-12 rounded-[50px] border border-white/10 shadow-2xl text-center space-y-8">
            <input 
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className="w-full bg-black/50 p-6 rounded-2xl text-white text-center text-xl outline-none border border-white/10 focus:border-blue-500 transition-all"
              placeholder={mode === 'principal' ? "e.g. Science Lab Usage" : "e.g. Area 1 Water Project"}
            />
            <button 
                onClick={handleAction}
                className={`w-full py-6 rounded-2xl font-black text-xl uppercase shadow-xl transition-all ${mode === 'principal' ? 'bg-yellow-500 text-black hover:bg-yellow-400' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
            >
                {mode === 'principal' ? 'Analyze & Optimize' : 'Audit Project'}
            </button>
        </div>
      </main>

      <footer className="bg-blue-900 h-20 border-t-8 border-yellow-500 flex items-center justify-between px-10 mt-auto">
        <div className="flex items-center gap-4">
          <Settings className="text-yellow-500" size={24} />
          <p className="text-sm font-black text-white uppercase">Rotary Abuja HighRise</p>
        </div>
        <ShieldCheck className="text-white/50" />
      </footer>

      {showModal && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[100] flex items-center justify-center p-6">
          <div className="bg-slate-900 border-2 border-white/10 rounded-[40px] w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Analysis Terminal</h2>
              <button onClick={() => setShowModal(false)} className="bg-white/10 p-3 rounded-xl text-white"><X/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-12 text-xl text-slate-300 whitespace-pre-wrap">
              {result && result.startsWith("DIAGNOSTIC") ? (
                <div className="bg-red-900/20 border border-red-500/50 p-8 rounded-3xl flex items-center gap-6">
                    <ShieldAlert className="text-red-500" size={48}/>
                    <p className="text-red-200 font-bold">{result}</p>
                </div>
              ) : result}
            </div>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="fixed inset-0 bg-black/90 z-[200] flex flex-col items-center justify-center space-y-6">
          <div className="h-20 w-20 border-4 border-white/10 border-t-yellow-500 rounded-full animate-spin"></div>
          <p className="text-xl font-black text-white uppercase tracking-[0.5em] animate-pulse">Processing...</p>
        </div>
      )}
    </div>
  );
};

export default App;
