import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserData = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const storedUsers = await AsyncStorage.getItem('users');
        if (storedUsers) {
          console.log('Loaded users from storage:', storedUsers);
          setUsers(JSON.parse(storedUsers));
        } else {
          const initialUsers = [
            { login: 'user', password: 'password' },
            { login: 'admin', password: 'admin' },
            { login: '', password: '' },
          ];
          await AsyncStorage.setItem('users', JSON.stringify(initialUsers));
          setUsers(initialUsers);
        }
      } catch (error) {
        console.error('Failed to load users', error);
      }
    };
    loadUsers();
  }, []);

  const registerUser = async (user) => {
    try {
      console.log('Registering user:', user);
      const updatedUsers = [...users, user];
      setUsers(updatedUsers);
      await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
    } catch (error) {
      console.error('Failed to register user', error);
    }
  };

  const clearUsers = async () => {
    try {
      await AsyncStorage.removeItem('users');
      setUsers([]);
      console.log('Cleared users from storage');
    } catch (error) {
      console.error('Failed to clear users', error);
    }
  };

  const loginUser = (login, password) => {
    return users.find(user => user.login === login && user.password === password);
  };

  return (
    <UserData.Provider value={{ users, registerUser, loginUser, clearUsers }}>
      {children}
    </UserData.Provider>
  );
};