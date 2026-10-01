import type { Action, Tool } from '../../shared/src/contracts.js';
export class ToolRegistry {
  private tools = new Map<string, Tool>();
  register(tool: Tool) { if (this.tools.has(tool.name)) throw new Error(`Duplicate tool: ${tool.name}`); this.tools.set(tool.name, tool); }
  get(name: string) { return this.tools.get(name); }
  list() { return [...this.tools.values()].map(({ name, description, permission, risk }) => ({ name, description, permission, risk })); }
  validateAction(action: Action) { const tool = this.get(action.tool); if (!tool) throw new Error(`Unknown tool: ${action.tool}`); tool.input.parse(action.args); if (tool.permission === 'blocked' || action.permission === 'blocked') throw new Error(`Blocked tool: ${action.tool}`); return tool; }
}
