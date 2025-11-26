/**
 * @fileoverview WebSocket Service for Real-time Communication
 * @description This service provides a robust WebSocket implementation with routing,
 * middleware support, authentication, and room management capabilities. It follows
 * the same patterns as the existing Express-based services in the codebase.
 * 
 * Key features:
 * - Event-based routing similar to Express routes
 * - Middleware support for authentication, validation, etc.
 * - Room-based broadcasting
 * - Heartbeat mechanism for connection health
 * - Automatic cleanup of disconnected clients
 * - Integration with existing JWT authentication
 * 
 * @module services/websocket.service
 * @requires ws - WebSocket server implementation
 * @requires jsonwebtoken - JWT verification
 * @requires @/services/jwt.service - Custom JWT service
 * @requires @/types/websocket - WebSocket type definitions
 * 
 * @author Secufi Team
 * @version 1.0.0
 */

// Import required modules
import { WebSocketServer, WebSocket, Data } from 'ws';
import http from 'http';
import url from 'url';
import jwt from 'jsonwebtoken';

// Import custom modules
import JWTService, { IDecodedToken } from '@/services/jwt.service';
import {
  ExtendedWebSocket,
  WSRequest,
  WSResponse,
  WSMiddleware,
  WSHandler,
  WSRoute,
  WSConnectionOptions,
  WSMessage,
  WSSuccessResponse,
  WSErrorResponse
} from '@/types/websocket';

/**
 * WebSocket Service Class
 * 
 * @class WebSocketService
 * @description Provides a comprehensive WebSocket service with routing,
 * middleware, and authentication capabilities. Designed to work alongside
 * the existing Express-based architecture.
 * 
 * Usage:
 * ```typescript
 * const wsService = new WebSocketService(server);
 * wsService.use('/chat', authenticateJWT); // Apply middleware
 * wsService.on('message', handleMessage); // Register event handler
 * ```
 */
export class WebSocketService {
  // ============================================
  // Properties
  // ============================================

  /**
   * WebSocket server instance
   * @private
   */
  private wss: WebSocketServer;

  /**
   * Registered routes with their middleware chains
   * @private
   */
  private routes: Map<string, WSRoute> = new Map();

  /**
   * Global middleware stack
   * @private
   */
  private middlewares: WSMiddleware[] = [];

  /**
   * Active connections map (socket ID -> ExtendedWebSocket)
   * @private
   */
  private connections: Map<string, ExtendedWebSocket> = new Map();

  /**
   * Rooms map (room name -> Set of socket IDs)
   * @private
   */
  private rooms: Map<string, Set<string>> = new Map();

  /**
   * Connection options
   * @private
   */
  private options: WSConnectionOptions;

  /**
   * Heartbeat interval timer
   * @private
   */
  private heartbeatInterval: NodeJS.Timeout | null = null;

  // ============================================
  // Constructor
  // ============================================

  /**
   * Create a new WebSocket service
   * 
   * @constructor
   * @param {http.Server} server - HTTP server to attach WebSocket server to
   * @param {WSConnectionOptions} [options] - Connection options
   * 
   * @example
   * ```typescript
   * const server = http.createServer(app);
   * const wsService = new WebSocketService(server, {
   *   heartbeatInterval: 30000,
   *   heartbeatTimeout: 5000
   * });
   * ```
   */
  constructor(server: http.Server, options?: WSConnectionOptions) {
    // Initialize WebSocket server
    this.wss = new WebSocketServer({ server });
    
    // Set default options
    this.options = {
      heartbeatInterval: 30000, // 30 seconds
      heartbeatTimeout: 5000,   // 5 seconds
      ...options
    };

    // Setup connection handlers
    this.setupConnectionHandlers();
    
    // Start heartbeat if enabled
    if (this.options.heartbeatInterval) {
      this.startHeartbeat();
    }

    console.log('🚀 WebSocket service initialized');
  }

  // ============================================
  // Connection Management
  // ============================================

