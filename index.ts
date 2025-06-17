import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 9696;

// Configure body size limits (adjust these values as needed)
const BODY_SIZE_LIMIT = '50mb';

app.use(express.json({ 
  limit: BODY_SIZE_LIMIT,
}));

app.use(express.urlencoded({ 
  extended: true,
  limit: BODY_SIZE_LIMIT
}));

app.use(express.text({ 
  limit: BODY_SIZE_LIMIT 
}));

app.use(express.raw({ 
  limit: BODY_SIZE_LIMIT 
}));

function logRequestDetails(req: Request): void {
  console.log('=== HTTP Request Details ===');
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log(`Path: ${req.path}`);
  console.log(`Query Parameters:`, req.query);
  console.log(`Headers:`, req.headers);
  
  // Log body size information
  const contentLength = req.get('Content-Length');
  if (contentLength) {
    const sizeInMB = (parseInt(contentLength) / (1024 * 1024)).toFixed(2);
    console.log(`Content Length: ${contentLength} bytes (${sizeInMB} MB)`);
  }
  
  // For large bodies, log a truncated version or just the type
  if (req.body && typeof req.body === 'string' && req.body.length > 1000) {
    console.log(`Body (truncated): ${req.body.substring(0, 1000)}... [${req.body.length} total characters]`);
  } else if (req.body && typeof req.body === 'object' && JSON.stringify(req.body).length > 1000) {
    console.log(`Body (large object): [Object with ${Object.keys(req.body).length} keys]`);
    console.log(`Body size: ${JSON.stringify(req.body).length} characters`);
  } else {
    console.log(`Body:`, req.body);
  }
  
  console.log(`IP Address: ${req.ip}`);
  console.log(`User Agent: ${req.get('User-Agent') || 'Not provided'}`);
  console.log('============================\n');
}

// Error handling middleware for payload too large
app.use((error: any, req: Request, res: Response, next: any) => {
  if (error.type === 'entity.too.large') {
    console.log('=== PAYLOAD TOO LARGE ERROR ===');
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log(`Method: ${req.method}`);
    console.log(`URL: ${req.url}`);
    console.log(`Content-Length: ${req.get('Content-Length')} bytes`);
    console.log(`Current limit: ${BODY_SIZE_LIMIT}`);
    console.log('===============================\n');
    
    return res.status(413).json({
      error: 'Payload Too Large',
      message: `Request entity too large. Current limit is ${BODY_SIZE_LIMIT}`,
      contentLength: req.get('Content-Length'),
      limit: BODY_SIZE_LIMIT
    });
  }
  next(error);
});

// Catch-all route handler for all HTTP methods
app.all('*', (req: Request, res: Response) => {
  try {
    // Log the request details
    logRequestDetails(req);

    // Create response data (be careful with large bodies)
    const responseData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      path: req.path,
      query: req.query,
      headers: req.headers,
      bodySize: req.body ? (typeof req.body === 'string' ? req.body.length : JSON.stringify(req.body).length) : 0,
      // Only include full body if it's reasonably sized
      body: req.body && JSON.stringify(req.body).length < 10000 ? req.body : '[Body too large to echo]',
      ip: req.ip,
      userAgent: req.get('User-Agent') || 'Not provided'
    };

    // Send the echoed response
    res.status(200).json({
      message: 'Request received and logged',
      requestDetails: responseData
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error processing the request'
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Response Echoer server is running on port ${PORT}`);
  console.log(`Send HTTP requests to http://localhost:${PORT}`);
  console.log(`Maximum body size limit: ${BODY_SIZE_LIMIT}`);
  console.log('All request details will be logged to the console\n');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down Response Echoer server...');
  process.exit(0);
});
