export enum PocStatus {
    pending = 'PENDING',
    processing = 'PROCESSING',
    ready = 'READY'
}

export const PocStatusTranslation: Record<PocStatus, string> = {
    [PocStatus.pending]: 'pending',
    [PocStatus.processing]: 'processing',
    [PocStatus.ready]: 'ready',
};

