
'use server';

import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import type { UserProfile, Device, Room, Scene, Automation, NewDeviceData, NewAutomationData } from '@/context/app-state-context';

// Singleton pattern for the database connection
let db = null;

async function getDb() {
    if (!db) {
        db = await open({
            filename: './database.db',
            driver: sqlite3.Database,
        });
    }
    return db;
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
    const db = await getDb();
    
    // Create Tables
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT,
            email TEXT UNIQUE,
            role TEXT,
            lastLogin TEXT
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
    const usersCount = await db.get('SELECT COUNT(*) as count FROM users');
    if (usersCount.count === 0) {
        const stmt = await db.prepare('INSERT INTO users (id, name, email, role, lastLogin) VALUES (?, ?, ?, ?, ?)');
        for (const user of initialUsers) {
            await stmt.run(user.id, user.name, user.email, user.role, new Date().toISOString());
        }
        await stmt.finalize();
    }
    
    const devicesCount = await db.get('SELECT COUNT(*) as count FROM devices');
    if (devicesCount.count === 0) {
        const stmt = await db.prepare('INSERT INTO devices (id, name, location, iconName, type, status, time, active, statusVariant) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        for (const device of initialDevices) {
            await stmt.run(device.id, device.name, device.location, device.iconName, device.type, device.status, device.time, device.active, device.statusVariant);
        }
        await stmt.finalize();
    }

    const roomsCount = await db.get('SELECT COUNT(*) as count FROM rooms');
    if (roomsCount.count === 0) {
        const stmt = await db.prepare('INSERT INTO rooms (name, temp) VALUES (?, ?)');
        for (const room of initialRooms) {
            await stmt.run(room.name, room.temp);
        }
        await stmt.finalize();
    }

    const scenesCount = await db.get('SELECT COUNT(*) as count FROM scenes');
    if (scenesCount.count === 0) {
        const stmt = await db.prepare('INSERT INTO scenes (id, name, iconName, description) VALUES (?, ?, ?, ?)');
        for (const scene of initialScenes) {
            await stmt.run(scene.id, scene.name, 'Sparkles', scene.description);
        }
        await stmt.finalize();
    }

    const automationsCount = await db.get('SELECT COUNT(*) as count FROM automations');
    if (automationsCount.count === 0) {
        const stmt = await db.prepare('INSERT INTO automations (id, iconName, name, description, trigger, action, status, lastRun, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        for (const automation of initialAutomations) {
            await stmt.run(automation.id, 'Zap', automation.name, automation.description, automation.trigger, automation.action, automation.status, automation.lastRun, automation.active);
        }
        await stmt.finalize();
    }
}

// User Actions
export async function db_getUsers() { return (await getDb()).all('SELECT * FROM users'); }
export async function db_updateUserRole(userId: string, role: 'admin' | 'user') { await (await getDb()).run('UPDATE users SET role = ? WHERE id = ?', role, userId); }
export async function db_deleteUser(userId: string) { await (await getDb()).run('DELETE FROM users WHERE id = ?', userId); }
export async function db_getUserByEmail(email: string) { return (await getDb()).get('SELECT * FROM users WHERE email = ?', email); }
export async function db_updateUserLoginTime(userId: string) { await (await getDb()).run('UPDATE users SET lastLogin = ? WHERE id = ?', new Date().toISOString(), userId); }

