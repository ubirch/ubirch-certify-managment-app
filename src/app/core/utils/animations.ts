import {animate, animation, keyframes, state, style, transition, trigger, useAnimation} from '@angular/animations';

function fade(fromOpacity: number, toOpacity: number) {
    return function(axis: 'x' | 'y') {
        const translate3d = transformAxis(axis, 'translate3d');

        return function(steps) {
            const params = Object.assign(
                {
                    timing: 1,
                    delay: 0,
                    fromOpacity,
                    toOpacity,
                },
                steps
            );

            return animation(
                animate(
                    '{{ timing }}s {{ delay }}s',
                    keyframes([
                        style({
                            opacity: '{{ fromOpacity }}',
                            transform: translate3d('a'),
                            offset: 0,
                        }),
                        style({
                            opacity: '{{ toOpacity }}',
                            transform: translate3d('b'),
                            offset: 1,
                        }),
                    ])
                ),
                { params }
            );
        };
    };
}

const fadeInDirection = fade(0, 1);
const fadeInY = fadeInDirection('y');
const fadeInUp = fadeInY({ a: '100%', b: 0 });

const fadeOutDirection = fade(1, 0);
const fadeOutY = fadeOutDirection('y');
export const fadeOutUp = fadeOutY({ a: '100%', b: 0 });


export const detailExpand = trigger('detailExpand', [
    state('collapsed', style({ height: '0px', minHeight: '0' })),
    state('expanded', style({ height: '*' })),
    transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
]);

export const fadeDownIn = trigger('fadeInDown', [
    transition('void => *', useAnimation(fadeInUp, { params: { timing: 0.2, a: '-30px', b: '0px' } })),
]);

export const fadeUpOut = trigger('fadeOutUp', [
    transition('* => void', useAnimation(fadeOutUp, { params: { timing: 0.2, a: '0px', b: '-30px' } })),
]);

export function transformAxis(axis: 'x' | 'y', name: string) {
    return function(letter: string): string {
        return axis === 'x'
            ? `${name}({{ ${letter} }}, 0, 0)`
            : `${name}(0, {{ ${letter} }}, 0)`;
    };
}

