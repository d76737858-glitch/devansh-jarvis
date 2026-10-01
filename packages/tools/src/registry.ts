import { z } from 'zod';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { Tool } from '../../shared/src/contracts.js';

const safeRelative = z.object({ path: z.string().min(1).max(500) }).strict();
export function createTools(root: string): Tool[] {
  const resolve = (p: string) => { const full = path.resolve(root, p); if (full !== root && !full.startsWith(root + path.sep)) throw new Error('Path is outside the trusted workspace'); return full; };
  return [
    { name: 'system.time', description: 'Read local system time', permission: 'auto', risk: 'low', input: z.object({}).strict(), async execute: async () => ({ time: new Date().toISOString() }), verify: async (_, r) => Boolean((r as any).time) },
    { name: 'filesystem.list', description: 'List entries in a trusted directory', permission: 'auto', risk: 'low', input: safeRelative, async execute: async (a) => ({ path: a.path, entries: await fs.readdir(resolve(a.path), { withFileTypes: true }).then(es => es.map(e => ({ name: e.name, directory: e.isDirectory() }))) }) },
    { name: 'filesystem.create_directory', description: 'Create a directory in the trusted workspace', permission: 'auto', risk: 'low', input: safeRelative, async execute: async (a) => { const target = resolve(a.path); await fs.mkdir(target, { recursive: false }); return { path: target, created: true }; }, verify: async (a) => { try { return (await fs.stat(resolve(a.path))).isDirectory(); } catch { return false; } } },
  ];
}
