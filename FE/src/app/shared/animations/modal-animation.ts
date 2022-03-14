import { style, animate, trigger, transition, state, group, query, keyframes, animateChild } from '@angular/animations';

export const modalAnimation = [
    trigger('hostShownHidden', [
        state('shown', style({
            display: 'flex'
        })),
        state('hidden', style({
            display: 'none'
        })),
        transition('hidden => shown', [
            group([
                animate('0.1s', keyframes([
                    style({ backgroundColor: 'rgba(0, 0, 0, 0)', display: 'flex' }),
                    style({ backgroundColor: 'rgba(0, 0, 0, 0.781)' }),
                ])),
                query('@holderShownHidden', animateChild()),
            ]),
        ]),
        transition('shown => hidden', [
            group([
                animate('0.1s', keyframes([
                    style({ backgroundColor: 'rgba(0, 0, 0, 0.781)' }),
                    style({ backgroundColor: 'rgba(0, 0, 0, 0)', display: 'none' }),
                ])),
                query('@holderShownHidden', animateChild()),
            ]),
        ]),
    ]),
    trigger('holderShownHidden', [
        state('shown', style({
            display: 'flex',
            transform: 'scale(1)',
        })),
        state('hidden', style({
            display: 'none',
            transform: 'scale(0)',
        })),
        transition('hidden => shown', animate('0.3s', keyframes([
            style({ transform: 'scale(.7)', display: 'flex' }),
            style({ transform: 'scale(1.05)' }),
            style({ transform: 'scale(0.95)' }),
            style({ transform: 'scale(1)' }),
        ]))),
        transition('shown => hidden', animate('0.15s', keyframes([
            style({ transform: 'scale(1)' }),
            style({ transform: 'scale(0)', display: 'none' }),
        ])))
    ]),
];