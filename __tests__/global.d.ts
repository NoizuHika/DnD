declare global {
  namespace NodeJS {
    interface Global {
      alert: jest.Mock;
    }
  }
}