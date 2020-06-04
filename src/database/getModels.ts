import { openDB } from '../openDB';

export interface CarModel {
    details: string;
    fuelType: string;
    id: number;
    kilometers: number;
    make: string;
    model: string;
    photoUrl: string;
    price: number;
    year: number;
    count: number;
}

export async function getModels(make: string) {
    const db = await openDB();
    const model = await db.all<CarModel[]>(`
        SELECT model, count(*) as count
        FROM car
        WHERE make = @make
        GROUP BY model
    `, { '@make': make });
    return model;
}