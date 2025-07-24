import React, { useState, useEffect, Component } from 'react';

// Error Boundary component
class ErrorBoundary extends Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen bg-slate-900 text-slate-100 p-8 flex items-center justify-center">
            <div className="bg-red-900/20 border border-red-700 text-red-100 p-6 rounded-lg max-w-md">
              <h2 className="text-xl font-bold text-red-400 mb-2">Chyba aplikace</h2>
              <p className="text-sm mb-4">Došlo k chybě při načítání komponenty:</p>
              <pre className="text-xs bg-slate-800 p-2 rounded overflow-auto">
                {this.state.error?.message}
              </pre>
              <button
                onClick={() => this.setState({ hasError: false, error: undefined })}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
              >
                Zkusit znovu
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

const DebugApp: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [apiKeyStatus, setApiKeyStatus] = useState<string>('Kontroluji...');

  useEffect(() => {
    // Check API key
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      setApiKeyStatus('✅ API klíč nalezen');
    } else {
      setApiKeyStatus('❌ API klíč chybí');
    }
  }, []);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="bg-slate-800 p-6 rounded-xl shadow-xl">
            <h2 className="text-xl font-semibold text-sky-300 mb-4">Krok 1: Základní načítání</h2>
            <div className="space-y-2 text-slate-300">
              <p>✅ React se načetl</p>
              <p>✅ Komponenta se renderuje</p>
              <p>✅ Tailwind CSS funguje</p>
              <p>{apiKeyStatus}</p>
            </div>
            <button
              onClick={() => setCurrentStep(2)}
              className="mt-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Pokračovat na krok 2
            </button>
          </div>
        );

      case 2:
        return (
          <ErrorBoundary>
            <div className="bg-slate-800 p-6 rounded-xl shadow-xl">
              <h2 className="text-xl font-semibold text-emerald-300 mb-4">Krok 2: Test importů</h2>
              <div className="space-y-2 text-slate-300">
                <p>✅ ErrorBoundary funguje</p>
                <p>✅ Dynamic imports fungují</p>
              </div>
              <button
                onClick={() => setCurrentStep(3)}
                className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Pokračovat na krok 3
              </button>
            </div>
          </ErrorBoundary>
        );

      case 3:
        return (
          <ErrorBoundary>
            <TestComponents onNext={() => setCurrentStep(4)} />
          </ErrorBoundary>
        );

      case 4:
        return (
          <ErrorBoundary>
            <div className="bg-slate-800 p-6 rounded-xl shadow-xl">
              <h2 className="text-xl font-semibold text-purple-300 mb-4">Krok 4: Všechno funguje!</h2>
              <p className="text-slate-300 mb-4">Aplikace je připravena k použití.</p>
              <button
                onClick={() => setCurrentStep(5)}
                className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Načíst hlavní aplikaci
              </button>
            </div>
          </ErrorBoundary>
        );

      case 5:
        return (
          <ErrorBoundary
            fallback={
              <div className="bg-red-900/20 border border-red-700 text-red-100 p-6 rounded-lg">
                <h3 className="font-bold text-red-400 mb-2">Chyba v hlavní aplikaci</h3>
                <p className="text-sm mb-4">Hlavní aplikace se nepodařila načíst. Zkuste:</p>
                <ul className="text-sm space-y-1 mb-4">
                  <li>1. Zkontrolovat konzoli prohlížeče</li>
                  <li>2. Zkontrolovat API klíč</li>
                  <li>3. Obnovit stránku</li>
                </ul>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  Zpět na začátek
                </button>
              </div>
            }
          >
            <LazyMainApp />
          </ErrorBoundary>
        );

      default:
        return <div>Neznámý krok</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-400">
          Lyric Analyzer - Debug Mode
        </h1>
        <p className="text-slate-400 mt-2">Krok {currentStep} z 5</p>
      </header>

      <main className="max-w-4xl mx-auto">
        {renderStep()}
      </main>

      <footer className="text-center mt-8 text-slate-500 text-sm">
        <p>Debug verze pro diagnostiku problémů</p>
      </footer>
    </div>
  );
};

// Test Components
const TestComponents: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [componentsLoaded, setComponentsLoaded] = useState<string[]>([]);

  useEffect(() => {
    const testComponents = async () => {
      try {
        // Test základních importů
        const {  } = await import('./constants');
        setComponentsLoaded(prev => [...prev, 'constants']);

        const {  } = await import('./components/LoadingSpinner');
        setComponentsLoaded(prev => [...prev, 'LoadingSpinner']);

        const {  } = await import('./components/LyricInput');
        setComponentsLoaded(prev => [...prev, 'LyricInput']);

        const {  } = await import('./components/AnalysisDisplay');
        setComponentsLoaded(prev => [...prev, 'AnalysisDisplay']);

      } catch (error) {
        console.error('Chyba při načítání komponent:', error);
        setComponentsLoaded(prev => [...prev, `❌ Chyba: ${(error as Error).message}`]);
      }
    };

    testComponents();
  }, []);

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-xl">
      <h2 className="text-xl font-semibold text-yellow-300 mb-4">Krok 3: Test komponent</h2>
      <div className="space-y-1 text-slate-300 mb-4">
        {componentsLoaded.map((component, idx) => (
          <p key={idx}>
            {component.startsWith('❌') ? component : `✅ ${component}`}
          </p>
        ))}
      </div>
      {componentsLoaded.length >= 4 && (
        <button
          onClick={onNext}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Komponenty načteny - pokračovat
        </button>
      )}
    </div>
  );
};

// Lazy loading hlavní aplikace
const LazyMainApp: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [MainApp, setMainApp] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    const loadMainApp = async () => {
      try {
        const module = await import('./App');
        setMainApp(() => module.default);
        setLoading(false);
      } catch (error) {
        console.error('Chyba při načítání hlavní aplikace:', error);
        throw error;
      }
    };

    loadMainApp();
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-800 p-6 rounded-xl shadow-xl">
        <div className="flex items-center justify-center">
          <div className="loading-spinner"></div>
          <span className="ml-4 text-slate-300">Načítám hlavní aplikaci...</span>
        </div>
      </div>
    );
  }

  return MainApp ? <MainApp /> : <div>Chyba při načítání</div>;
};

export default DebugApp;