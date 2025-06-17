import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 9696;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Middleware to parse raw text bodies
app.use(express.text());

// Function to log request details
function logRequestDetails(req: Request): void {
  console.log('=== HTTP Request Details ===');
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log(`Path: ${req.path}`);
  console.log(`Query Parameters:`, req.query);
  console.log(`Headers:`, req.headers);
  console.log(`Body:`, req.body);
  console.log(`IP Address: ${req.ip}`);
  console.log(`User Agent: ${req.get('User-Agent') || 'Not provided'}`);
  console.log('============================\n');
}

// Catch-all route handler for all HTTP methods
app.all('*', (req: Request, res: Response) => {
  // Log the request details
  logRequestDetails(req);

  // Echo back the request details as JSON response
  const responseData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    path: req.path,
    query: req.query,
    headers: req.headers,
    body: req.body,
    ip: req.ip,
    userAgent: req.get('User-Agent') || 'Not provided'
  };

  // Send the echoed response
  res.status(200).json({
    message: 'Request received and logged',
    requestDetails: responseData
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Response Echoer server is running on port ${PORT}`);
  console.log(`Send HTTP requests to http://localhost:${PORT}`);
  console.log('All request details will be logged to the console\n');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down Response Echoer server...');
  process.exit(0);
});
