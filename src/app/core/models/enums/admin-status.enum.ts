export enum AdminStatus {
    pending = 'PENDING',
    processing = 'PROCESSING',
    completed = 'COMPLETED'
}

export const AdminStatusTranslation: Record<AdminStatus, string> = {
    [AdminStatus.pending]: 'pending',
    [AdminStatus.processing]: 'processing',
    [AdminStatus.completed]: 'completed',
};

