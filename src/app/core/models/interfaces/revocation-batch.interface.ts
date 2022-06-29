export interface RevocationBatch {
    id: string;
    kid: string;
    technicalExpiryDate: string;
    createdAt: string;
    deleted: boolean;
    deletedAt: string;
    numberOfRevocations: number;
}
