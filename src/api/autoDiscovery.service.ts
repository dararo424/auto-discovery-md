import { Injectable } from '@nestjs/common';
import * as arp from 'node-arp';
import fetch from 'node-fetch';
import { lookup } from 'dns';

@Injectable()
export class AutoDiscoveryService{
  /**
     * This function queries the connected devices in a range of IPs
     * startIp: Initial IP of the range
     * endIp: end of range ip
    */
    async findDevicesInRange(startIp: string, endIp: string): Promise<DeviceInfo[]> {
    
        //To determine the number of IP addresses to search, the last numbers of both the initial and final IP addresses are obtained.
        const startParts = startIp.split('.');
        const endParts = endIp.split('.');
        const start = parseInt(startParts[3]);
        const end = parseInt(endParts[3]);
        const devices: DeviceInfo[] = [];
        for (let i = start; i <= end; i++) {
          

          const ipAddress = `${startParts[0]}.${startParts[1]}.${startParts[2]}.${i}`;
    
          try {
            const macAddress = await this.getMacAddress(ipAddress);
            if (macAddress) {
              const manufacturerName = await this.getManufacturerName(macAddress);
              const manufacturerAddress = await this.getManufacturerAddress(macAddress);
              const hostName = await this.getHostname(ipAddress);
              devices.push({ ipAddress, macAddress, hostName, manufacturerName, manufacturerAddress });
            }
          } catch (error) {
            console.error(`there are no connected devices on the IP ${ipAddress}: ${error.message}`);
          }
        }
    
        return devices;
      }

      private getMacAddress(ipAddress: string): Promise<string | null> {
        return new Promise((resolve, reject) => {
          arp.getMAC(ipAddress, (err, macAddress) => {
            if (err) {
              reject(err);
            } else {
              resolve(macAddress || null);
            }
          });
        });
      }

      private async getManufacturerAddress(macAddress: string): Promise<string> {
        const headers = {
          Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImp0aSI6ImI4YWNhMzlkLTk5YWMtNDgyNi04YTE3LWFmOWVkZGIzMmU3ZiJ9.eyJpc3MiOiJtYWN2ZW5kb3JzIiwiYXVkIjoibWFjdmVuZG9ycyIsImp0aSI6ImI4YWNhMzlkLTk5YWMtNDgyNi04YTE3LWFmOWVkZGIzMmU3ZiIsImlhdCI6MTY4NzE4MTYxMCwiZXhwIjoyMDAxNjc3NjEwLCJzdWIiOiIxMzUwMiIsInR5cCI6ImFjY2VzcyJ9.FfSaDELhlHB7kemFCVCa3iNqSHFnYlToonpGdm_L8cyHxtZv7aXM0KTjCAebD38eysL1HTdTN4vyBOIoZ1nTVg`,
        };
      
        const response = await fetch(`https://api.macvendors.com/v1/lookup/${macAddress}`, { headers });
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        return data.data.organization_address;
      }

      private async getHostname(ipAddress: string): Promise<string> {
        return new Promise((resolve, reject) => {
          lookup(ipAddress, { all: false }, (err, hostname) => {
            if (err) {
              reject(err);
            } else {
              resolve(hostname);
            }
          });
        });
      }

      private async getManufacturerName(macAddress: string): Promise<string> {
        const headers = {
          Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImp0aSI6ImI4YWNhMzlkLTk5YWMtNDgyNi04YTE3LWFmOWVkZGIzMmU3ZiJ9.eyJpc3MiOiJtYWN2ZW5kb3JzIiwiYXVkIjoibWFjdmVuZG9ycyIsImp0aSI6ImI4YWNhMzlkLTk5YWMtNDgyNi04YTE3LWFmOWVkZGIzMmU3ZiIsImlhdCI6MTY4NzE4MTYxMCwiZXhwIjoyMDAxNjc3NjEwLCJzdWIiOiIxMzUwMiIsInR5cCI6ImFjY2VzcyJ9.FfSaDELhlHB7kemFCVCa3iNqSHFnYlToonpGdm_L8cyHxtZv7aXM0KTjCAebD38eysL1HTdTN4vyBOIoZ1nTVg`,
        };
      
        const response = await fetch(`https://api.macvendors.com/v1/lookup/${macAddress}`, { headers });
        const data = await response.json();
        
        if (data.error) {
          console.log(data.error);
          throw new Error(data.error);
        }
      
       
        return data.data.organization_name;
      }


}
export interface DeviceInfo {
    ipAddress: string;
    macAddress: string;
    hostName: string;
    manufacturerName: string;
    manufacturerAddress: string;
  }