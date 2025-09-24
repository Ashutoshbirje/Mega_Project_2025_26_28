import { render, screen } from '@testing-library/react';
import App from './App';

test('renders at least one div element', () => {
  const { container } = render(<App />);
  const divs = container.querySelectorAll('div');
  expect(divs.length).toBeGreaterThan(0);
});
