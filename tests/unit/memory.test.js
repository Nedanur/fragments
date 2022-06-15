const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData
} = require('../../src/model/data/memory/index');

//Not so sure if this enough.
describe('memory', () => {

  test('testing readFragment()', async () => {
    const data = { fragment: 'pretend fragment 1', id: '1', ownerId: 'aa' };
    await writeFragment(data);
    const result = await readFragment('aa', '1');
    expect(result).toBe(data);
  });

  test('testing writeFragment()', async () => {
    const data = { fragment: 'pretend fragment 1', id: '1', ownerId: 'aa' };
    const result = await writeFragment(data);
    expect(result).toBe(undefined);
  });

  test('testing writeFragmentData()', async () => {
    const data = 'pretend fragment 1';
    const result = await writeFragmentData('aa', '1', data);
    expect(result).toBe(undefined);
  });

  test('testing readFragmentData()', async () => {
    const data = 'pretend fragment 1';
    await writeFragmentData('aa', '1', data);
    const result = await readFragmentData('aa', '1');
    expect(result).toBe(data);
  });

});