import type { Action, Plan } from '../../shared/src/contracts.js';
import type { ToolRegistry } from '../../tools/src/tool-registry.js';
import type { JarvisDatabase } from '../../memory/src/database.js';
export class AgentOrchestrator {
  constructor(private registry: ToolRegistry, private db: JarvisDatabase) {}
  async run(request: string, planner: { plan(input: string): Plan; validate(input: unknown): Plan }) {
    const plan = planner.validate(planner.plan(request));
    const results: unknown[] = [];
    for (const action of plan.actions) {
      const started = Date.now(); let result: unknown; let error: string | undefined; let verified = false;
      try { const tool = this.registry.validateAction(action); result = await tool.execute(action.args, { requestId: crypto.randomUUID() }); verified = tool.verify ? await tool.verify(action.args, result) : true; if (!verified) throw new Error('Verification failed'); }
      catch (e) { error = e instanceof Error ? e.message : String(e); }
      this.db.prepare('INSERT INTO action_logs (timestamp,request,plan,tool,arguments,permission,result,verification,error,duration_ms) VALUES (?,?,?,?,?,?,?,?,?,?)').run(new Date().toISOString(), request, JSON.stringify(plan), action.tool, JSON.stringify(action.args), action.permission, JSON.stringify(result ?? null), verified ? 1 : 0, error ?? null, Date.now() - started);
      results.push({ tool: action.tool, result, verified, error }); if (error) break;
    }
    return { message: plan.message, actions: results };
  }
}
