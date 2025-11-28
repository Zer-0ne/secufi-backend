// Simple test to verify AI service response handling
import { AIService } from './dist/services/ai.service.js';

async function testAIService() {
  console.log('🧪 Testing AI Service Response Handling...');
  
  const aiService = new AIService();
  
  // Test 1: Verify callBedrock returns a string
  console.log('\n1. Testing callBedrock method...');
  try {
    // Use a simple prompt that should return a string response
    const response = await aiService.callBedrock('Hello, respond with "test response"');
    console.log('✅ callBedrock response type:', typeof response);
    console.log('✅ callBedrock response:', response.substring(0, 50) + '...');
    
    // Test string methods
    console.log('✅ Testing response.match()...');
    const matchResult = response.match(/test response/);
    console.log('✅ match() result:', matchResult);
    
    console.log('✅ Testing response.trim()...');
    const trimResult = response.trim();
    console.log('✅ trim() result:', trimResult.substring(0, 50) + '...');
    
  } catch (error) {
    console.error('❌ callBedrock test failed:', error.message);
  }
  
  // Test 2: Verify cache works correctly
  console.log('\n2. Testing cache functionality...');
  try {
    const prompt = 'Test cache prompt';
    const firstResponse = await aiService.callBedrock(prompt);
    console.log('✅ First response:', firstResponse.substring(0, 50) + '...');
    
    // Second call should use cache
    const secondResponse = await aiService.callBedrock(prompt);
    console.log('✅ Second response:', secondResponse.substring(0, 50) + '...');
    
    console.log('✅ Cache test completed');
  } catch (error) {
    console.error('❌ Cache test failed:', error.message);
  }
  
  console.log('\n🧪 AI Service Test Complete');
}

// Run the test
testAIService().catch(console.error);