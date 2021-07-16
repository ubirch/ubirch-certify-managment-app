export enum EmployeeStatus {
    pending = 'PENDING',
    processing = 'PROCESSING',
    completed = 'COMPLETED',
    aborted = 'ABORTED',
}

export const EmployeeStatusTranslation: Record<EmployeeStatus, string> = {
    [EmployeeStatus.pending]: 'pending',
    [EmployeeStatus.processing]: 'processing',
    [EmployeeStatus.completed]: 'completed',
    [EmployeeStatus.aborted]: 'aborted',
};

