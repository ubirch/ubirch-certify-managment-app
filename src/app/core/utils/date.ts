import * as moment from 'moment';
import { IBirthDate } from '../models/interfaces/birth-date.interface';
import {ILocale} from "../models/interfaces/locale.interface";

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
