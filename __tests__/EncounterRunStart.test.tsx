import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EncounterRunStart from '../EncounterRunStart';
import { ThemeContext } from '../theme/ThemeContext';
import { useTranslation } from 'react-i18next';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockNavigation = {
  goBack: jest.fn(),
};

const mockRoute = {
  params: {
    encounter: {
      players: [{ name: 'Test Player', hp: 10 }],
      monsters: [
        { name: 'Goblin', hp: 8, count: 2 },
      ],
    },
  },
};

describe('EncounterRunStart', () => {
  it('renders players and monsters correctly', () => {
    const { getByText } = render(
      <ThemeContext.Provider value={{ theme: { background: null, backgroundButton: null } }}>
        <EncounterRunStart route={mockRoute} navigation={mockNavigation} />
      </ThemeContext.Provider>
    );

    expect(getByText('Test Player')).toBeTruthy();
    expect(getByText('Goblin')).toBeTruthy();
  });

  it('reduces and increases HP correctly', () => {
    const { getByText, getAllByText } = render(
      <ThemeContext.Provider value={{ theme: { background: null, backgroundButton: null } }}>
        <EncounterRunStart route={mockRoute} navigation={mockNavigation} />
      </ThemeContext.Provider>
    );

    fireEvent.press(getAllByText('-')[0]);
    expect(getByText('9')).toBeTruthy();

    fireEvent.press(getAllByText('+')[0]);
    expect(getByText('10')).toBeTruthy();
  });

  it('navigates back when Go Back button is pressed', () => {
    const { getByText } = render(
      <ThemeContext.Provider value={{ theme: { background: null, backgroundButton: null } }}>
        <EncounterRunStart route={mockRoute} navigation={mockNavigation} />
      </ThemeContext.Provider>
    );

    fireEvent.press(getByText('Go_back'));
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('ends the encounter when no monsters are alive', () => {
    const { getByText, getAllByText } = render(
      <ThemeContext.Provider value={{ theme: { background: null, backgroundButton: null } }}>
        <EncounterRunStart route={{
          params: {
            encounter: {
              players: [{ name: 'Test Player', hp: 10 }],
              monsters: [{ name: 'Goblin', hp: 1, count: 1 }],
            },
          },
        }} navigation={mockNavigation} />
      </ThemeContext.Provider>
    );

    fireEvent.press(getAllByText('-')[1]);
    fireEvent.press(getAllByText('-')[1]);

    fireEvent.press(getByText('End Encounter'));
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});
