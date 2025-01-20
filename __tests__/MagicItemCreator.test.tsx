import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MagicItemCreator from './MagicItemCreator';
import { ThemeContext } from './theme/ThemeContext';
import { NavigationContainer } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockTheme = {
  background: null,
  backgroundButton: null,
  textColor: 'black',
  checkboxActive: 'green',
  checkboxInactive: 'gray',
};

describe('MagicItemCreator Component', () => {
  it('renders correctly with initial state', () => {
    const { getByText, getByPlaceholderText } = render(
      <ThemeContext.Provider value={{ theme: mockTheme }}>
        <NavigationContainer>
          <MagicItemCreator navigation={{ goBack: jest.fn() }} />
        </NavigationContainer>
      </ThemeContext.Provider>
    );

    expect(getByText('Name')).toBeTruthy();
    expect(getByPlaceholderText('Enter item name')).toBeTruthy();
    expect(getByText('Save Magic Item')).toBeTruthy();
  });

  it('updates state on user interaction', () => {
    const { getByPlaceholderText, getByText } = render(
      <ThemeContext.Provider value={{ theme: mockTheme }}>
        <NavigationContainer>
          <MagicItemCreator navigation={{ goBack: jest.fn() }} />
        </NavigationContainer>
      </ThemeContext.Provider>
    );

    const nameInput = getByPlaceholderText('Enter item name');
    fireEvent.changeText(nameInput, 'Magic Sword');
    expect(nameInput.props.value).toBe('Magic Sword');

    const saveButton = getByText('Save Magic Item');
    fireEvent.press(saveButton);
  });

  it('shows weapon options when item type is weapon', () => {
    const { getByText, getByTestId } = render(
      <ThemeContext.Provider value={{ theme: mockTheme }}>
        <NavigationContainer>
          <MagicItemCreator navigation={{ goBack: jest.fn() }} />
        </NavigationContainer>
      </ThemeContext.Provider>
    );

    const itemTypePicker = getByTestId('item-type-picker');
    fireEvent.valueChange(itemTypePicker, 'weapon');
    expect(getByText('Base Weapon')).toBeTruthy();
  });

  it('calls navigation.goBack when Go Back button is pressed', () => {
    const goBackMock = jest.fn();

    const { getByText } = render(
      <ThemeContext.Provider value={{ theme: mockTheme }}>
        <NavigationContainer>
          <MagicItemCreator navigation={{ goBack: goBackMock }} />
        </NavigationContainer>
      </ThemeContext.Provider>
    );

    const goBackButton = getByText('Go_back');
    fireEvent.press(goBackButton);
    expect(goBackMock).toHaveBeenCalled();
  });
});
