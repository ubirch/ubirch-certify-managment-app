export interface RevocationBatch {
    id: string;
    kid: string;
    technicalExpiryDate: string;
    createdAt: string;
    numberOfRevocations: number;
}
