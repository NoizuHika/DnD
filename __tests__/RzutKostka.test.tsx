import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RzutKostka from './RzutKostka';
import { ThemeContext } from './theme/ThemeContext';
import { useTranslation } from 'react-i18next';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({
    t: jest.fn((key) => key),
  })),
}));

const mockNavigation = {
  goBack: jest.fn(),
};

const mockThemeContext = {
  theme: {
    background: 'mock-background',
    backgroundButton: 'mock-background-button',
  },
  addDiceResult: jest.fn(),
};

describe('RzutKostka', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <ThemeContext.Provider value={mockThemeContext}>
        <RzutKostka navigation={mockNavigation} />
      </ThemeContext.Provider>
    );

    expect(getByText('Roll')).toBeTruthy();
    expect(getByText('Reset')).toBeTruthy();
    expect(getByText('Go_back')).toBeTruthy();
  });

  it('selects and deselects dice', () => {
    const { getByText, getAllByTestId } = render(
      <ThemeContext.Provider value={mockThemeContext}>
        <RzutKostka navigation={mockNavigation} />
      </ThemeContext.Provider>
    );

    const diceButtons = getAllByTestId('dice-button');

    fireEvent.press(diceButtons[0]);
    expect(getByText('1')).toBeTruthy();

    fireEvent.press(diceButtons[0]);
    expect(() => getByText('1')).toThrow();
  });

  it('rolls dice and displays results', () => {
    const { getByText, getAllByTestId } = render(
      <ThemeContext.Provider value={mockThemeContext}>
        <RzutKostka navigation={mockNavigation} />
      </ThemeContext.Provider>
    );

    const diceButtons = getAllByTestId('dice-button');
    fireEvent.press(diceButtons[0]);

    fireEvent.press(getByText('Roll'));
    const resultText = getByText(/d4: \d+/);
    expect(resultText).toBeTruthy();
  });

  it('resets selected dice and results', () => {
    const { getByText, getAllByTestId, queryByText } = render(
      <ThemeContext.Provider value={mockThemeContext}>
        <RzutKostka navigation={mockNavigation} />
      </ThemeContext.Provider>
    );

    const diceButtons = getAllByTestId('dice-button');
    fireEvent.press(diceButtons[0]);

    fireEvent.press(getByText('Roll'));
    expect(getByText(/d4: \d+/)).toBeTruthy();

    fireEvent.press(getByText('Reset'));
    expect(queryByText(/d4: \d+/)).toBeNull();
  });

  it('navigates back when "Go back" is pressed', () => {
    const { getByText } = render(
      <ThemeContext.Provider value={mockThemeContext}>
        <RzutKostka navigation={mockNavigation} />
      </ThemeContext.Provider>
    );

    fireEvent.press(getByText('Go_back'));
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});
