import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import LogInScreen from '../LogInScreen';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeContext } from '../theme/ThemeContext';
import { UserData } from '../UserData';
import { AuthContext } from '../AuthContext';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn().mockReturnValue({
    navigate: jest.fn(),
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: jest.fn() },
  }),
}));

jest.mock('../AuthContext', () => ({
  useAuth: () => ({
    setToken: jest.fn(),
  }),
}));

jest.mock('../UserData', () => ({
  UserData: {
    loginUser: jest.fn().mockResolvedValue(true),
  },
}));

const Wrapper = ({ children }: any) => (
  <NavigationContainer>
    <ThemeContext.Provider value={{ theme: { background: 'white', fontColor: 'black', textColor: 'black', backgroundButton: 'blue' } }}>
      {children}
    </ThemeContext.Provider>
  </NavigationContainer>
);

describe('LogInScreen', () => {
  it('should render correctly', () => {
    render(<LogInScreen />, { wrapper: Wrapper });

    expect(screen.getByText('Log in')).toBeTruthy();
    expect(screen.getByText('New_user')).toBeTruthy();
    expect(screen.getByText('Create_account')).toBeTruthy();
    expect(screen.getByText('Login_nick')).toBeTruthy();
    expect(screen.getByText('Pass')).toBeTruthy();
    expect(screen.getByText('Forgot_pass')).toBeTruthy();
    expect(screen.getByText('Continue')).toBeTruthy();
    expect(screen.getByText('or')).toBeTruthy();
    expect(screen.getByText('Use_Google')).toBeTruthy();
    expect(screen.getByText('Use_Facebook')).toBeTruthy();
    expect(screen.getByText('Use_Apple')).toBeTruthy();
    expect(screen.getByText('Go_back')).toBeTruthy();
  });

  it('should navigate to Registration when "Create_account" is pressed', () => {
    const { getByText } = render(<LogInScreen />, { wrapper: Wrapper });

    fireEvent.press(getByText('Create_account'));

    const navigation = require('@react-navigation/native').useNavigation();
    expect(navigation.navigate).toHaveBeenCalledWith('Registration');
  });

  it('should navigate to ForgotPass when "Forgot_pass" is pressed', () => {
    const { getByText } = render(<LogInScreen />, { wrapper: Wrapper });

    fireEvent.press(getByText('Forgot_pass'));

    const navigation = require('@react-navigation/native').useNavigation();
    expect(navigation.navigate).toHaveBeenCalledWith('ForgotPass');
  });

  it('should call loginUser when "Continue" is pressed', async () => {
    const { getByText } = render(<LogInScreen />, { wrapper: Wrapper });

    fireEvent.changeText(screen.getByPlaceholderText('Login_nick'), 'testuser');
    fireEvent.changeText(screen.getByPlaceholderText('Pass'), 'password123');
    fireEvent.press(getByText('Continue'));

    await waitFor(() => expect(UserData.loginUser).toHaveBeenCalledWith('testuser', 'password123', expect.anything()));
  });

  it('should show an alert if login fails', async () => {
    UserData.loginUser.mockResolvedValueOnce(false);

    const { getByText } = render(<LogInScreen />, { wrapper: Wrapper });

    fireEvent.changeText(screen.getByPlaceholderText('Login_nick'), 'wronguser');
    fireEvent.changeText(screen.getByPlaceholderText('Pass'), 'wrongpassword');
    fireEvent.press(getByText('Continue'));

    await waitFor(() => expect(global.alert).toHaveBeenCalledWith('Invalid login or password'));
  });

  it('should navigate to the correct social login screens when social buttons are pressed', () => {
    const { getByText } = render(<LogInScreen />, { wrapper: Wrapper });

    fireEvent.press(getByText('Use_Google'));
    const navigation = require('@react-navigation/native').useNavigation();
    expect(navigation.navigate).toHaveBeenCalledWith('KontoGoogle');

    fireEvent.press(getByText('Use_Facebook'));
    expect(navigation.navigate).toHaveBeenCalledWith('KontoFacebook');

    fireEvent.press(getByText('Use_Apple'));
    expect(navigation.navigate).toHaveBeenCalledWith('KontoApple');
  });

  it('should navigate to Home when "Go_back" is pressed', () => {
    const { getByText } = render(<LogInScreen />, { wrapper: Wrapper });

    fireEvent.press(getByText('Go_back'));

    const navigation = require('@react-navigation/native').useNavigation();
    expect(navigation.navigate).toHaveBeenCalledWith('Home');
  });
});
