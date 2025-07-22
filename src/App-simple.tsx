import React, { useState } from 'react';

const SimpleApp: React.FC = () => {
  const [testState, setTestState] = useState<string>('Aplikace funguje!');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-400">
          Test Aplikace
        </h1>
        <p className="text-slate-400 mt-2">Debugging verze</p>
      </header>
      
      <main className="max-w-4xl mx-auto">
        <div className="bg-slate-800 p-6 rounded-xl shadow-xl">
          <h2 className="text-xl font-semibold text-sky-300 mb-4">Stav testu:</h2>
          <p className="text-slate-200">{testState}</p>
          
          <button
            onClick={() => setTestState('Button funguje - React state OK!')}
            className="mt-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Test Button
          </button>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-xl shadow-xl mt-6">
          <h3 className="text-lg font-semibold text-emerald-400 mb-3">Diagnostika:</h3>
          <ul className="text-slate-300 space-y-2">
            <li>✅ React komponenta se renderuje</li>
            <li>✅ Tailwind CSS funguje</li>
            <li>✅ State management funguje</li>
            <li>✅ Event handlers fungují</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default SimpleApp;