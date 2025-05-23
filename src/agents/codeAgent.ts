
// src/agents/codeAgent.ts
import { BaseAgent } from "./baseAgent";
import { CodeMcpServer } from "../mcp/codeMcpServer";

export class CodeAgent extends BaseAgent {
  constructor() {
    const mcpServer = new CodeMcpServer();
    super("code-agent", mcpServer);
  }
  
  async process(input: string): Promise<string> {
    // Parse the input to determine what code to generate
    // For simplicity, we'll assume the format is "language: description"
    const parts = input.split(":");
    const language = parts[0].trim();
    const description = parts.slice(1).join(":").trim();
    
    try {
      const result = await this.callTool("generate-code", { 
        language, 
        description 
      });
      return `Generated code:\n${result.content[0].text}`;
    } catch (error) {
      const err = error as Error;
      return `Error in code agent: ${err.message}`;
    }
  }
  
  async reviewCode(code: string): Promise<string> {
    try {
      const result = await this.callTool("review-code", { code });
      return result.content[0].text;
    } catch (error) {
      const err = error as Error;
      return `Error reviewing code: ${err.message}`;
    }
  }
}