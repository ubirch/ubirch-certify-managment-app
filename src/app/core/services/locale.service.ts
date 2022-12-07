import { Injectable } from '@angular/core';

import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeEn from '@angular/common/locales/en';

import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { DateTimeLocaleFormat } from '../models/enums/date-time-locale-format.enum';
import { IBirthDate } from '../models/interfaces/birth-date.interface';
import { ILocale } from '../models/interfaces/locale.interface';

registerLocaleData(localeDe, 'de');
registerLocaleData(localeEn, 'en');

const LOCALES: { [key: string]: ILocale } = {
  en: {
    language: 'en',
      dateFormat: DateTimeLocaleFormat.enDisplayShort,
      dateFormatLong: DateTimeLocaleFormat.enDisplayLong,
      dateFormat4Moment: DateTimeLocaleFormat.enMomentDisplayShort,
      dateFormatLong4Moment: DateTimeLocaleFormat.enMomentDisplayLong,
      datePlaceholder: DateTimeLocaleFormat.enDisplayShortPlaceholder,
  } as ILocale,
  de: {
    language: 'de',
      dateFormat: DateTimeLocaleFormat.deDisplayShort,
      dateFormatLong: DateTimeLocaleFormat.deDisplayLong,
      dateFormat4Moment: DateTimeLocaleFormat.deMomentDisplayShort,
      dateFormatLong4Moment: DateTimeLocaleFormat.deMomentDisplayLong,
      datePlaceholder: DateTimeLocaleFormat.deDisplayShortPlaceholder
  } as ILocale,
};

@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  private currentLocale$ = new BehaviorSubject<ILocale>(LOCALES.de);
  public current$ = this.currentLocale$.asObservable();

  constructor(
    private translate: TranslateService,
    private cookieService: CookieService
  ) {
    const defaultLang = 'de';
    translate.addLangs(['en', 'de']);
    translate.setDefaultLang(defaultLang);

    const languageCookie = cookieService.get('languageCookie');

    if (!languageCookie) {
      translate.use(defaultLang);
      const browserLang = translate.getBrowserLang();
      if (translate.langs.includes(browserLang)) {
        translate.use(browserLang);
      } else {
        translate.use(translate.defaultLang);
      }
    } else {
      this.translate.use(languageCookie);
    }

    this.changeLocale(languageCookie || defaultLang);
  }

  getLanguage() {
    return this.translate.currentLang;
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    this.cookieService.set('languageCookie', lang);
    this.changeLocale(lang);
  }

  changeLocale(lang: string) {
    this.currentLocale$.next(LOCALES[lang]);
  }

  toLocaleBirthDate(date: IBirthDate) {
    const birthDate: Date = new Date(date.year, date.month - 1, date.day);
    return birthDate.toLocaleDateString(this.getLanguage());
  }


}
