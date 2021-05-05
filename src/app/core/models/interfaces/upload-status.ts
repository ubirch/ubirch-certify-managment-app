import { UploadState } from '../enums/upload-state.enum';

export interface IUploadStatus {
    progress: number;
    state: UploadState;
    result?: any | null;
}
