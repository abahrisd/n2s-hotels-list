// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    isDebug: true,
    wsUrl: 'wss://api.night2stay.com/api/v2/websocket',
    imagesHost: 'https://img1.night2stay.com',
    wsAuthenticate: { action: 'login', data: { key: '123123 ', wlcompany: 'CMPN223463HE' }, key: '4bd97223-9ad0-4261-821d-3e9ffc356e32', type: 'account' }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
