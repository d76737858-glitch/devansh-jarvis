import test from 'node:test'; import assert from 'node:assert/strict'; import { Planner } from '../packages/planner/src/planner.js';
const planner = new Planner();
test('planner creates a safe structured action', () => { const plan = planner.validate(planner.plan('Jarvis create a project called Demo')); assert.equal(plan.actions[0].tool, 'filesystem.create_directory'); assert.equal(plan.actions[0].permission, 'auto'); });
test('planner does not emit arbitrary shell commands', () => { const plan = planner.plan('run rm -rf /'); assert.equal(plan.actions.length, 0); });
