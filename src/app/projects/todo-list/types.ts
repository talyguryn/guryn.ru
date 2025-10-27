export interface Step {
  text: string;
  isDone: boolean;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  steps: Step[];
  createdAt: number;
  updatedAt: number;
}
