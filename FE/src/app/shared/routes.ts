import { RegisterComponent } from './../pages/register/register.component';
import { LoginComponent } from './../pages/login/login.component';
import { SelectUsernameComponent } from './../pages/select-username/select-username.component';
import { WelcomeComponent } from './../pages/welcome/welcome.component';
import { transition, trigger } from '@angular/animations';
import { slideLeft, slideRight } from './animations/route-animations';

export const STATES = ['welcome', 'username', 'login', 'register'] as const;

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
