import { DateTimeLocaleFormat } from '../enums/date-time-locale-format.enum';

export interface ILocale {
    language: string;
    dateFormat: DateTimeLocaleFormat;
    dateFormatLong: DateTimeLocaleFormat;
    datePlaceholder: string;
}
