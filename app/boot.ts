import {bootstrap} from 'angular2/platform/browser'
import {provide} from 'angular2/core';
import {App} from './app'
import {ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_PROVIDERS, BaseRequestOptions, RequestOptions, Headers} from 'angular2/http';
import {BackendService} from './services/backend';
import {AuthenticationService} from './services/authentication';

class HttpOptions extends BaseRequestOptions {
}

bootstrap(App, [ROUTER_PROVIDERS, HTTP_PROVIDERS,provide(RequestOptions, {useClass: HttpOptions}) , BackendService, AuthenticationService]);
