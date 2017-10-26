var sketchtool = require('../scripts/utils/sketchtool');

var testFilePath = '__tests__/test.sketch';

if (!sketchtool.check()) {
  process.exit(1);
}

describe('Check if sketchtool is set up correctly', () => {
  test('Can execute sketchtool', () => {
    expect(sketchtool.exec('help')).toBeTruthy();
  });

  test('Sketch version can be retrieved', () => {
    var version = sketchtool.getVersion();
    expect(version).toBeTruthy();
  });

  test('Can dump load sketch files', () => {
    var json = sketchtool.loadFile(testFilePath);
  });

  test('Can read dumped json', () => {
    var json = sketchtool.loadFile(testFilePath);
    expect(json.objectID).toBeTruthy();
  });
});
  