export enum PocStatus {
    pending = 'PENDING',
    processing = 'PROCESSING',
    completed = 'COMPLETED',
    aborted = 'ABORTED',
}

export const PocStatusTranslation: Record<PocStatus, string> = {
    [PocStatus.pending]: 'pending',
    [PocStatus.processing]: 'processing',
    [PocStatus.completed]: 'completed',
    [PocStatus.aborted]: 'aborted',
};

