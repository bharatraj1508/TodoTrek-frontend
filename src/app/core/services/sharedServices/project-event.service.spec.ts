import { TestBed } from '@angular/core/testing';

import { ProjectEventService } from './project-event.service';

describe('ProjectEventService', () => {
  let service: ProjectEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
