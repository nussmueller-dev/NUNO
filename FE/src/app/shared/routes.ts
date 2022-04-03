import { PlayComponent } from './../pages/play/play.component';
import { RegisterComponent } from './../pages/register/register.component';
import { LoginComponent } from './../pages/login/login.component';
import { SelectUsernameComponent } from './../pages/select-username/select-username.component';
import { WelcomeComponent } from './../pages/welcome/welcome.component';
import { transition, trigger } from '@angular/animations';
import { slideLeft, slideRight } from './animations/route-animations';
import { JoinGameComponent } from '../pages/join-game/join-game.component';
import { RulesComponent } from '../pages/rules/rules.component';
import { WaitingForStartComponent } from '../pages/waiting-for-start/waiting-for-start.component';
import { ManagePlayersComponent } from '../pages/manage-players/manage-players.component';

export const STATES = ['welcome', 'username', 'login', 'register', 'join', 'rules', 'waiting', 'managePlayers', 'play'] as const;

export type ExampleAppState = typeof STATES[number];

interface StateConfiguration {
    path: string;
    component: any;
    order: number;
}

export const stateConfiguration: Record<ExampleAppState, StateConfiguration> = {
    welcome: {
        path: 'welcome',
        component: WelcomeComponent,
        order: 0
    },
    username: {
        path: 'username',
        component: SelectUsernameComponent,
        order: 1
    },
    login: {
        path: 'login',
        component: LoginComponent,
        order: 2
    },
    register: {
        path: 'register',
        component: RegisterComponent,
        order: 3
    },
    join: { 
        path: 'join', 
        component: JoinGameComponent ,
        order: 4
    },
    rules: { 
        path: 'rules', 
        component: RulesComponent ,
        order: 5
    },
    waiting: { 
        path: 'waiting', 
        component: WaitingForStartComponent,
        order: 6 
    },
    managePlayers: { 
        path: 'manage-players', 
        component: ManagePlayersComponent,
        order: 7 
    },
    play: { 
        path: 'play', 
        component: PlayComponent,
        order: 8
    }
};

const allStateCombinations: [
    ExampleAppState,
    ExampleAppState
][] = (() => {
    let result: [ExampleAppState, ExampleAppState][] = [];

    STATES.forEach(state => {
        STATES.forEach(targetState => {
            if (state !== targetState) {
                result.push([state, targetState]);
            }
        });
    });

    return result;
})();

export const routerTransition = trigger(
    'routerTransition',
    allStateCombinations.map(([entering, leaving]) =>
        transition(
            `${entering} => ${leaving}`,
            stateConfiguration[entering].order < stateConfiguration[leaving].order
                ? slideLeft
                : slideRight
        )
    )
);

export const routes = [
    ...STATES.map(state => ({
        path: stateConfiguration[state].path,
        component: stateConfiguration[state].component,
        data: { state }
    })),
    { path: '**', redirectTo: 'welcome' }
];