  /**
   * Setup WebSocket connection handlers
   * @private
   */
  private setupConnectionHandlers(): void {
    // Handle new connections
    this.wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
      // Extend WebSocket with custom properties
      const socket = ws as ExtendedWebSocket;
      socket.id = this.generateSocketId();
      socket.isAlive = true;
      socket.rooms = new Set();

      // Store connection
      this.connections.set(socket.id, socket);

      // Log connection
      console.log(`🔌 WebSocket connected: ${socket.id}`);

      // Call custom connect handler if provided
      if (this.options.onConnect) {
        Promise.resolve(this.options.onConnect(socket, req)).catch((error: Error) => {
          console.error('❌ Error in connect handler:', error);
        });
      }

      // Handle incoming messages
      socket.on('message', (data: Data) => {
        this.handleMessage(socket, data).catch((error: Error) => {
          console.error('❌ Error handling message:', error);
          this.sendError(socket, 'internal_error', 'Internal server error', 500);
        });
      });

      // Handle socket close
      socket.on('close', (code: number, reason: Buffer) => {
        this.handleDisconnect(socket, code, reason);
      });

      // Handle socket errors
      socket.on('error', (error: Error) => {
        this.handleError(socket, error);
      });

      // Send welcome message
      this.sendSuccess(socket, null, 'Connected to WebSocket server');
    });

    // Handle server errors
    this.wss.on('error', (error: Error) => {
      console.error('❌ WebSocket server error:', error);
    });
  }

  /**
   * Handle incoming WebSocket messages
   * @private
   * @param {ExtendedWebSocket} socket - WebSocket connection
   * @param {Data} data - Message data
   */
  private async handleMessage(socket: ExtendedWebSocket, data: Data): Promise<void> {
    try {
      // Parse message
      let message: WSMessage;
      
      if (typeof data === 'string') {
        message = JSON.parse(data);
      } else if (data instanceof Buffer) {
        message = JSON.parse(data.toString());
      } else {
        throw new Error('Unsupported message format');
      }

      // Validate message structure
      if (!message.event) {
        throw new Error('Missing event in message');
      }

      // Create request and response objects
      const req: WSRequest = {
        socket,
        event: message.event,
        data: message.data || {},
        params: {},
        query: {},
        user: socket.user,
        metadata: {}
      };

      const res: WSResponse = {
        socket,
        success: (data: any, message?: string) => this.sendSuccess(socket, data, message, req.event),
        error: (message: string, code?: string, statusCode?: number) => 
          this.sendError(socket, code || 'error', message, statusCode),
        send: (data: any) => socket.send(JSON.stringify(data)),
        emit: (event: string, data: any) => this.sendEvent(socket, event, data),
        broadcast: (room: string, event: string, data: any) => this.broadcastToRoom(room, event, data, socket.id),
        broadcastToOthers: (event: string, data: any) => this.broadcastToOthers(socket, event, data)
      };

      // Find matching route
      const route = this.routes.get(message.event);
      if (!route) {
        this.sendError(socket, 'not_found', `No handler registered for event: ${message.event}`, 404);
        return;
      }

      // Execute middleware chain
      await this.executeMiddlewareChain(route.middlewares, req, res);
    } catch (error) {
      console.error('❌ Error processing message:', error);
      this.sendError(socket, 'parse_error', 'Invalid message format', 400);
    }
  }

  /**
   * Handle client disconnection
   * @private
   * @param {ExtendedWebSocket} socket - Disconnected socket
   * @param {number} code - Close code
   * @param {Buffer} reason - Close reason
   */
  private handleDisconnect(socket: ExtendedWebSocket, code: number, reason: Buffer): void {
    console.log(`🔌 WebSocket disconnected: ${socket.id} (code: ${code})`);
    
    // Leave all rooms
    if (socket.rooms) {
      for (const room of socket.rooms) {
        this.leaveRoom(socket, room);
      }
    }

    // Remove from connections
    this.connections.delete(socket.id);

    // Call custom disconnect handler if provided
    if (this.options.onDisconnect) {
      Promise.resolve(this.options.onDisconnect(socket, code, reason)).catch((error: Error) => {
        console.error('❌ Error in disconnect handler:', error);
      });
    }
  }

  /**
   * Handle socket errors
   * @private
   * @param {ExtendedWebSocket} socket - Socket with error
   * @param {Error} error - Error object
   */
  private handleError(socket: ExtendedWebSocket, error: Error): void {
    console.error(`❌ WebSocket error for ${socket.id}:`, error);
    
    // Call custom error handler if provided
    if (this.options.onError) {
      Promise.resolve(this.options.onError(socket, error)).catch((handlerError: Error) => {
        console.error('❌ Error in error handler:', handlerError);
      });
    }
  }

  // ============================================
  // Middleware System
  // ============================================

  /**
   * Register global or event-specific middleware
   * 
   * @method use
   * @param {string | WSMiddleware} eventOrMiddleware - Event name or middleware function
   * @param {WSMiddleware} [middleware] - Middleware function (if first param is event)
   * @returns {this} Chainable instance
   * 
   * @example
   * ```typescript
   * // Global middleware
   * wsService.use(authenticateJWT);
   * 
   * // Event-specific middleware
   * wsService.use('chat/message', validateMessage);
   * ```
   */
  use(eventOrMiddleware: string | WSMiddleware, middleware?: WSMiddleware): this {
    if (typeof eventOrMiddleware === 'function') {
      // Global middleware
      this.middlewares.push(eventOrMiddleware);
    } else if (typeof eventOrMiddleware === 'string' && middleware) {
      // Event-specific middleware
      const route = this.routes.get(eventOrMiddleware) || { 
        event: eventOrMiddleware, 
        middlewares: [], 
        handler: async () => {} 
      };
      route.middlewares.push(middleware);
      this.routes.set(eventOrMiddleware, route);
    }
    return this;
  }

  /**
   * Execute middleware chain
   * @private
   * @param {WSMiddleware[]} middlewares - Middleware functions to execute
   * @param {WSRequest} req - Request object
   * @param {WSResponse} res - Response object
   */
  private async executeMiddlewareChain(
    middlewares: WSMiddleware[], 
    req: WSRequest, 
    res: WSResponse
  ): Promise<void> {
    // Combine global and route-specific middleware
    const allMiddlewares = [...this.middlewares, ...middlewares];
    
    if (allMiddlewares.length === 0) {
      // No middleware, execute handler directly
      const route = this.routes.get(req.event);
      if (route?.handler) {
        await route.handler(req, res);
      }
      return;
    }

    // Execute middleware chain
    let index = 0;
    const next = async (error?: Error): Promise<void> => {
      if (error) {
        res.error(error.message, 'middleware_error', 500);
        return;
      }

      if (index >= allMiddlewares.length) {
        // All middleware executed, run handler
        const route = this.routes.get(req.event);
        if (route?.handler) {
          await route.handler(req, res);
        }
        return;
      }

      const middleware = allMiddlewares[index++];
      try {
        await middleware(req, res, next);
      } catch (err) {
        res.error(
          (err as Error).message, 
          'middleware_error', 
          (err as any).statusCode || 500
        );
      }
    };

    await next();
  }

  // ============================================
  // Routing System
  // ============================================

  /**
   * Register event handler with optional middleware
   * 
   * @method on
   * @param {string} event - Event name
   * @param {WSMiddleware[] | WSHandler} middlewaresOrHandler - Middleware array or handler function
   * @param {WSHandler} [handler] - Handler function (if second param is middleware array)
   * @returns {this} Chainable instance
   * 
   * @example
   * ```typescript
   * // Without middleware
   * wsService.on('chat/message', (req, res) => {
   *   res.success({ message: req.data.text });
   * });
   * 
   * // With middleware
   * wsService.on('chat/message', [validateMessage], (req, res) => {
   *   res.success({ message: req.data.text });
   * });
   * ```
   */
  on(event: string, middlewaresOrHandler: WSMiddleware[] | WSHandler, handler?: WSHandler): this {
    if (Array.isArray(middlewaresOrHandler)) {
      // Handler with middleware array
      if (handler) {
        this.routes.set(event, { event, middlewares: middlewaresOrHandler, handler });
      }
    } else {
      // Handler without middleware
      const route = this.routes.get(event) || { event, middlewares: [], handler: middlewaresOrHandler };
      route.handler = middlewaresOrHandler;
      this.routes.set(event, route);
    }
    return this;
  }

  // ============================================
  // Room Management
  // ============================================

  /**
   * Join a room
   * 
   * @method joinRoom
   * @param {ExtendedWebSocket} socket - WebSocket connection
   * @param {string} room - Room name
   * 
   * @example
   * ```typescript
   * wsService.joinRoom(socket, 'family-123');
   * ```
   */
  joinRoom(socket: ExtendedWebSocket, room: string): void {
    // Create room if it doesn't exist
    if (!this.rooms.has(room)) {
      this.rooms.set(room, new Set());
    }

    // Add socket to room
    this.rooms.get(room)?.add(socket.id);
    socket.rooms?.add(room);

    console.log(`🚪 Socket ${socket.id} joined room ${room}`);
  }

  /**
   * Leave a room
   * 
   * @method leaveRoom
   * @param {ExtendedWebSocket} socket - WebSocket connection
   * @param {string} room - Room name
   * 
   * @example
   * ```typescript
   * wsService.leaveRoom(socket, 'family-123');
   * ```
   */
  leaveRoom(socket: ExtendedWebSocket, room: string): void {
    // Remove socket from room
    this.rooms.get(room)?.delete(socket.id);
    socket.rooms?.delete(room);

    console.log(`🚪 Socket ${socket.id} left room ${room}`);
  }

  /**
   * Broadcast message to all clients in a room
   * 
   * @method broadcastToRoom
   * @param {string} room - Room name
   * @param {string} event - Event name
   * @param {any} data - Data to send
   * @param {string} [excludeId] - Socket ID to exclude from broadcast
   * 
   * @example
   * ```typescript
   * wsService.broadcastToRoom('family-123', 'chat/new_message', messageData);
   * ```
   */
  broadcastToRoom(room: string, event: string, data: any, excludeId?: string): void {
    const roomSockets = this.rooms.get(room);
    if (!roomSockets) return;

    for (const socketId of roomSockets) {
      // Skip excluded socket
      if (socketId === excludeId) continue;

      const socket = this.connections.get(socketId);
      if (socket && socket.readyState === WebSocket.OPEN) {
        this.sendEvent(socket, event, data);
      }
    }
  }

  /**
   * Broadcast message to all clients except sender
   * 
   * @method broadcastToOthers
   * @param {ExtendedWebSocket} sender - Sender socket
   * @param {string} event - Event name
   * @param {any} data - Data to send
   * 
   * @example
   * ```typescript
   * wsService.broadcastToOthers(senderSocket, 'user/status', statusData);
   * ```
   */
  broadcastToOthers(sender: ExtendedWebSocket, event: string, data: any): void {
    for (const [socketId, socket] of this.connections) {
      // Skip sender
      if (socketId === sender.id) continue;

      if (socket.readyState === WebSocket.OPEN) {
        this.sendEvent(socket, event, data);
      }
    }
  }

  // ============================================
  // Communication Helpers
  // ============================================

  /**
   * Send success response to client
   * @private
   * @param {ExtendedWebSocket} socket - Target socket
   * @param {any} data - Response data
   * @param {string} [message] - Success message
   * @param {string} [event] - Event name (defaults to 'response')
   */
  private sendSuccess(
    socket: ExtendedWebSocket, 
    data: any, 
    message?: string, 
    event: string = 'response'
  ): void {
    if (socket.readyState !== WebSocket.OPEN) return;

    const response: WSSuccessResponse = {
      success: true,
      data,
      ...(message && { message }),
      event,
      timestamp: Date.now()
    };

    socket.send(JSON.stringify(response));
  }

  /**
   * Send error response to client
   * @private
   * @param {ExtendedWebSocket} socket - Target socket
   * @param {string} code - Error code
   * @param {string} message - Error message
   * @param {number} [statusCode=400] - HTTP-style status code
   * @param {string} [event] - Event name (defaults to 'error')
   */
  private sendError(
    socket: ExtendedWebSocket,
    code: string,
    message: string,
    statusCode: number = 400,
    event: string = 'error'
  ): void {
    if (socket.readyState !== WebSocket.OPEN) return;

    const response: WSErrorResponse = {
      success: false,
      error: { code, message, statusCode },
      event,
      timestamp: Date.now()
    };

    socket.send(JSON.stringify(response));
  }

  /**
   * Send custom event to client
   * @private
   * @param {ExtendedWebSocket} socket - Target socket
   * @param {string} event - Event name
   * @param {any} data - Event data
   */
  private sendEvent(socket: ExtendedWebSocket, event: string, data: any): void {
    if (socket.readyState !== WebSocket.OPEN) return;

    const message: WSMessage = {
      event,
      data,
      timestamp: Date.now()
    };

    socket.send(JSON.stringify(message));
  }

  // ============================================
  // Heartbeat System
  // ============================================

  /**
   * Start heartbeat mechanism
   * @private
   */
  private startHeartbeat(): void {
    if (!this.options.heartbeatInterval) return;

    this.heartbeatInterval = setInterval(() => {
      // Ping all connections
      for (const [socketId, socket] of this.connections) {
        // Check if socket is still alive
        if (socket.isAlive === false) {
          console.log(`💔 Terminating dead connection: ${socketId}`);
          socket.terminate();
          continue;
        }

        // Mark as potentially dead until pong received
        socket.isAlive = false;
        
        // Send ping
        socket.ping();
      }
    }, this.options.heartbeatInterval);
  }

  /**
   * Setup heartbeat event handlers
   * @private
   */
  private setupHeartbeatHandlers(): void {
    // Handle pong responses
    this.wss.on('connection', (ws: WebSocket) => {
      const socket = ws as ExtendedWebSocket;
      
      socket.on('pong', () => {
        socket.isAlive = true;
      });
    });
  }

  // ============================================
  // Utility Methods
  // ============================================

  /**
   * Generate unique socket ID
   * @private
   * @returns {string} Unique socket ID
   */
  private generateSocketId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Get socket by ID
   * 
   * @method getSocket
   * @param {string} id - Socket ID
   * @returns {ExtendedWebSocket | undefined} Socket if found
   */
  getSocket(id: string): ExtendedWebSocket | undefined {
    return this.connections.get(id);
  }

  /**
   * Get all active connections
   * 
   * @method getConnections
   * @returns {Map<string, ExtendedWebSocket>} Active connections map
   */
  getConnections(): Map<string, ExtendedWebSocket> {
    return new Map(this.connections);
  }

  /**
   * Get connection count
   * 
   * @method getConnectionCount
   * @returns {number} Number of active connections
   */
  getConnectionCount(): number {
    return this.connections.size;
  }

  /**
   * Close WebSocket service
   * 
   * @method close
   * @returns {Promise<void>} Promise that resolves when service is closed
   */
  async close(): Promise<void> {
    // Clear heartbeat interval
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    // Close all connections
    for (const socket of this.connections.values()) {
      socket.close(1000, 'Server shutting down');
    }

    // Close WebSocket server
    return new Promise((resolve) => {
      this.wss.close(() => {
        console.log('🔒 WebSocket service closed');
        resolve();
      });
    });
  }
}

