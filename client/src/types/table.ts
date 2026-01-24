export interface Table {
    id: string;
    tableCode: string;
    tableType: 'PHYSICAL' | 'CABIN' | 'OUTSIDE' | 'WALK_IN' | 'ONLINE';
}
