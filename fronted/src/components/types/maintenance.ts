export interface Component {
    id: number;
    name: string;
  }
  
  export interface Activity {
    id: number;
    name: string;
    components: Component[];
  }
  
  export interface Equipment {
    id: number;
    name: string;
    type: string;
    assetType: string;
  }
  
  export interface Maintenance {
    id: number;
    code: string;
    type: 'Interno' | 'Externo';
    startDate: string;
    endDate: string;
    equipment: Equipment;
    activities: Activity[];
    performedBy: string;
    importantNotes: string;
  }
  
  export interface ChartData {
    name: string;
    value: number;
  }
  
  export interface MaintenanceHistory {
    equipmentId: number;
    equipmentName: string;
    maintenanceCount: number;
  }
  
  