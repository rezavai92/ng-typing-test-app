import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  private mobileUserAgents: string[] = [
    'Android',
    'iPhone',
    'iPad',
    'iPod',
    'Opera Mini',
    'IEMobile',
    'BlackBerry',
    'webOS',
  ];

  constructor() {}

  isMobile(): boolean {
    const userAgent =
      navigator.userAgent || navigator.vendor || (window as any).opera;
    return this.mobileUserAgents.some((mobileAgent) =>
      userAgent.includes(mobileAgent)
    );
  }
}
