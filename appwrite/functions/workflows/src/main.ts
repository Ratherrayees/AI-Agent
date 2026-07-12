import { Client, Databases } from 'node-appwrite';
import { verifyWorkflowAuth } from './lib/auth.js';
import { successResponse, errorResponse, sendAppwriteResponse } from './lib/response.js';
import { logWorkflowExecution } from './lib/logger.js';
import { processEventHandler } from './handlers/process-event.js';
import { sendNotificationHandler } from './handlers/send-notification.js';
import { runJobHandler } from './handlers/run-job.js';
import { WorkflowContext } from './types.js';

export default async function (context: any) {
  const { req, res, log, error } = context;
  const startTime = Date.now();

  log('Received Workflows/Automation Request');

  // 1. Check if request is an Appwrite internal event trigger or HTTP request
  let payload: any = {};
  if (req.body) {
    try {
      payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (e) {
      log('Body parsing warning: invalid JSON string or empty');
    }
  }

  // Check auth for HTTP requests (unless triggered internally by Appwrite Events)
  if (req.method === 'POST' && !verifyWorkflowAuth(req)) {
    error('Unauthorized workflow invocation');
    return sendAppwriteResponse(res, errorResponse('Unauthorized workflow token'), 401);
  }

  // Setup Appwrite Client
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

  const databases = new Databases(client);

  const wfCtx: WorkflowContext = {
    databases,
    req,
    res,
    log,
    error
  };

  const action = payload.action || payload.type || 'process_event';

  try {
    let result: any;

    if (action === 'send_notification') {
      result = await sendNotificationHandler(payload, wfCtx);
    } else if (action === 'run_job') {
      result = await runJobHandler(payload, wfCtx);
    } else {
      // Default to process_event
      result = await processEventHandler(payload, wfCtx);
    }

    const executionTime = Date.now() - startTime;
    await logWorkflowExecution(databases, action, payload, result, 'success', executionTime);

    return sendAppwriteResponse(res, successResponse(result, executionTime));
  } catch (err: any) {
    const executionTime = Date.now() - startTime;
    const errorMessage = err.message || 'Workflow execution error';
    error(`Workflow failed: ${errorMessage}`);

    await logWorkflowExecution(databases, action, payload, errorMessage, 'error', executionTime);

    return sendAppwriteResponse(res, errorResponse(errorMessage, executionTime), 500);
  }
}
