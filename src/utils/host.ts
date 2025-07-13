const host = process.env.HOST || 'http://localhost:3000';

export const getHost = () => {
  return host;
};
