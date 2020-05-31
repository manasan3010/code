import { TestBed } from '@angular/core/testing';

import { ConvertToSVGService } from './convert-to-svg.service';

describe('ConvertToSVGService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConvertToSVGService = TestBed.get(ConvertToSVGService);
    expect(service).toBeTruthy();
  });
});
