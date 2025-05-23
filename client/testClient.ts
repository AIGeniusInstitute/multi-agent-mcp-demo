// src/client/testClient.ts
import axios from 'axios';
import readline from 'readline';
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class McpTestClient {
  private serverUrl: string;
  private mcpClient: Client | null = null;
  
  constructor(serverUrl: string = 'http://localhost:3000') {
    this.serverUrl = serverUrl;
  }
  
  async initialize(): Promise<void> {
    console.log('Initializing MCP Test Client...');
    
    // Initialize MCP client
    this.mcpClient = new Client(
      {
        name: "test-mcp-client",
        version: "1.0.0"
      },
      {
        capabilities: {
          resources: {},
          tools: {}
        }
      }
    );
    
    // For direct MCP communication (if needed)
    // const transport = new StdioClientTransport();
    // await this.mcpClient.connect(transport);
    
    console.log('MCP Test Client initialized');
  }
  
  // Method to call the API directly
  async callApi(endpoint: string, task: string): Promise<string> {
    try {
      const response = await axios.post(`${this.serverUrl}/api/${endpoint}`, {
        task
      });
      
      return response.data.result;
    } catch (error: any) {
      if (error.response) {
        return `Error: ${error.response.data.error}`;
      } else {
        return `Error: ${error.message}`;
      }
    }
  }
  
  // Interactive CLI
  async startInteractiveCli(): Promise<void> {
    console.log('\n=== MCP Multi-Agent Test Client ===');
    console.log('Type "exit" to quit');
    console.log('Commands:');
    console.log('  process <task> - Process a task with the appropriate agent');
    console.log('  complex <task> - Process a complex task using multiple agents');
    console.log('  direct <agent> <command> - Send a direct command to a specific agent (research/code/planner)');
    console.log('===============================\n');
    
    this.promptUser();
  }
  
  private promptUser(): void {
    rl.question('> ', async (input) => {
      if (input.toLowerCase() === 'exit') {
        console.log('Exiting...');
        rl.close();
        return;
      }
      
      const parts = input.split(' ');
      const command = parts[0].toLowerCase();
      const rest = parts.slice(1).join(' ');
      
      let result = '';
      
      switch (command) {
        case 'process':
          console.log('Processing task...');
          result = await this.callApi('process', rest);
          break;
          
        case 'complex':
          console.log('Processing complex task...');
          result = await this.callApi('process-complex', rest);
          break;
          
        case 'direct':
          // For direct agent communication (advanced)
          const directParts = rest.split(' ');
          const agent = directParts[0];
          const agentCommand = directParts.slice(1).join(' ');
          
          console.log(`Sending direct command to ${agent} agent...`);
          // This would require additional implementation to directly communicate with agents
          result = `Direct agent communication not fully implemented yet. Would send "${agentCommand}" to ${agent} agent.`;
          break;
          
        default:
          result = 'Unknown command. Try "process", "complex", or "direct".';
      }
      
      console.log('\nResult:');
      console.log(result);
      console.log(); // Empty line for readability
      
      // Continue prompting
      this.promptUser();
    });
  }
}

// Run the client
async function main() {
  const client = new McpTestClient();
  await client.initialize();
  await client.startInteractiveCli();
}

main().catch(error => {
  console.error('Error in test client:', error);
  process.exit(1);
});