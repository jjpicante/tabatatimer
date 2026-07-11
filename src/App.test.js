import { render, screen } from '@testing-library/react';
import App from './App';

test('renderiza el temporizador con sus controles', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /^▶\s*Iniciar$/i })).toBeInTheDocument();
  expect(screen.getByText(/Tiempo restante/i)).toBeInTheDocument();
});
