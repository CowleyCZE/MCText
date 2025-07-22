try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error("Could not find root element to mount to");
  }

  console.log('Root element found, creating React root...');
  const root = ReactDOM.createRoot(rootElement);
  
  console.log('Rendering application...');
  root.render(
    <React.StrictMode>
      <MinimalApp />
    </React.StrictMode>
  );
  
  console.log('Application rendered successfully');
} catch (error) {
  console.error('Failed to start application:', error);
  
  // Fallback rendering
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="
        min-height: 100vh;
        background-color: #0f172a;
        color: #ef4444;
        padding: 2rem;
        font-family: system-ui, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          background-color: #1e293b;
          padding: 2rem;
          border-radius: 1rem;
          border: 1px solid #ef4444;
          max-width: 600px;
        ">
          <h1 style="color: #ef4444; margin-bottom: 1rem;">Chyba při spuštění aplikace</h1>
          <p style="margin-bottom: 1rem;">Aplikace se nepodařilo spustit. Chyba:</p>
          <pre style="
            background-color: #0f172a;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            font-size: 0.875rem;
            color: #fbbf24;
          ">${error instanceof Error ? error.message : String(error)}</pre>
          <p style="margin-top: 1rem; font-size: 0.875rem; color: #94a3b8;">
            Otevřete Developer Tools (F12) pro více informací.
          </p>
        </div>
      </div>
    `;
  }
}

