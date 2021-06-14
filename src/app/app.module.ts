import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializer } from './core/utils/app-init';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { sessionEndedInterceptorProvider } from './core/interceptors/session-ended';
import { IConfig, NgxMaskModule } from 'ngx-mask';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http);
}

export function maskConfigFunction(): Partial<IConfig> {
    return { validation: true };
}

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        TranslateModule.forRoot({
            defaultLanguage: 'de',
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
        CoreModule,
        SharedModule,
        AppRoutingModule,
        KeycloakAngularModule,
        NgxMaskModule.forRoot(maskConfigFunction),
        BrowserAnimationsModule,
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        {
            provide: APP_INITIALIZER,
            useFactory: initializer,
            multi: true,
            deps: [KeycloakService],
        },
        sessionEndedInterceptorProvider
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
