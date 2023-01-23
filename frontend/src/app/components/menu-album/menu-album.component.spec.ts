import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuAlbumComponent } from './menu-album.component';

describe('MenuAlbumComponent', () => {
  let component: MenuAlbumComponent;
  let fixture: ComponentFixture<MenuAlbumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuAlbumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
