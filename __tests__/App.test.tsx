import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  return {
    ...jest.requireActual('react-native-gesture-handler'),
    State: {
      UNDETERMINED: 0,
      BEGAN: 1,
      CANCELLED: 2,
      ACTIVE: 3,
      END: 4,
    },
  };
});

describe('App', () => {
  it('renders correctly', () => {
    render(<App />);
  });
});