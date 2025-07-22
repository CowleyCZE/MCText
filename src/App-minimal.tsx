import React from 'react';

const MinimalApp = () => {
  const [count, setCount] = React.useState(0);
  
  React.useEffect(() => {
    console.log('MinimalApp mounted successfully');
    
    // Test API key
    const apiKey = (window as any).import?.meta?.env?.VITE_GEMINI_API_KEY || process.env.API_KEY;
    console.log('API key check:', apiKey ? 'Found' : 'Missing');
    
    // Test environment
    console.log('Environment:', {
      NODE_ENV: process.env.NODE_ENV,
      location: window.location.href,
      userAgent: navigator.userAgent
    });
    
    return () => {
      console.log('MinimalApp unmounting');
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: '#e2e8f0',
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          background: 'linear-gradient(to right, #38bdf8, #06b6d4)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent'
        }}>
          Minimální Test App
        </h1>
        
        <div style={{
          backgroundColor: '#1e293b',
          padding: '2rem',
          borderRadius: '1rem',
          marginBottom: '1rem'
        }}>
          <h2 style={{ color: '#38bdf8', marginBottom: '1rem' }}>
            Diagnostika problému
          </h2>
          
          <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
            <p>✅ React funguje</p>
            <p>✅ useState funguje: {count}</p>
            <p>✅ useEffect se spustil</p>
            <p>✅ Inline styles fungují</p>
            <p>✅ Event handlers: 
              <button 
                onClick={() => setCount(c => c + 1)}
                style={{
                  marginLeft: '0.5rem',
                  padding: '0.25rem 0.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer'
                }}
              >
                Klik ({count})
              </button>
            </p>
          </div>
          
          <div style={{ 
            backgroundColor: '#065f46', 
            padding: '1rem', 
            borderRadius: '0.5rem',
            border: '1px solid #059669'
          }}>
            <h3 style={{ color: '#10b981', marginBottom: '0.5rem' }}>
              Status: APLIKACE FUNGUJE
            </h3>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>
              Pokud vidíte tuto zprávu a tlačítko funguje, základní React aplikace je v pořádku.
              Problém je pravděpodobně v některé komponentě nebo importu.
            </p>
          </div>
        </div>
        
        <div style={{
          backgroundColor: '#1e293b',
          padding: '1.5rem',
          borderRadius: '1rem',
          textAlign: 'left'
        }}>
          <h3 style={{ color: '#fbbf24', marginBottom: '1rem' }}>
            Kontrolní seznam:
          </h3>
          <ol style={{ paddingLeft: '1.5rem', lineHeight: '1.6' }}>
            <li>Otevřete Developer Tools (F12)</li>
            <li>Podívejte se na Console tab</li>
            <li>Zkontrolujte chybové zprávy (červené)</li>
            <li>Zkontrolujte Network tab pro failed requests</li>
            <li>Pokud vidíte tuto stránku, React funguje</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default MinimalApp;