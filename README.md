# Response Echoer

A simple HTTP server that logs and echoes back details of incoming HTTP requests. Built with Express.js and TypeScript.

## Overview

Response Echoer is a development utility that accepts HTTP requests on any endpoint and method, logs detailed information about each request to the console, and returns the request details as a JSON response. This is useful for debugging webhooks, API calls, or any HTTP communication during development.

## Features

- **Universal Endpoint**: Accepts requests on any path and HTTP method
- **Detailed Logging**: Logs comprehensive request information to console including:
  - Timestamp
  - HTTP method and URL
  - Headers and query parameters
  - Request body (with smart truncation for large payloads)
  - Client IP address and User Agent
- **Large Payload Support**: Configurable body size limit (default: 50MB)
- **Error Handling**: Graceful handling of oversized payloads
- **JSON Response**: Returns structured request details as JSON
- **TypeScript**: Fully typed with TypeScript for better development experience

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd response-echoer
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Development Mode
Start the server with hot reloading:
```bash
npm run dev
```

### Production Mode
Build and run the compiled version:
```bash
npm run build
npm start
```

The server will start on port `9696` by default, or use the `PORT` environment variable if set.

## Configuration

### Environment Variables

- `PORT`: Server port (default: 9696)

### Body Size Limit

The server accepts payloads up to 50MB by default. You can modify the `BODY_SIZE_LIMIT` constant in [`index.ts`](index.ts:7) to adjust this limit.

## API

### All Endpoints
- **Method**: Any HTTP method (GET, POST, PUT, DELETE, etc.)
- **Path**: Any path
- **Body**: Any content type (JSON, form data, text, binary)

### Response Format
```json
{
  "message": "Request received and logged",
  "requestDetails": {
    "timestamp": "2024-01-01T12:00:00.000Z",
    "method": "POST",
    "url": "/api/webhook",
    "path": "/api/webhook",
    "query": {},
    "headers": {
      "content-type": "application/json",
      "user-agent": "curl/7.68.0"
    },
    "bodySize": 123,
    "body": { "key": "value" },
    "ip": "::1",
    "userAgent": "curl/7.68.0"
  }
}
```

### Error Responses

#### Payload Too Large (413)
```json
{
  "error": "Payload Too Large",
  "message": "Request entity too large. Current limit is 50mb",
  "contentLength": "52428800",
  "limit": "50mb"
}
```

## Examples

### Testing with curl

Send a GET request:
```bash
curl http://localhost:9696/test
```

Send a POST request with JSON:
```bash
curl -X POST http://localhost:9696/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, World!"}'
```

Send a request with query parameters:
```bash
curl "http://localhost:9696/search?q=test&limit=10"
```

## Console Output

Each request generates detailed console output:
```
=== HTTP Request Details ===
Timestamp: 2024-01-01T12:00:00.000Z
Method: POST
URL: /api/webhook?source=github
Path: /api/webhook
Query Parameters: { source: 'github' }
Headers: {
  'content-type': 'application/json',
  'user-agent': 'GitHub-Hookshot/abc123',
  'content-length': '156'
}
Content Length: 156 bytes (0.00 MB)
Body: { "action": "push", "repository": { "name": "test-repo" } }
IP Address: ::1
User Agent: GitHub-Hookshot/abc123
============================
```

## Use Cases

- **Webhook Development**: Test webhook payloads from external services
- **API Debugging**: Inspect outgoing requests from your applications
- **HTTP Client Testing**: Verify request formatting and headers
- **Development Proxy**: Log requests during local development
- **Integration Testing**: Capture and analyze HTTP communications

## Project Structure

```
response-echoer/
├── index.ts          # Main server implementation
├── package.json      # Project configuration and dependencies
├── tsconfig.json     # TypeScript configuration
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

If you encounter any issues or have questions, please open an issue on the project repository.