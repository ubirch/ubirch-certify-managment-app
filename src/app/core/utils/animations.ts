import { animate, state, style, transition, trigger, useAnimation } from '@angular/animations';
import { fadeInUp, fadeOutUp } from 'ngx-animate';

export const detailExpand = trigger('detailExpand', [
    state('collapsed', style({ height: '0px', minHeight: '0' })),
    state('expanded', style({ height: '*' })),
    transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
]);

export const fadeDownIn = trigger('fadeDownIn', [
    transition('void => *', useAnimation(fadeInUp, { params: { timing: 0.2, a: '-30px', b: '0px' } })),
    transition('* => void', useAnimation(fadeOutUp, { params: { timing: 0.2, a: '0px', b: '-30px' } })),
]);
