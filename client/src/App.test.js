import { render, fireEvent } from '@testing-library/react';
import App from './App';

test('Clicking Add Player changes to Screen 1', () => {
  const { getByText } = render(<App />);
  
  // Find the "Add Player" button in Screen 2 and click it
  const addButton = getByText('Add Player');
  fireEvent.click(addButton);
  
  // Check if Screen 1 is rendered after clicking the button
  const screen1 = getByText('Player');
  expect(screen1).toBeInTheDocument();
});