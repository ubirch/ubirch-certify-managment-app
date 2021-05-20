export enum EmployeeStatus {
    pending = 'PENDING',
    processing = 'PROCESSING',
    completed = 'COMPLETED'
}

export const EmployeeStatusTranslation: Record<EmployeeStatus, string> = {
    [EmployeeStatus.pending]: 'pending',
    [EmployeeStatus.processing]: 'processing',
    [EmployeeStatus.completed]: 'completed',
};

