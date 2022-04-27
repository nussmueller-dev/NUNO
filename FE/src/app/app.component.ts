import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostListener, OnInit, RendererFactory2 } from '@angular/core';
import { routerTransition } from './shared/routes';
import { CurrentUserService } from './shared/services/current-user.service';
import { EasterEggService } from './shared/services/easter-egg.service';
import { SpecialEffectsService } from './shared/services/special-effects.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    routerTransition,
    trigger('easterEggHelpAnimation', [
      transition('true <=> false', [
        style({
          display: 'flex'
        }),
        animate('2000ms ease-in', keyframes([
          style({ transform: 'scale(0) rotate(-30deg)', offset: 0 }),
          style({ transform: 'scale(1) rotate(90deg)', offset: 0.5 }),
          style({ transform: 'scale(0) rotate(180deg)', offset: 1 }),
        ]))
      ])
    ]),
  ]
})
export class AppComponent implements OnInit {
  easterEggService: EasterEggService;
  easterEggCommands?: Array<string>;

  constructor(
    private currentUserService: CurrentUserService,
    easterEggService: EasterEggService,
    specialEffectsService: SpecialEffectsService,
    rendererFactory: RendererFactory2,
    elementRef: ElementRef
  ) {
    this.easterEggService = easterEggService;

    let renderer = rendererFactory.createRenderer(null, null);
    let canvas = renderer.createElement('canvas');
    renderer.appendChild(elementRef.nativeElement, canvas);

    specialEffectsService.setCanvas(canvas);
  }

  @HostListener('document:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    let target: HTMLElement = event.target as HTMLElement;
    if (target.tagName === 'BODY') {
      this.easterEggService.keyPressed(event.key);
    }
  }

  ngOnInit() {
    this.easterEggCommands = this.easterEggService.getAllCommands();

    this.currentUserService.tryReAuthentication();
  }
}
