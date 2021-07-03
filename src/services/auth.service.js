"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var oidc_client = require("oidc-client");
var AuthService = /** @class */ (function () {
    function AuthService() {
        var STS_DOMAIN = process.env.VUE_APP_STS_DOMAIN || 'https://localhost:5001';
        var APP_DOMAIN = process.env.VUE_APP_DOMAIN || 'http://localhost:8080';
        var settings = {
            userStore: new oidc_client.WebStorageStateStore({ store: window.localStorage }),
            authority: STS_DOMAIN,
            client_id: 'eMarker',
            redirect_uri: `${APP_DOMAIN}/callback.html`,
            automaticSilentRenew: true,
            silent_redirect_uri: `${APP_DOMAIN}/silent-renew.html`,
            response_type: 'code',
            scope: 'openid profile email',
            post_logout_redirect_uri: APP_DOMAIN,
            filterProtocolClaims: true,
        };
        this.userManager = new oidc_client.UserManager(settings);
    }
    AuthService.prototype.getUser = function () {
        return this.userManager.getUser();
    };
    AuthService.prototype.removeUser = function () {
        return this.userManager.removeUser();
    };
    AuthService.prototype.signinSilent = function () {
        return this.userManager.signinSilent();
    };
    AuthService.prototype.login = function () {
        return this.userManager.signinRedirect();
    };
    AuthService.prototype.logout = function () {
        return this.userManager.signoutRedirect();
    };
    AuthService.prototype.getAccessToken = function () {
        return this.userManager.getUser().then(function (data) {
            return data.access_token;
        });
    };
    return AuthService;
}());
exports.default = AuthService;
