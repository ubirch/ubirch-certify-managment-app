import * as moment from 'moment';
import { IBirthDate } from '../models/interfaces/birth-date.interface';
import {ILocale} from "../models/interfaces/locale.interface";
import {EXPIRED_THRESHOLD, URGENT_THRESHOLD, VERY_URGENT_THRESHOLD} from "./constants";
import {CERTURGENCY} from "../models/enums/certUrgency.enum";

export const getFormatedBirthDate = (dob: IBirthDate) => {
    const date = new Date(dob.year, dob.month - 1, dob.day);
    return moment(date).format('YYYY-MM-DD');
};

export const birthDateFromString = (dobStr: string): IBirthDate => {
    const date = new Date(dobStr);
    if (date instanceof Date) {
        return {
            day: date.getDate(),
            month: date.getMonth() + 1,
            year: date.getFullYear()
        };
    }
    throw new Error('Incorrect birth date');
};

export const getFormatedDateTime = (date: Date, locale: ILocale) => {
    return moment(date).format(locale.dateFormatLong4Moment);
};

export const getCertUrgency = (expirationDate: Date) => {
    let today = new Date();

    let timeDiff = expirationDate.getTime() - today.getTime();

    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (diffDays <= EXPIRED_THRESHOLD) {
        return CERTURGENCY.EXPIRED;
    }

    if (diffDays <= VERY_URGENT_THRESHOLD) {
        return CERTURGENCY.VERYURGENT;
    }

    if (diffDays <= URGENT_THRESHOLD) {
        return CERTURGENCY.URGENT;
    }

    return CERTURGENCY.NONE;
}
