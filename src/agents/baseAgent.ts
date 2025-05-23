
// src/agents/baseAgent.ts
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { BaseMcpServer } from "../mcp/baseMcpServer";

export abstract class BaseAgent {
  protected name: string;
  protected client: Client | null = null;
  protected mcpServer: BaseMcpServer;
  
  constructor(name: string, mcpServer: BaseMcpServer) {
    this.name = name;
    this.mcpServer = mcpServer;
  }
  
  async initialize(): Promise<void> {
    // Start the MCP server
    await this.startMcpServer();
    
    // Connect to the MCP server
    await this.connectToMcpServer();
  }
  
  protected async startMcpServer(): Promise<void> {
    // In a real implementation, you'd start the MCP server as a separate process
    // For simplicity, we're just connecting via stdio in the same process
    await this.mcpServer.connectViaStdio();
  }
  
  protected async connectToMcpServer(): Promise<void> {
    this.client = new Client(
      {
        name: `${this.name}-client`,
        version: "1.0.0"
      },
      {
        capabilities: {
          resources: {},
          tools: {}
        }
      }
    );
    
    // In a real implementation, you'd connect to the MCP server via a transport
    // For now, we'll assume it's already connected
    console.log(`${this.name} connected to MCP server`);
  }
  
  // Abstract method to be implemented by specialized agents
  abstract process(input: string): Promise<string>;
  
  // Helper method to call an MCP tool
  protected async callTool(name: string, args: Record<string, any>): Promise<any> {
    if (!this.client) {
      throw new Error("Agent not initialized");
    }
    
    try {
      const result = await this.client.callTool({
        name,
        arguments: args
      });
      
      return result;
    } catch (error) {
      console.error(`Error calling tool ${name}:`, error);
      throw error;
    }
  }
  
  // Helper method to read an MCP resource
  protected async readResource(uri: string): Promise<any> {
    if (!this.client) {
      throw new Error("Agent not initialized");
    }
    
    try {
      const result = await this.client.readResource({ uri });
      return result;
    } catch (error) {
      console.error(`Error reading resource ${uri}:`, error);
      throw error;
    }
  }
}