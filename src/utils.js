export const generateUID = () => {
  const time = new Date().getTime();
  return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, (c) =>
    ((time + Math.random() * 16) % 16 | 0).toString(16));
};