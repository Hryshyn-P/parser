import { TxtParserService } from '../src/services/parser/txt.parser.service';

describe('TxtParserService', () => {
  let txtParserService: TxtParserService;

  beforeEach(() => {
    txtParserService = new TxtParserService();
  });

  it('should parse file correctly', async () => {
    const testFile = 'test/export.txt';

    const result = await txtParserService.parseFile(testFile);

    expect(result).toBeDefined();
    expect(typeof result === 'object' && result !== null).toBe(true);
    expect(result.departments.length).toStrictEqual(6);
    expect(result.departments[0].employees.length).toStrictEqual(18);
    expect(result.rates.length).toStrictEqual(70);
    // ...
  });
});
