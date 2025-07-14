
'use server';

import { Pool } from 'pg';
import type { UserProfile, Device, Room, Scene, Automation, NewDeviceData, NewAutomationData } from '@/context/app-state-context';

// Singleton pattern for the database connection pool
let pool: Pool | null = null;

function getDb() {
    if (!pool) {
        if (!process.env.POSTGRES_URL) {
            throw new Error("POSTGRES_URL environment variable is not set.");
        }
        pool = new Pool({
            connectionString: process.env.POSTGRES_URL,
        });
    }
    return pool;
}

// Initial data for seeding the database
const initialUsers: Omit<UserProfile, 'lastLogin'>[] = [
  { id: "1", name: "Admin User", email: "admin@example.com", role: "admin" },
  { id: "2", name: "Jane Doe", email: "jane.doe@example.com", role: "user" },
];

const initialDevices: Omit<Device, 'icon'>[] = [
  { id: '1', name: 'Living Room Lights', location: 'Living Room', iconName: 'Lightbulb', type: 'light', status: 'On', time: '2 min ago', active: true, statusVariant: 'default' },
  { id: '2', name: 'Kitchen Lights', location: 'Kitchen', iconName: 'Lamp', type: 'light', status: 'Off', time: '5 min ago', active: false, statusVariant: 'secondary' },
  { id: '3', name: 'Bedroom Lights', location: 'Bedroom', iconName: 'Lightbulb', type: 'light', status: 'On', time: '1 min ago', active: true, statusVariant: 'default' },
  { id: '4', name: 'Front Door Lock', location: 'Entrance', iconName: 'Lock', type: 'lock', status: 'Locked', time: '10 min ago', active: true, statusVariant: 'default' },
  { id: '5', name: 'Back Door Lock', location: 'Garden', iconName: 'Lock', type: 'lock', status: 'Unlocked', time: '15 min ago', active: false, statusVariant: 'destructive' },
  { id: '6', name: 'Security Camera 1', location: 'Living Room', iconName: 'Camera', type: 'camera', status: 'Recording', time: 'Just now', active: true, statusVariant: 'default' },
  { id: '7', name: 'Security Camera 2', location: 'Kitchen', iconName: 'Camera', type: 'camera', status: 'Recording', time: 'Just now', active: true, statusVariant: 'default' },
  { id: '8', name: 'Living Room AC', location: 'Living Room', iconName: 'AirVent', type: 'ac', status: 'Off', time: '30 min ago', active: false, statusVariant: 'secondary' },
  { id: '9', name: 'Bedroom AC', location: 'Bedroom', iconName: 'AirVent', type: 'ac', status: 'Cooling', time: '5 min ago', active: true, statusVariant: 'default' },
  { id: '10', name: 'Smart Smoke Detector', location: 'Kitchen', iconName: 'Wind', type: 'security', status: 'Online', time: 'Just now', active: true, statusVariant: 'default' },
];

const initialRooms: Pick<Room, 'name' | 'temp'>[] = [
    { name: "Living Room", temp: 22 },
    { name: "Kitchen", temp: 24 },
    { name: "Bedroom", temp: 20 },
    { name: "Entrance", temp: 23 },
];

const initialScenes: Omit<Scene, 'icon'>[] = [
  { id: '1', name: "Good Morning", description: "Gradually brighten lights and start your day." },
  { id: '2', name: "Movie Night", description: "Dim the lights and set the mood for a movie." },
  { id: '3', name: "Focus Time", description: "Bright, cool lighting to help you concentrate." },
  { id: '4', name: "Good Night", description: "Turn off all lights and secure the house." },
];

const initialAutomations: Omit<Automation, 'icon'>[] = [
  { id: '1', name: "Morning Routine", description: "Turn on lights when motion detected after 6 AM", trigger: "Motion + Time", action: "Turn on lights", status: "Active", lastRun: "This morning", active: true, },
  { id: '2', name: "Energy Saver", description: "Turn off lights when no motion for 10 minutes", trigger: "No motion", action: "Turn off lights", status: "Active", lastRun: "2 hours ago", active: true, },
  { id: '3', name: "Security Mode", description: "Lock doors and arm cameras at 11 PM", trigger: "11:00 PM", action: "Lock & Arm", status: "Paused", lastRun: "Yesterday", active: false, },
  { id: '4', name: "Climate Control", description: "Adjust temperature based on occupancy", trigger: "Occupancy change", action: "Adjust AC", status: "Active", lastRun: "1 hour ago", active: true, },
];

