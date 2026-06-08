import { Component } from 'react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">🌊</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Что-то пошло не так
          </h1>
          <p className="text-gray-500 mb-8">
            Произошла непредвиденная ошибка. Попробуйте вернуться на главную страницу.
          </p>
          <button
            onClick={this.handleReload}
            className="bg-blue-800 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition"
          >
            На главную
          </button>
          {import.meta.env.DEV && this.state.error && (
            <pre className="mt-6 text-left text-xs bg-red-50 border border-red-200 rounded-xl p-4 overflow-auto text-red-700">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      </div>
    );
  }
}
