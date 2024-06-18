import { TestBed } from '@angular/core/testing';

import { ScoreReporter } from '../ScoreReporter';
import { TestModel } from '../TestModel';
import { testModels } from '../../constants/testModelData';

describe('ScoreReporter', () => {
  let service: ScoreReporter;

  beforeEach(() => {
    const _testModel = testModels[0];
    TestBed.configureTestingModule({
      providers: [
        ScoreReporter,
        {
          provide: TestModel,
          useValue: _testModel,
        },
      ],
    });
    service = TestBed.inject(ScoreReporter);
  });

  it('should be created', () => {
    console.log('testmodel', service._testModel);
    expect(service).toBeTruthy();
  });

  it('comparing two input lines should be equal to', () => {
    const result = service.compareTwoInputLinesInNormalTest(
      'The quick brown fox',
      'The Quick brown fox'
    );
    expect(result).toBeTruthy();
    expect(result).toEqual({ misTypeCount: 1, correct: 3 });
  });

  it('The score after the evaluation should be equal to', () => {
    const filledUpLines = [
      'In the Quiet stillness of a moonlit night,',
      'the world seems to pause and take a',
    ];
    service.evaluateScore(filledUpLines);

    expect(service._testModel.Result).toEqual({
      Correct: 15,
      MistypeCount: 1,
      TotalWords: 245,
      WPM: 30,
    });
  });
});
