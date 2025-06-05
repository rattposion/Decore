export interface Collaborator {
  name: string;
  tested: number;
  cleaned: number;
  resetados: number;
  v9: number;
}

export interface Observations {
  issues: string;
  highlights: string;
  attentionPoints: string;
}

export interface Production {
  total: number;
  good: number;
  bad: number;
}

export interface Summary {
  totalEquipment: number;
  testedEquipment: number;
  cleanedEquipment: number;
  resetEquipment: number;
  v9Equipment: number;
  totalCollaborators: number;
  morningCollaborators: number;
  afternoonCollaborators: number;
}

export interface ReportData {
  header: {
    date: string;
    supervisor: string;
    unit: string;
  };
  morning: Collaborator[];
  afternoon: Collaborator[];
  observations: Observations;
  summary: Summary;
}