
// src/agents/researchAgent.ts
import { BaseAgent } from "./baseAgent";
import { ResearchMcpServer } from "../mcp/researchMcpServer";

export class ResearchAgent extends BaseAgent {
  constructor() {
    const mcpServer = new ResearchMcpServer();
    super("research-agent", mcpServer);
  }
  
  async process(input: string): Promise<string> {
    // In a real implementation, you'd use an LLM to determine what to do
    // For simplicity, we'll just call the search tool
    try {
      const result = await this.callTool("search", { query: input });
      return `Research results for "${input}":\n${JSON.stringify(result, null, 2)}`;
    } catch (error) {
      const err = error as Error;
      return `Error in research agent: ${err.message}`;
    }
  }
  
  async getKnowledge(topic: string): Promise<string> {
    try {
      const resource = await this.readResource(`knowledge://${topic}`);
      return resource.contents[0].text;
    } catch (error) {
      const err = error as Error;
      return `Error fetching knowledge: ${err.message}`;
    }
  }
}