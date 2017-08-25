import generateUID from '../src/utils';

test('generateUID should return a valid id', () => {
  const validIDReg = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}/i;
  expect(validIDReg.test(generateUID())).toBe(true);
});