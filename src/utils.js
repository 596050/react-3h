export default () => {
  const time = new Date().getTime();
  return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, () =>
    ((time + (Math.random() * 16)) % 16 | 0).toString(16)); // eslint-disable-line no-bitwise
};
