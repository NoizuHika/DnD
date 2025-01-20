import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import Spells from './Spells';
import { ThemeContext } from './theme/ThemeContext';
import { useTranslation } from 'react-i18next';

jest.mock('./assets/Library/spells.json', () => [
  { id: 1, name: 'Fireball', level: 3, school: 'Evocation', effect: 'Attack', description: 'A ball of fire.' },
  { id: 2, name: 'Shield', level: 1, school: 'Abjuration', effect: 'Defense', description: 'A magical shield.' },
]);

jest.mock('@react-native-picker/picker', () => ({
  Picker: jest.fn(({ children }) => <>{children}</>),
  PickerItem: jest.fn(({ label }) => <>{label}</>),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({
    t: (key: string) => key,
  })),
}));

const mockNavigation = {
  goBack: jest.fn(),
};

describe('<Spells />', () => {
  const themeMock = {
    background: { uri: 'mock-background.png' },
    backgroundButton: { uri: 'mock-button-background.png' },
  };

  it('renders spells and handles filtering', () => {
    render(
      <ThemeContext.Provider value={{ theme: themeMock }}>
        <Spells navigation={mockNavigation} />
      </ThemeContext.Provider>
    );

    expect(screen.getByPlaceholderText('Search spells')).toBeTruthy();
    expect(screen.getByText('Fireball')).toBeTruthy();
    expect(screen.getByText('Shield')).toBeTruthy();

    fireEvent.changeText(screen.getByPlaceholderText('Search spells'), 'Fireball');
    expect(screen.queryByText('Shield')).toBeNull();
    expect(screen.getByText('Fireball')).toBeTruthy();
  });

  it('opens spell details modal on click', () => {
    render(
      <ThemeContext.Provider value={{ theme: themeMock }}>
        <Spells navigation={mockNavigation} />
      </ThemeContext.Provider>
    );

    fireEvent.press(screen.getByText('Details', { exact: false }));
    expect(screen.getByText('Fireball')).toBeTruthy();
    expect(screen.getByText('Level:')).toBeTruthy();
  });

  it('allows editing a spell', () => {
    render(
      <ThemeContext.Provider value={{ theme: themeMock }}>
        <Spells navigation={mockNavigation} />
      </ThemeContext.Provider>
    );

    fireEvent.press(screen.getByText('Details', { exact: false }));
    fireEvent.press(screen.getByText('Edit'));

    const nameInput = screen.getByPlaceholderText('Spell Name');
    fireEvent.changeText(nameInput, 'Fireblast');

    fireEvent.press(screen.getByText('Save'));
    expect(screen.getByText('Fireblast')).toBeTruthy();
  });

  it('calls navigation goBack on "Go_back" button press', () => {
    render(
      <ThemeContext.Provider value={{ theme: themeMock }}>
        <Spells navigation={mockNavigation} />
      </ThemeContext.Provider>
    );

    fireEvent.press(screen.getByText('Go_back'));
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});
