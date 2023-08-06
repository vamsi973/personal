import { Component } from '@angular/core';
import { DeviceDetectionService } from './services/device-detection.service';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'personal';
  ipAddress:any = {};
  ipData: any = {};
  deviceInfoData = {};

  dateFromObjectId(objectId: any) {
    objectId = objectId.target.value;
    console.log(new Date(parseInt(objectId.substring(0, 8), 16) * 1000));
    return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
  };
  constructor(
    private deviceDetailed: DeviceDetectionService
  ) {




  }
  ngOnInit() {
    const ipAddress$ = this.deviceDetailed.getIP();
    const ipData$ = this.deviceDetailed.getDetailedIP();

    // Combine the observables to wait for both requests to complete
    forkJoin([ipAddress$, ipData$]).subscribe(([ipAddress, ipData]) => {
      console.log(ipAddress,345)
      // this.ipAddress = ipAddressData['ip'];
      this.ipData = ipData;

      // Populate deviceInfoData with the received data
      this.deviceInfoData = {
        deviceName: this.deviceDetailed.detectDevice(),
        mobile: this.deviceDetailed.checkIsMobile(),
        ios: this.deviceDetailed.isIos(),
        android: this.deviceDetailed.isAndroid(),
        ipInfo: this.ipData,
        ipAddres: this.ipAddress.ip,
      };

      // Submit the data to the backend
      this.deviceDetailed.insertData(this.deviceInfoData).subscribe((data) => {
        console.log(data, 'Data submitted successfully to the backend');
      });
    });
  }

}