// Device Actions
export async function db_getDevices() { return (await getDb()).all('SELECT * FROM devices'); }
export async function db_getDevice(id: string) { return (await getDb()).get('SELECT * FROM devices WHERE id = ?', id); }
export async function db_updateDevice(device: Partial<Device>) {
    const { id, ...fields } = device;
    const setClause = Object.keys(fields).map(key => `${key} = ?`).join(', ');
    const values = Object.values(fields);
    await (await getDb()).run(`UPDATE devices SET ${setClause} WHERE id = ?`, ...values, id);
}
export async function db_createDevice(data: NewDeviceData) {
    const newDevice = { ...data, id: crypto.randomUUID(), active: false, status: 'Off', statusVariant: 'secondary', time: 'Just now', iconName: data.type };
    await (await getDb()).run('INSERT INTO devices (id, name, location, iconName, type, status, time, active, statusVariant) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', newDevice.id, newDevice.name, newDevice.location, newDevice.iconName, newDevice.type, newDevice.status, newDevice.time, newDevice.active, newDevice.statusVariant);
}
export async function db_deleteDevice(id: string) { await (await getDb()).run('DELETE FROM devices WHERE id = ?', id); }

// Room Actions
export async function db_getRoomsRaw() { return (await getDb()).all('SELECT * FROM rooms'); }
export async function db_createRoom(data: { name: string; temp: number }) { await (await getDb()).run('INSERT INTO rooms (name, temp) VALUES (?, ?)', data.name, data.temp); }
export async function db_updateRoom(name: string, data: { name: string; temp: number }) { await (await getDb()).run('UPDATE rooms SET name = ?, temp = ? WHERE name = ?', data.name, data.temp, name); }
export async function db_deleteRoom(name: string) { await (await getDb()).run('DELETE FROM rooms WHERE name = ?', name); }
export async function db_setAllLights(roomName: string, turnOn: boolean) {
    const status = turnOn ? 'On' : 'Off';
    const statusVariant = turnOn ? 'default' : 'secondary';
    await (await getDb()).run("UPDATE devices SET active = ?, status = ?, statusVariant = ? WHERE location = ? AND type = 'light'", turnOn, status, statusVariant, roomName);
}

// Scene Actions
export async function db_getScenes() { return (await getDb()).all('SELECT * FROM scenes'); }
export async function db_createScene(name: string, description: string) {
    const id = crypto.randomUUID();
    await (await getDb()).run("INSERT INTO scenes (id, name, description, iconName) VALUES (?, ?, ?, ?)", id, name, description, 'Sparkles');
}
export async function db_updateScene(id: string, data: { name: string; description: string }) { await (await getDb()).run('UPDATE scenes SET name = ?, description = ? WHERE id = ?', data.name, data.description, id); }
export async function db_deleteScene(id: string) { await (await getDb()).run('DELETE FROM scenes WHERE id = ?', id); }

// Automation Actions
export async function db_getAutomations() { return (await getDb()).all('SELECT * FROM automations'); }
export async function db_toggleAutomation(automationId: string, forceState?: boolean) {
    const auto = await (await getDb()).get('SELECT active FROM automations WHERE id = ?', automationId);
    if (!auto) return;
    const newActiveState = forceState !== undefined ? forceState : !auto.active;
    const newStatus = newActiveState ? "Active" : "Paused";
    await (await getDb()).run('UPDATE automations SET active = ?, status = ? WHERE id = ?', newActiveState, newStatus, automationId);
}
export async function db_createAutomation(data: NewAutomationData) {
    const newAutomation = { id: crypto.randomUUID(), ...data, iconName: 'Zap', active: true, status: 'Active', lastRun: 'Never' };
    await (await getDb()).run('INSERT INTO automations (id, name, description, trigger, action, iconName, active, status, lastRun) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', newAutomation.id, newAutomation.name, newAutomation.description, newAutomation.trigger, newAutomation.action, newAutomation.iconName, newAutomation.active, newAutomation.status, newAutomation.lastRun);
}
export async function db_updateAutomation(id: string, data: Partial<NewAutomationData>) {
    const { ...fields } = data;
    const setClause = Object.keys(fields).map(key => `${key} = ?`).join(', ');
    const values = Object.values(fields);
    await (await getDb()).run(`UPDATE automations SET ${setClause} WHERE id = ?`, ...values, id);
}
export async function db_deleteAutomation(id: string) { await (await getDb()).run('DELETE FROM automations WHERE id = ?', id); }
