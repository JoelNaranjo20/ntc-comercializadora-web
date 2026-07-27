import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error('[Error]', error.message, info); }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60dvh] flex items-center justify-center p-8">
          <div className="text-center max-w-sm">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-red-50 text-red-400 flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2">Algo salio mal</h3>
            <p className="text-sm text-gray-500 mb-6">Ha ocurrido un error inesperado.</p>
            <button onClick={() => window.location.reload()}
              className="inline-flex items-center px-6 py-3 rounded-full bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-all duration-500 active:scale-[0.97] shadow-[0_2px_8px_rgba(45,139,84,0.18)]">
              Recargar pagina
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
