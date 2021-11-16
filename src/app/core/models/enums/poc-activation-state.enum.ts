import { PocStatus } from './poc-status.enum';

export enum PocActivationState {
    activated = 'ACTIVATED',
    deactivated = 'DEACTIVATED',
    activating = 'ACTIVATING',
    deactivating = 'DEACTIVATING'
}

export const PocActivationStateTranslation: Record<PocActivationState, string> = {
    [PocActivationState.activated]: 'activated',
    [PocActivationState.deactivated]: 'deactivated',
    [PocActivationState.activating]: 'activating',
    [PocActivationState.deactivating]: 'deactivating'
};

