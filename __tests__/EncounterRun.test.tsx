import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EncounterRun from '../EncounterRun';
import { ThemeContext } from '../theme/ThemeContext';
import { useTranslation } from 'react-i18next';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('EncounterRun', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };

  const mockRoute = {
    params: {
      encounter: {
        players: [
          { name: 'Player 1', ac: 15, level: 1 },
          { name: 'Player 2', ac: 14, level: 2 },
        ],
        monsters: [
          { name: 'Monster 1', ac: 12, cr: 1, count: 2, image: 'monster1.png' },
          { name: 'Monster 2', ac: 16, cr: 2, count: 1, image: 'monster2.png' },
        ],
      },
    },
  };

  const theme = {
    background: 'background-image',
    backgroundButton: 'button-background-image',
  };

  it('renders the EncounterRun component correctly', () => {
    const { getByText } = render(
      <ThemeContext.Provider value={{ theme }}>
        <EncounterRun route={mockRoute} navigation={mockNavigation} />
      </ThemeContext.Provider>
    );

    expect(getByText('Go_back')).toBeTruthy();
    expect(getByText('Auto Roll Initiative')).toBeTruthy();
    expect(getByText('Start')).toBeTruthy();
    expect(getByText('Initiative')).toBeTruthy();
    expect(getByText('Name')).toBeTruthy();
    expect(getByText('Player 1')).toBeTruthy();
    expect(getByText('Player 2')).toBeTruthy();
    expect(getByText('Monster 1')).toBeTruthy();
    expect(getByText('Monster 2')).toBeTruthy();
  });

  it('navigates back when "Go Back" is pressed', () => {
    const { getByText } = render(
      <ThemeContext.Provider value={{ theme }}>
        <EncounterRun route={mockRoute} navigation={mockNavigation} />
      </ThemeContext.Provider>
    );

    fireEvent.press(getByText('Go_back'));
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('navigates to EncounterRunStart with the correct parameters when "Start" is pressed', () => {
    const { getByText } = render(
      <ThemeContext.Provider value={{ theme }}>
        <EncounterRun route={mockRoute} navigation={mockNavigation} />
      </ThemeContext.Provider>
    );

    fireEvent.press(getByText('Start'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('EncounterRunStart', {
      encounter: {
        players: [
          { name: 'Player 1', ac: 15, level: 1 },
          { name: 'Player 2', ac: 14, level: 2 },
        ],
        monsters: mockRoute.params.encounter.monsters,
      },
    });
  });

  it('displays a message when there are no players or monsters', () => {
    const emptyRoute = { params: { encounter: { players: [], monsters: [] } } };

    const { getByText } = render(
      <ThemeContext.Provider value={{ theme }}>
        <EncounterRun route={emptyRoute} navigation={mockNavigation} />
      </ThemeContext.Provider>
    );

    expect(getByText('No players or monsters in this encounter')).toBeTruthy();
  });
});
