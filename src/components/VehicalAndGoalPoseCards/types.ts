export interface SubParameter {
  label: string;
  value: string;
  required: boolean;
}

// Define types for parameters and their structure
export interface Parameter {
  label: string;
  pythonPath: string;
  subParameters: Record<string, SubParameter>;
}
