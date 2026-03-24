import { Vehicle } from '../types';
import { mockVehicles } from '../data/mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class VehicleService {
  private vehicles: Vehicle[] = [...mockVehicles];

  async getVehicleById(vehicleId: string): Promise<Vehicle | null> {
    await delay(150);
    return this.vehicles.find(vehicle => vehicle.id === vehicleId) || null;
  }

  async getAllVehicles(): Promise<Vehicle[]> {
    await delay(200);
    return this.vehicles;
  }
}

export const vehicleService = new VehicleService();
