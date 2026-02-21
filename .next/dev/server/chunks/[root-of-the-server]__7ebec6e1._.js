module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/nexus-dashboard/lib/history.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "compareSnapshots",
    ()=>compareSnapshots,
    "getSnapshotKey",
    ()=>getSnapshotKey
]);
const getSnapshotKey = (date = new Date())=>{
    return date.toISOString().split('T')[0];
};
const compareSnapshots = (prev, current)=>{
    const prevMap = new Map(prev.map((c)=>[
            c.creatorId,
            c
        ]));
    const currMap = new Map(current.map((c)=>[
            c.creatorId,
            c
        ]));
    const newCreators = current.filter((c)=>!prevMap.has(c.creatorId));
    const lostCreators = prev.filter((c)=>!currMap.has(c.creatorId));
    const growth = current.filter((c)=>prevMap.has(c.creatorId)).map((curr)=>{
        const prev = prevMap.get(curr.creatorId);
        return {
            creatorId: curr.creatorId,
            username: curr.username,
            diamondDelta: curr.diamonds - prev.diamonds,
            hourDelta: curr.liveHours - prev.liveHours
        };
    }).sort((a, b)=>b.diamondDelta - a.diamondDelta); // Biggest winners first
    return {
        dateA: 'Previous',
        dateB: 'Current',
        newCreators,
        lostCreators,
        growth
    };
};
}),
"[project]/nexus-dashboard/app/api/history/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nexus-dashboard/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$lib$2f$history$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nexus-dashboard/lib/history.ts [app-route] (ecmascript)");
;
;
;
;
const HISTORY_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'data', 'history');
// Ensure directory exists
if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(HISTORY_DIR)) {
    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(HISTORY_DIR, {
        recursive: true
    });
}
async function POST(req) {
    try {
        const body = await req.json();
        const { creators, date } = body; // date is optional override
        if (!creators || !Array.isArray(creators)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid data'
            }, {
                status: 400
            });
        }
        const snapshotDate = date || (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$lib$2f$history$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSnapshotKey"])();
        const filePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(HISTORY_DIR, `${snapshotDate}.json`);
        const snapshot = {
            date: snapshotDate,
            timestamp: Date.now(),
            creators: creators,
            metrics: {
                totalDiamonds: creators.reduce((sum, c)=>sum + (c.diamonds || 0), 0),
                totalHours: creators.reduce((sum, c)=>sum + (c.liveHours || 0), 0),
                activeCreators: creators.filter((c)=>c.validDays > 0).length
            }
        };
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(filePath, JSON.stringify(snapshot, null, 2));
        return __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            date: snapshotDate
        });
    } catch (err) {
        console.error('Failed to save snapshot:', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal Server Error'
        }, {
            status: 500
        });
    }
}
async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const date = searchParams.get('date');
        if (date) {
            // Get specific snapshot
            const filePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(HISTORY_DIR, `${date}.json`);
            if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(filePath)) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Snapshot not found'
                }, {
                    status: 404
                });
            }
            const fileContent = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(filePath, 'utf-8');
            return __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(JSON.parse(fileContent));
        } else {
            // List all snapshots
            const files = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readdirSync(HISTORY_DIR).filter((f)=>f.endsWith('.json')).sort().reverse(); // Newest first
            const snapshots = files.map((f)=>{
                const content = JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(HISTORY_DIR, f), 'utf-8'));
                return {
                    date: content.date,
                    timestamp: content.timestamp,
                    metrics: content.metrics
                };
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                snapshots
            });
        }
    } catch (err) {
        console.error('Failed to list snapshots:', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal Server Error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7ebec6e1._.js.map