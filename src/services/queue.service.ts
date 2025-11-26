// services/bedrock-queue.service.ts (new file)
import PQueue from 'p-queue';

class BedrockQueueService {
  private queue: PQueue;
  
  constructor() {
    // Max 2 concurrent requests, 1 second gap between each
    this.queue = new PQueue({
      concurrency: 1,           // One at a time
      interval: 2000,           // Wait 2 seconds between requests
      intervalCap: 1            // Max 1 request per interval
    });
  }
  
  async addToQueue<T>(fn: () => Promise<T>): Promise<T> {
    return this.queue.add(fn);
  }
  
  getQueueSize(): number {
    return this.queue.size;
  }
}

export const bedrockQueue = new BedrockQueueService();
