import { Client, Databases } from 'node-appwrite';
import { verifyAuth } from './lib/auth.js';
import { successResponse, errorResponse, sendAppwriteResponse } from './lib/response.js';
import { logToolExecution } from './lib/logger.js';
import { getTool } from './tools/index.js';
import { ToolContext } from './types.js';

// The Appwrite function execution entry point
export default async function (context: any) {
  const { req, res, log, error } = context;
  const startTime = Date.now();
  
  log('Received AI Tool Execution Request');

  // 1. Authentication
  if (!verifyAuth(req)) {
    error('Unauthorized request');
    return sendAppwriteResponse(res, errorResponse('Unauthorized: Invalid API Key'), 401);
  }

  // Ensure request is POST and has a body
  if (req.method !== 'POST') {
    return sendAppwriteResponse(res, errorResponse('Method Not Allowed. Use POST.'), 405);
  }

  // Parse Body
  let body: any;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch (err) {
    return sendAppwriteResponse(res, errorResponse('Invalid JSON body'), 400);
  }

  const toolName = body?.toolName;
  const toolArgs = body?.args || {};

  if (!toolName) {
    return sendAppwriteResponse(res, errorResponse('Missing "toolName" in request body'), 400);
  }

  // 2. Fetch Tool Definition
  const tool = getTool(toolName);
  if (!tool) {
    return sendAppwriteResponse(res, errorResponse(`Tool "${toolName}" not found`), 404);
  }

  // 3. Setup Appwrite Client
  // This uses the function's internal environment variables
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');
    
  const databases = new Databases(client);

  const toolCtx: ToolContext = {
    databases,
    req,
    res,
    log,
    error
  };

  // 4. Input Validation (Zod)
  let validatedArgs;
  try {
    validatedArgs = tool.schema.parse(toolArgs);
  } catch (validationError: any) {
    error(`Validation failed for tool ${toolName}: ${validationError.message}`);
    return sendAppwriteResponse(res, errorResponse(`Validation Error: ${validationError.message}`), 400);
  }

  // 5. Business Logic & Database Interaction
  try {
    log(`Executing tool ${toolName} with args: ${JSON.stringify(validatedArgs)}`);
    
    const result = await tool.execute(validatedArgs, toolCtx);
    
    const executionTime = Date.now() - startTime;
    
    // 6. Activity Log (Success)
    await logToolExecution(databases, toolName, validatedArgs, result, 'success', executionTime);
    
    // 7. JSON Response
    return sendAppwriteResponse(res, successResponse(result, executionTime));
    
  } catch (err: any) {
    const executionTime = Date.now() - startTime;
    const errorMessage = err.message || 'Unknown error occurred during tool execution';
    error(`Tool execution failed: ${errorMessage}`);
    
    // 6. Activity Log (Error)
    await logToolExecution(databases, toolName, validatedArgs, errorMessage, 'error', executionTime);
    
    // 7. JSON Response
    return sendAppwriteResponse(res, errorResponse(errorMessage, executionTime), 500);
  }
}
