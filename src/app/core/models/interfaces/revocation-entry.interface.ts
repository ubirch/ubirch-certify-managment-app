export interface RevocationEntry {
    batchId?: string;
    issuingCountry: string;
    createdAt: string;
    dateOfIssue: string;
    kid: string;
    technicalExpiryDate: string;
    rValueSignature: string;
    transactionNumber: string;
    updatedAt: string;
}
