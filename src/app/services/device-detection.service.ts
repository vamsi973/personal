import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeviceDetectionService {
  url: string = environment.apiUrl;
  deviceType: string = '';
  deviceInfo: string = '';
  constructor(
    private http: HttpClient,

  ) { }

  checkIsMobile(): boolean {
    return /android|webos|iphone|ipad|ipod|blackberry|windows phone/.test(
      navigator.userAgent.toLowerCase()
    ) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }


  isIos() {
    let objAgent = navigator.userAgent;
    const iPadOS13Up = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    let objfullVersion = '' + parseFloat(navigator.appVersion);
    let objOffsetVersion;
    if ((objOffsetVersion = objAgent.indexOf("Safari")) != -1) {
      objfullVersion = objAgent.substring(objOffsetVersion + 7, objOffsetVersion + 13);

      if ((objOffsetVersion = objAgent.indexOf("Version")) != -1)
        objfullVersion = objAgent.substring(objOffsetVersion + 8, objOffsetVersion + 14);
    }
    if (/iphone|ipad|ipod|ios/i.test(
      navigator.userAgent.toLowerCase()
    ) || iPadOS13Up) {

    }
    return /iphone|ipad|ipod|ios/i.test(
      navigator.userAgent.toLowerCase()
    ) || iPadOS13Up;
  }
  detectDevice() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;

    if (/iPad|iPhone|iPod/.test(userAgent) && !navigator.maxTouchPoints) {
      this.deviceType = 'iOS Device';
    } else if (/Android/.test(userAgent) && navigator.maxTouchPoints) {
      this.deviceType = 'Android Device';
    } else if (/Win/.test(platform)) {
      this.deviceType = 'Windows Desktop';
    } else if (/Mac/.test(platform)) {
      this.deviceType = 'Mac Desktop';
    } else if (/Linux/.test(platform)) {
      this.deviceType = 'Linux Desktop';
    } else {
      this.deviceType = 'Unknown';
    }
    // console.log(`%c  Device Type: ${this.deviceType}`, 'background: #C4DFDF;, color: #bada55');
    // console.log(`%c   User Agent: ${userAgent}`, 'background: #73A9AD;, color: #bada55');
    // console.log(`%c  Platform: ${platform}`, 'background: #C88EA7;, color: #bada55');
    return this.deviceType
  }

  isAndroid(): boolean {
    const userAgent = navigator.userAgent;
    return userAgent.includes('Android');
  }

  getIP() {
    return this.http.get('https://api.ipify.org/?format=json')
  }
  getDetailedIP() {
    return this.http.get('http://ip-api.com/json/?fields=61439')
  }

  insertData(data: any) {
    return this.http.post(this.url + '/device', data)
  }
}
