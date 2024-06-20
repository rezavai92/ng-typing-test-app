import { TimerFormatPipe } from './timer-format.pipe'; // Adjust the path as necessary

describe('TimerFormatPipe', () => {
  let pipe: TimerFormatPipe;

  beforeEach(() => {
    pipe = new TimerFormatPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format 0 seconds as "0 : 00"', () => {
    expect(pipe.transform(0)).toBe('0 : 00');
  });

  it('should format 5 seconds as "0 : 05"', () => {
    expect(pipe.transform(5)).toBe('0 : 05');
  });

  it('should format 60 seconds as "1 : 00"', () => {
    expect(pipe.transform(60)).toBe('1 : 00');
  });

  it('should format 90 seconds as "1 : 30"', () => {
    expect(pipe.transform(90)).toBe('1 : 30');
  });

  it('should format 3600 seconds as "60 : 00"', () => {
    expect(pipe.transform(3600)).toBe('60 : 00');
  });

  it('should format 3725 seconds as "62 : 05"', () => {
    expect(pipe.transform(3725)).toBe('62 : 05');
  });

  it('should format 59 seconds as "0 : 59"', () => {
    expect(pipe.transform(59)).toBe('0 : 59');
  });

  it('should format 125 seconds as "2 : 05"', () => {
    expect(pipe.transform(125)).toBe('2 : 05');
  });
});