// ============================================
// Built-in Middleware
// ============================================

/**
 * JWT Authentication Middleware for WebSocket
 * 
 * @function authenticateJWT
 * @description Verifies JWT token from handshake request and attaches user to socket
 * @param {WSRequest} req - WebSocket request
 * @param {WSResponse} res - WebSocket response
 * @param {WSNext} next - Next middleware function
 * 
 * @example
 * ```typescript
 * wsService.use(authenticateJWT);
 * ```
 */
export async function authenticateJWT(req: WSRequest, res: WSResponse, next: (error?: Error) => void): Promise<void> {
  try {
    // Extract token from handshake request (query parameter)
    const token = req.query.token || req.data.token;
    
    if (!token) {
      res.error('Authentication required', 'auth_required', 401);
      return;
    }

    // Verify token
    const payload = JWTService.verifyAccessToken(token);
    
    // Attach user to request and socket
    req.user = payload;
    req.socket.user = payload;
    req.socket.userId = payload.userId;

    // Continue to next middleware
    next();
  } catch (error) {
    res.error('Invalid or expired token', 'invalid_token', 401);
  }
}

/**
 * Family Access Middleware for WebSocket
 * 
 * @function authorizeFamilyAccess
 * @description Verifies that user has access to the requested family resource
 * @param {WSRequest} req - WebSocket request
 * @param {WSResponse} res - WebSocket response
 * @param {WSNext} next - Next middleware function
 * 
 * @example
 * ```typescript
 * wsService.use('family/update', [authenticateJWT, authorizeFamilyAccess]);
 * ```
 */
export async function authorizeFamilyAccess(req: WSRequest, res: WSResponse, next: (error?: Error) => void): Promise<void> {
  try {
    // Get family ID from request data or params
    const familyId = req.data.familyId || req.params.familyId;
    const userId = req.user?.userId;
    
    if (!familyId) {
      res.error('Family ID required', 'missing_family_id', 400);
      return;
    }

    if (!userId) {
      res.error('User not authenticated', 'unauthorized', 401);
      return;
    }

    // TODO: Implement family access check logic
    // This would typically check database for user-family relationship
    // For now, we'll just pass through
    next();
  } catch (error) {
    res.error('Authorization check failed', 'authorization_failed', 500);
  }
}

export default WebSocketService;
