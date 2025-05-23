
// src/coordinator.ts
import { ResearchAgent } from "./agents/researchAgent";
import { CodeAgent } from "./agents/codeAgent";
import { PlannerAgent } from "./agents/plannerAgent";

export class AgentCoordinator {
  private researchAgent: ResearchAgent;
  private codeAgent: CodeAgent;
  private plannerAgent: PlannerAgent;
  private initialized: boolean = false;
  
  constructor() {
    this.researchAgent = new ResearchAgent();
    this.codeAgent = new CodeAgent();
    this.plannerAgent = new PlannerAgent();
  }
  
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    console.log("Initializing agents...");
    
    // Initialize all agents in parallel
    await Promise.all([
      this.researchAgent.initialize(),
      this.codeAgent.initialize(),
      this.plannerAgent.initialize()
    ]);
    
    this.initialized = true;
    console.log("All agents initialized successfully");
  }
  
  async processTask(task: string): Promise<string> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    // In a real implementation, you'd use an LLM to determine which agent(s) to use
    // For simplicity, we'll use a basic keyword-based approach
    
    const taskLower = task.toLowerCase();
    
    if (taskLower.includes("research") || taskLower.includes("search") || taskLower.includes("information")) {
      return await this.researchAgent.process(task);
    } else if (taskLower.includes("code") || taskLower.includes("program") || taskLower.includes("develop")) {
      return await this.codeAgent.process(task);
    } else if (taskLower.includes("plan") || taskLower.includes("schedule") || taskLower.includes("organize")) {
      return await this.plannerAgent.process(task);
    } else {
      // For complex tasks, we could use multiple agents
      // For now, we'll default to the planner
      return await this.plannerAgent.process(task);
    }
  }
  
  // Method to handle complex tasks requiring multiple agents
  async processComplexTask(task: string): Promise<string> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    // 1. Create a plan with the planner agent
    const plan = await this.plannerAgent.process(task);
    
    // 2. Research relevant information
    const research = await this.researchAgent.process(task);
    
    // 3. Generate code if needed
    const code = await this.codeAgent.process(`typescript: ${task}`);
    
    // 4. Combine the results
    return `
Task: ${task}

Plan:
${plan}

Research:
${research}

Implementation:
${code}
`;
  }
}