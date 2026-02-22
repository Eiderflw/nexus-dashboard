const XLSX = require('xlsx');

const headers = [
    'Periodo de datos', 'ID del creador', 'Nombre de usuario del creador', 'Grupo', 'Agente',
    'Hora de incorporación', 'Días desde la incorporación',
    'Diamantes', 'Duración de LIVE', 'Días válidos de emisiones LIVE', 'Nuevos seguidores', 'Emisiones LIVE',
    'Diamantes en el último mes', 'Duración de emisiones LIVE (en horas) durante el último mes',
    'Días válidos de emisiones LIVE del mes pasado', 'Nuevos seguidores en el último mes', 'Emisiones LIVE en el último mes',
    'Diamantes - Porcentaje logrado', 'Duración de LIVE - Porcentaje logrado', 'Días válidos de emisiones LIVE - Porcentaje logrado',
    'Nuevos seguidores - Porcentaje logrado', 'Emisiones LIVE - Porcentaje logrado',
    'Diamantes - frente al mes pasado', 'Duración de LIVE - frente al mes pasado', 'Días válidos de emisiones LIVE - frente al mes pasado',
    'Nuevos seguidores - frente al mes pasado', 'Emisiones LIVE - frente al mes pasado',
    'Partidas', 'Diamantes de partidas', 'Nuevos creadores LIVE',
    'Diamantes del modo de varios invitados', 'Diamantes de varios invitados (como anfitrión)',
    'Diamantes del modo de varios invitados (como invitado)',
    'Base de Diamantes antes de unirse', 'Estado de graduación'
];

const data = [
    // Top Performer
    {
        'Periodo de datos': '2023-10-01~2023-10-31',
        'ID del creador': '1001',
        'Nombre de usuario del creador': 'StarGazer_99',
        'Grupo': 'Alpha',
        'Agente': 'Nexus One',
        'Hora de incorporación': '2023-01-15',
        'Días desde la incorporación': 280,
        'Diamantes': 500000,
        'Duración de LIVE': 120.5,
        'Días válidos de emisiones LIVE': 25,
        'Nuevos seguidores': 1500,
        'Emisiones LIVE': 30,
        'Diamantes en el último mes': 450000,
        'Diamantes - Porcentaje logrado': '110%',
        'Diamantes - frente al mes pasado': '11%',
        'Partidas': 50,
        'Diamantes de partidas': 200000,
        'Estado de graduación': 'Graduated'
    },
    // Rising Star
    {
        'Periodo de datos': '2023-10-01~2023-10-31',
        'ID del creador': '1002',
        'Nombre de usuario del creador': 'Newbie_King',
        'Grupo': 'Beta',
        'Agente': 'Nexus Two',
        'Hora de incorporación': '2023-09-20',
        'Días desde la incorporación': 40,
        'Diamantes': 80000,
        'Duración de LIVE': 60,
        'Días válidos de emisiones LIVE': 20,
        'Nuevos seguidores': 800,
        'Emisiones LIVE': 22,
        'Diamantes en el último mes': 10000,
        'Diamantes - Porcentaje logrado': '800%',
        'Diamantes - frente al mes pasado': '700%',
        'Partidas': 10,
        'Diamantes de partidas': 5000,
        'Estado de graduación': 'Active'
    },
    // At Risk (Slumping)
    {
        'Periodo de datos': '2023-10-01~2023-10-31',
        'ID del creador': '1003',
        'Nombre de usuario del creador': 'Lazy_Cat',
        'Grupo': 'Gamma',
        'Agente': 'Nexus One',
        'Hora de incorporación': '2023-05-10',
        'Días desde la incorporación': 160,
        'Diamantes': 5000,
        'Duración de LIVE': 10,
        'Días válidos de emisiones LIVE': 4,
        'Nuevos seguidores': 20,
        'Emisiones LIVE': 5,
        'Diamantes en el último mes': 50000,
        'Diamantes - Porcentaje logrado': '10%',
        'Diamantes - frente al mes pasado': '-90%',
        'Partidas': 0,
        'Diamantes de partidas': 0,
        'Estado de graduación': 'Probation'
    },
    // Standard Performer
    {
        'Periodo de datos': '2023-10-01~2023-10-31',
        'ID del creador': '1004',
        'Nombre de usuario del creador': 'Daily_Gamer',
        'Grupo': 'Delta',
        'Agente': 'Nexus Three',
        'Hora de incorporación': '2023-03-22',
        'Días desde la incorporación': 210,
        'Diamantes': 150000,
        'Duración de LIVE': 80,
        'Días válidos de emisiones LIVE': 22,
        'Nuevos seguidores': 300,
        'Emisiones LIVE': 24,
        'Diamantes en el último mes': 145000,
        'Diamantes - Porcentaje logrado': '100%',
        'Diamantes - frente al mes pasado': '3%',
        'Partidas': 20,
        'Diamantes de partidas': 50000,
        'Estado de graduación': 'Active'
    }
];

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(data, { header: headers });
XLSX.utils.book_append_sheet(wb, ws, "Hoja1");
XLSX.writeFile(wb, "sample_data.xlsx");
console.log("sample_data.xlsx created successfully.");
