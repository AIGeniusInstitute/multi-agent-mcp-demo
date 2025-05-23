
// src/mcp/baseMcpServer.ts
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";

export abstract class BaseMcpServer {
  protected server: McpServer;
  private name: string;
  private version: string;
  
  constructor(name: string, version: string = "1.0.0") {
    this.name = name;
    this.version = version;
    
    this.server = new McpServer({
      name: this.name,
      version: this.version
    });
    
    this.setupBaseTools();
    this.setupSpecializedTools();
    this.setupResources();
  }
  
  // Base tools that all agents will have
  private setupBaseTools(): void {
    // Echo tool for testing
    this.server.tool(
      "echo",
      { message: z.string() },
      async ({ message }) => ({
        content: [{ type: "text", text: `${this.name} echoes: ${message}` }]
      })
    );
    
    // Status tool to check agent status
    this.server.tool(
      "status",
      {},
      async () => ({
        content: [{ 
          type: "text", 
          text: JSON.stringify({
            name: this.name,
            version: this.version,
            status: "active",
            timestamp: new Date().toISOString()
          }, null, 2) 
        }]
      })
    );
  }
  
  // Abstract methods to be implemented by specialized agents
  protected abstract setupSpecializedTools(): void;
  protected abstract setupResources(): void;
  
  // Connect via stdio (for command-line usage)
  async connectViaStdio(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error(`${this.name} MCP server running on stdio`);
  }
  
  // Connect via SSE (for web usage)
  async connectViaSSE(res: any, messagesEndpoint: string): Promise<SSEServerTransport> {
    const transport = new SSEServerTransport(messagesEndpoint, res);
    await this.server.connect(transport);
    console.error(`${this.name} MCP server running on SSE`);
    return transport;
  }
}