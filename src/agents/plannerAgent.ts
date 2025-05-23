
// src/agents/plannerAgent.ts
import { BaseAgent } from "./baseAgent";
import { PlannerMcpServer } from "../mcp/plannerMcpServer";

export class PlannerAgent extends BaseAgent {
  constructor() {
    const mcpServer = new PlannerMcpServer();
    super("planner-agent", mcpServer);
  }
  
  async process(input: string): Promise<string> {
    try {
      const result = await this.callTool("create-plan", { goal: input });
      return `Plan for "${input}":\n${result.content[0].text}`;
    } catch (error) {
      const err = error as Error;
      return `Error in planner agent: ${err.message}`;
    }
  }
  
  async evaluatePlan(plan: string): Promise<string> {
    try {
      const result = await this.callTool("evaluate-plan", { plan });
      return result.content[0].text;
    } catch (error) {
      const err = error as Error;
      return `Error evaluating plan: ${err.message}`;
    }
  }
}