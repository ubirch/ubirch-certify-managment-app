import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RevocationAuthorizersComponent } from './revocation-authorizers.component';

describe('RevocationAuthorizersComponent', () => {
  let component: RevocationAuthorizersComponent;
  let fixture: ComponentFixture<RevocationAuthorizersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RevocationAuthorizersComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RevocationAuthorizersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
