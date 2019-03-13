//Change this to whatever graphql API you're using for the dev environment
export const DEV_API = 'http://localhost:4000/graphql';

//This is whatever will be the graphql API you're tying into at production
export const API = 'https://admin.example.com';

//Main app colors to be used in components. PRO TIP: If you can't come up with a good color scheme go to http://colormind.io
export const COLORS = {
    SS_GRAY = '#474c4b',
    SS_BLUEGREEN = '#18a27c',
    SS_NAVY = '#1d2a41',
    SS_YELLOWGREEN = '#5eda49',
    SS_LIGHTGREEN = '#2cc35a'
}

export const HOST = 'www.example.com';

//Right now with WPGraphQl, there isn't an easy to convert repeater fields to be json ready 
export function convertACFToJSON(obj) {
    if(obj.hasOwnProperty('acf') && typeof obj.acf === 'string') {
        obj.acf = JSON.parse(obj.acf);
    }
}