export async function initializeDb() {
    const db = getDb();
    const client = await db.connect();

    try {
        await client.query('BEGIN');

        // Create Tables
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT,
                email TEXT UNIQUE,
                role TEXT,
                lastLogin TIMESTAMPTZ
            );
            CREATE TABLE IF NOT EXISTS devices (
                id TEXT PRIMARY KEY,
                name TEXT,
                location TEXT,
                iconName TEXT,
                type TEXT,
                status TEXT,
                time TEXT,
                active BOOLEAN,
                statusVariant TEXT
            );
            CREATE TABLE IF NOT EXISTS rooms (
                name TEXT PRIMARY KEY,
                temp REAL
            );
            CREATE TABLE IF NOT EXISTS scenes (
                id TEXT PRIMARY KEY,
                name TEXT,
                iconName TEXT,
                description TEXT
            );
            CREATE TABLE IF NOT EXISTS automations (
                id TEXT PRIMARY KEY,
                iconName TEXT,
                name TEXT,
                description TEXT,
                trigger TEXT,
                action TEXT,
                status TEXT,
                lastRun TEXT,
                active BOOLEAN
            );
        `);

        // Seed Data
        const usersCountRes = await client.query('SELECT COUNT(*) as count FROM users');
        if (usersCountRes.rows[0].count === '0') {
            for (const user of initialUsers) {
                await client.query('INSERT INTO users (id, name, email, role, lastLogin) VALUES ($1, $2, $3, $4, $5)', [user.id, user.name, user.email, user.role, new Date()]);
            }
        }
        
        const devicesCountRes = await client.query('SELECT COUNT(*) as count FROM devices');
        if (devicesCountRes.rows[0].count === '0') {
            for (const device of initialDevices) {
                await client.query('INSERT INTO devices (id, name, location, iconName, type, status, time, active, statusVariant) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [device.id, device.name, device.location, device.iconName, device.type, device.status, device.time, device.active, device.statusVariant]);
            }
        }

        const roomsCountRes = await client.query('SELECT COUNT(*) as count FROM rooms');
        if (roomsCountRes.rows[0].count === '0') {
            for (const room of initialRooms) {
                await client.query('INSERT INTO rooms (name, temp) VALUES ($1, $2)', [room.name, room.temp]);
            }
        }

        const scenesCountRes = await client.query('SELECT COUNT(*) as count FROM scenes');
        if (scenesCountRes.rows[0].count === '0') {
            for (const scene of initialScenes) {
                await client.query('INSERT INTO scenes (id, name, iconName, description) VALUES ($1, $2, $3, $4)', [scene.id, scene.name, 'Sparkles', scene.description]);
            }
        }

        const automationsCountRes = await client.query('SELECT COUNT(*) as count FROM automations');
        if (automationsCountRes.rows[0].count === '0') {
            for (const automation of initialAutomations) {
                await client.query('INSERT INTO automations (id, iconName, name, description, trigger, action, status, lastRun, active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [automation.id, 'Zap', automation.name, automation.description, automation.trigger, automation.action, automation.status, automation.lastRun, automation.active]);
            }
        }

        await client.query('COMMIT');
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}

// User Actions
export async function db_getUsers() { return (await getDb().query('SELECT * FROM users')).rows; }
export async function db_updateUserRole(userId: string, role: 'admin' | 'user') { getDb().query('UPDATE users SET role = $1 WHERE id = $2', [role, userId]); }
export async function db_deleteUser(userId: string) { getDb().query('DELETE FROM users WHERE id = $1', [userId]); }
export async function db_getUserByEmail(email: string) { return (await getDb().query('SELECT * FROM users WHERE email = $1', [email])).rows[0]; }
export async function db_updateUserLoginTime(userId: string) { getDb().query('UPDATE users SET lastLogin = $1 WHERE id = $2', [new Date(), userId]); }

// Device Actions
export async function db_getDevices() { return (await getDb().query('SELECT * FROM devices')).rows; }
export async function db_getDevice(id: string) { return (await getDb().query('SELECT * FROM devices WHERE id = $1', [id])).rows[0]; }
export async function db_updateDevice(device: Partial<Device>) {
    const { id, ...fields } = device;
    const setClause = Object.keys(fields).map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = Object.values(fields);
    getDb().query(`UPDATE devices SET ${setClause} WHERE id = $${values.length + 1}`, [...values, id]);
}
export async function db_createDevice(data: NewDeviceData) {
    const newDevice = { ...data, id: crypto.randomUUID(), active: false, status: 'Off', statusVariant: 'secondary', time: 'Just now', iconName: data.type };
    getDb().query('INSERT INTO devices (id, name, location, iconName, type, status, time, active, statusVariant) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [newDevice.id, newDevice.name, newDevice.location, newDevice.iconName, newDevice.type, newDevice.status, newDevice.time, newDevice.active, newDevice.statusVariant]);
}
export async function db_deleteDevice(id: string) { getDb().query('DELETE FROM devices WHERE id = $1', [id]); }

// Room Actions
export async function db_getRoomsRaw() { return (await getDb().query('SELECT * FROM rooms')).rows; }
export async function db_createRoom(data: { name: string; temp: number }) { getDb().query('INSERT INTO rooms (name, temp) VALUES ($1, $2)', [data.name, data.temp]); }
export async function db_updateRoom(name: string, data: { name: string; temp: number }) { getDb().query('UPDATE rooms SET name = $1, temp = $2 WHERE name = $3', [data.name, data.temp, name]); }
export async function db_deleteRoom(name: string) { getDb().query('DELETE FROM rooms WHERE name = $1', [name]); }
export async function db_setAllLights(roomName: string, turnOn: boolean) {
    const status = turnOn ? 'On' : 'Off';
    const statusVariant = turnOn ? 'default' : 'secondary';
    getDb().query("UPDATE devices SET active = $1, status = $2, statusVariant = $3 WHERE location = $4 AND type = 'light'", [turnOn, status, statusVariant, roomName]);
}

// Scene Actions
export async function db_getScenes() { return (await getDb().query('SELECT * FROM scenes')).rows; }
export async function db_createScene(name: string, description: string) {
    const id = crypto.randomUUID();
    getDb().query("INSERT INTO scenes (id, name, description, iconName) VALUES ($1, $2, $3, $4)", [id, name, description, 'Sparkles']);
}
export async function db_updateScene(id: string, data: { name: string; description: string }) { getDb().query('UPDATE scenes SET name = $1, description = $2 WHERE id = $3', [data.name, data.description, id]); }
export async function db_deleteScene(id: string) { getDb().query('DELETE FROM scenes WHERE id = $1', [id]); }

// Automation Actions
export async function db_getAutomations() { return (await getDb().query('SELECT * FROM automations')).rows; }
export async function db_toggleAutomation(automationId: string, forceState?: boolean) {
    const res = await getDb().query('SELECT active FROM automations WHERE id = $1', [automationId]);
    if (res.rows.length === 0) return;
    const auto = res.rows[0];
    const newActiveState = forceState !== undefined ? forceState : !auto.active;
    const newStatus = newActiveState ? "Active" : "Paused";
    getDb().query('UPDATE automations SET active = $1, status = $2 WHERE id = $3', [newActiveState, newStatus, automationId]);
}
export async function db_createAutomation(data: NewAutomationData) {
    const newAutomation = { id: crypto.randomUUID(), ...data, iconName: 'Zap', active: true, status: 'Active', lastRun: 'Never' };
    getDb().query('INSERT INTO automations (id, name, description, trigger, action, iconName, active, status, lastRun) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [newAutomation.id, newAutomation.name, newAutomation.description, newAutomation.trigger, newAutomation.action, newAutomation.iconName, newAutomation.active, newAutomation.status, newAutomation.lastRun]);
}
export async function db_updateAutomation(id: string, data: Partial<NewAutomationData>) {
    const { ...fields } = data;
    const setClause = Object.keys(fields).map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = Object.values(fields);
    getDb().query(`UPDATE automations SET ${setClause} WHERE id = $${values.length + 1}`, [...values, id]);
}
export async function db_deleteAutomation(id: string) { getDb().query('DELETE FROM automations WHERE id = $1', [id]); }
