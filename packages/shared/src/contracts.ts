import { z } from 'zod';

export const ActionSchema = z.object({
  tool: z.string().min(1),
  args: z.record(z.unknown()).default({}),
  permission: z.enum(['auto', 'confirm', 'blocked'])
}).strict();
export const PlanSchema = z.object({ message: z.string(), actions: z.array(ActionSchema) }).strict();
export type Action = z.infer<typeof ActionSchema>;
export type Plan = z.infer<typeof PlanSchema>;
export type ToolContext = { requestId: string };
export type Tool = {
  name: string; description: string; permission: 'auto' | 'confirm' | 'blocked'; risk: 'low' | 'medium' | 'high';
  input: z.ZodTypeAny; execute: (args: any, context: ToolContext) => Promise<unknown>; verify?: (args: any, result: unknown) => Promise<boolean>;
};
