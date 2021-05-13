import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {

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
  }

  getLanguage() {
    return this.translate.currentLang;
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    this.cookieService.set('languageCookie', lang);
  }


}
