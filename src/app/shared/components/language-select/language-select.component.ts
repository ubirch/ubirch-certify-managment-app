import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocaleService } from 'src/app/core/services/locale.service';

@Component({
  selector: 'app-language-select',
  templateUrl: './language-select.component.html',
  styleUrls: ['./language-select.component.scss'],
})
export class LanguageSelectComponent implements OnInit {

  languages: string[] = [];

  constructor(
    private languageService: LocaleService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.languages = this.translateService.getLangs();
  }

  get language() { return this.languageService.getLanguage(); }

  setLanguage(lang: string) {
    this.languageService.changeLanguage(lang);
  }

}
