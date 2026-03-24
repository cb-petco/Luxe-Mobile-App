import { Driver } from '../types';
import { mockDrivers } from '../data/mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class DriverService {
  private drivers: Driver[] = [...mockDrivers];

  async getDriverById(driverId: string): Promise<Driver | null> {
    await delay(200);
    return this.drivers.find(driver => driver.id === driverId) || null;
  }

  async updateAvailability(driverId: string, available: boolean): Promise<Driver> {
    await delay(300);

    const driver = this.drivers.find(d => d.id === driverId);
    if (!driver) {
      throw new Error('Driver not found');
    }

    driver.available = available;
    return driver;
  }

  async getAllDrivers(): Promise<Driver[]> {
    await delay(200);
    return this.drivers;
  }
}

export const driverService = new DriverService();
