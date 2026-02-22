import * as XLSX from 'xlsx';
import { Creator } from '@/types';

export const parseExcel = (file: File, onProgress?: (progress: number) => void): Promise<Creator[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onprogress = (e) => {
            if (e.lengthComputable && onProgress) {
                const percent = Math.round((e.loaded / e.total) * 50); // Reading is 50% of the work
                onProgress(percent);
            }
        };

        reader.onload = (e) => {
            try {
                if (onProgress) onProgress(60); // File read complete

                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });

                if (onProgress) onProgress(80); // Workbook parsed

                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet);

                if (jsonData.length === 0) {
                    throw new Error("El archivo Excel está vacío o no se pudieron leer las filas.");
                }

                // Validation: Check for critical columns in the first row
                const firstRow: any = jsonData[0];
                const requiredColumns = [
                    'ID del creador',
                    'Nombre de usuario del creador',
                    'Diamantes',
                    'Duración de LIVE'
                ];

                const missingColumns = requiredColumns.filter(col => !(col in firstRow));

                if (missingColumns.length > 0) {
                    throw new Error(`Faltan columnas obligatorias: ${missingColumns.join(', ')}. Por favor verifica el formato del archivo.`);
                }

                const creators: Creator[] = jsonData.map((row: any) => ({
                    period: row['Periodo de datos'] || '',
                    creatorId: String(row['ID del creador'] || ''),
                    username: row['Nombre de usuario del creador'] || 'Unknown',
                    group: row['Grupo'] || '',
                    agent: row['Agente'] || '',
                    joinTime: row['Hora de incorporación'] || '',
                    daysSinceJoin: Number(row['Días desde la incorporación']) || 0,

                    diamonds: Number(row['Diamantes']) || 0,
                    liveHours: parseDuration(row['Duración de LIVE']),
                    validDays: Number(row['Días válidos de emisiones LIVE']) || 0,
                    newFollowers: Number(row['Nuevos seguidores']) || 0,
                    liveSessions: Number(row['Emisiones LIVE']) || 0,

                    lastMonthDiamonds: Number(row['Diamantes en el último mes']) || 0,
                    lastMonthLiveHours: Number(row['Duración de emisiones LIVE (en horas) durante el último mes']) || 0,
                    lastMonthValidDays: Number(row['Días válidos de emisiones LIVE del mes pasado']) || 0,
                    lastMonthNewFollowers: Number(row['Nuevos seguidores en el último mes']) || 0,
                    lastMonthLiveSessions: Number(row['Emisiones LIVE en el último mes']) || 0,

                    diamondsAchieved: parsePercentage(row['Diamantes - Porcentaje logrado']),
                    liveHoursAchieved: parsePercentage(row['Duración de LIVE - Porcentaje logrado']),
                    validDaysAchieved: parsePercentage(row['Días válidos de emisiones LIVE - Porcentaje logrado']),
                    newFollowersAchieved: parsePercentage(row['Nuevos seguidores - Porcentaje logrado']),
                    liveSessionsAchieved: parsePercentage(row['Emisiones LIVE - Porcentaje logrado']),

                    diamondsGrowth: parsePercentage(row['Diamantes - frente al mes pasado']),
                    liveHoursGrowth: parsePercentage(row['Duración de LIVE - frente al mes pasado']),
                    validDaysGrowth: parsePercentage(row['Días válidos de emisiones LIVE - frente al mes pasado']),
                    newFollowersGrowth: parsePercentage(row['Nuevos seguidores - frente al mes pasado']),
                    liveSessionsGrowth: parsePercentage(row['Emisiones LIVE - frente al mes pasado']),

                    battles: Number(row['Partidas']) || 0,
                    battleDiamonds: Number(row['Diamantes de partidas']) || 0,
                    newLiveCreators: Number(row['Nuevos creadores LIVE']) || 0,
                    multiGuestDiamonds: Number(row['Diamantes del modo de varios invitados']) || 0,
                    multiGuestHostDiamonds: Number(row['Diamantes de varios invitados (como anfitrión)']) || 0,
                    multiGuestGuestDiamonds: Number(row['Diamantes del modo de varios invitados (como invitado)']) || 0,

                    baseDiamondsBeforeJoin: Number(row['Base de Diamantes antes de unirse']) || 0,
                    graduationStatus: row['Estado de graduación'] || '',
                }));

                if (onProgress) onProgress(100); // Done
                resolve(creators);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = (error) => reject(new Error("Error al leer el archivo."));
        reader.readAsBinaryString(file);
    });
};

const parseDuration = (value: any): number => {
    if (typeof value === 'number') return value * 24; // Excel stores time as fraction of day usually, but here it might be explicit. 
    // If it's just a number like 26.5, return it. If it's < 1 and > 0, likely a day fraction? 
    // Let's assume if it's a number it's hours if > 1, or check context. 
    // Actually, looking at screenshot, it's a string. If Excel parses it as number, it's usually days.
    // Safest is to handle string.

    if (typeof value === 'string') {
        value = value.trim();
        let hours = 0;
        let minutes = 0;
        let seconds = 0;

        const hMatch = value.match(/(\d+)\s*h/);
        const mMatch = value.match(/(\d+)\s*min/);
        const sMatch = value.match(/(\d+)\s*s/);

        if (hMatch) hours = parseInt(hMatch[1], 10);
        if (mMatch) minutes = parseInt(mMatch[1], 10);
        if (sMatch) seconds = parseInt(sMatch[1], 10);

        return hours + (minutes / 60) + (seconds / 3600);
    }
    return 0;
};

const parsePercentage = (value: any): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        return parseFloat(value.replace('%', '')) / 100;
    }
    return 0;
};
