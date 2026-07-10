import type { TaskStatus } from '../types';

export interface KanbanColumnConfig {
  id: TaskStatus;
  label: string;
  color: string;       // color del encabezado
  bgColor: string;     // fondo de la columna
}

export const KANBAN_COLUMNS: KanbanColumnConfig[] = [
  { id: 'TODO',        label: 'Por hacer',   color: 'bg-slate-500',   bgColor: 'bg-slate-50' },
  { id: 'IN_PROGRESS', label: 'En progreso', color: 'bg-blue-500',    bgColor: 'bg-blue-50'  },
  { id: 'DONE',        label: 'Completado',  color: 'bg-emerald-500', bgColor: 'bg-emerald-50' },
  { id: 'CANCELLED',   label: 'Cancelado',   color: 'bg-red-400',     bgColor: 'bg-red-50'   },
];
