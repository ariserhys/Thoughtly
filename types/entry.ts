export interface Entry {
  id: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  isPinned: boolean;
}

export interface EntryCreate {
  content: string;
  tags?: string[];
}

export interface EntryUpdate {
  content?: string;
  tags?: string[];
  isPinned?: boolean;
}
