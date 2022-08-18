import { NotificationType } from '../enums/notification-type.enum';

export interface INotification {
    message: string;
    revocationMessage?: string[];
    title?: string;
    duration?: number;
    type?: NotificationType;
}
