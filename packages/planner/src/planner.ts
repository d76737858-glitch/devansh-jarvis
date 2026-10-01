import { PlanSchema, type Plan } from '../../shared/src/contracts.js';

export class Planner {
  plan(message: string): Plan {
    const lower = message.toLowerCase();
    if (/what time|current time|time is it/.test(lower)) return { message: 'I will check the local system time.', actions: [{ tool: 'system.time', args: {}, permission: 'auto' }] };
    const project = message.match(/(?:project|folder)(?: called| named)?\s+["']?([\w -]+?)["']?(?:\s+in|\s*$)/i)?.[1]?.trim();
    if (project && /(create|make|new)/.test(lower)) return { message: `I will create the ${project} project folder in the trusted workspace.`, actions: [{ tool: 'filesystem.create_directory', args: { path: project }, permission: 'auto' }] };
    if (/list|show/.test(lower) && /(download|workspace|project|file)/.test(lower)) return { message: 'I will list files in the trusted workspace.', actions: [{ tool: 'filesystem.list', args: { path: '.' }, permission: 'auto' }] };
    return { message: 'I can help with that, but I need a supported action or a configured local AI model to make a safe plan.', actions: [] };
  }
  validate(plan: unknown) { return PlanSchema.parse(plan); }
}
