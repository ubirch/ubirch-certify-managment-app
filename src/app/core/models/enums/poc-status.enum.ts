export enum PocStatus {
    pending = 'PENDING',
    processing = 'PROCESSING',
    completed = 'COMPLETED'
}

export const PocStatusTranslation: Record<PocStatus, string> = {
    [PocStatus.pending]: 'pending',
    [PocStatus.processing]: 'processing',
    [PocStatus.completed]: 'completed',
};

