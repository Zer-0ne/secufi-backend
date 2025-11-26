/**
 * @fileoverview WebSocket Type Definitions
 * @description Type definitions for WebSocket routing, middleware, and handlers
 * 
 * @module types/websocket
 * @author Secufi Team
 * @version 1.0.0
 */

import { WebSocket } from 'ws';
import { IncomingMessage } from 'http';

/**
 * Extended WebSocket with additional properties
 */
export interface ExtendedWebSocket extends WebSocket {
  id: string;
  userId?: string;
  user?: any;
  isAlive?: boolean;
  metadata?: Record<string, any>;
  rooms?: Set<string>;
}

/**
 * WebSocket request context
 * Similar to Express Request but for WebSocket messages
 */
export interface WSRequest {
  socket: ExtendedWebSocket;
  event: string;
  data: any;
  params: Record<string, string>;
  query: Record<string, string>;
  user?: any;
  metadata?: Record<string, any>;
}

/**
 * WebSocket response helper
 * Similar to Express Response but for WebSocket messages
 */
export interface WSResponse {
  socket: ExtendedWebSocket;
  
  /**
   * Send success response
   */
  success(data: any, message?: string): void;
  
  /**
   * Send error response
   */
  error(message: string, code?: string, statusCode?: number): void;
  
  /**
   * Send custom response
   */
  send(data: any): void;
  
  /**
   * Emit event to client
   */
  emit(event: string, data: any): void;
  
  /**
   * Broadcast to all clients in a room
   */
  broadcast(room: string, event: string, data: any): void;
  
  /**
   * Broadcast to all clients except sender
   */
  broadcastToOthers(event: string, data: any): void;
}

/**
 * WebSocket next function for middleware chain
 */
export type WSNext = (error?: Error) => void;

/**
 * WebSocket middleware function
 * Similar to Express middleware
 */
export type WSMiddleware = (
  req: WSRequest,
  res: WSResponse,
  next: WSNext
) => void | Promise<void>;

/**
 * WebSocket handler function
 * Similar to Express route handler
 */
export type WSHandler = (
  req: WSRequest,
  res: WSResponse
) => void | Promise<void>;

/**
 * WebSocket route definition
 */
export interface WSRoute {
  event: string;
  middlewares: WSMiddleware[];
  handler: WSHandler;
}

/**
 * WebSocket connection handler options
 */
export interface WSConnectionOptions {
  onConnect?: (socket: ExtendedWebSocket, req: IncomingMessage) => void | Promise<void>;
  onDisconnect?: (socket: ExtendedWebSocket, code: number, reason: Buffer) => void | Promise<void>;
  onError?: (socket: ExtendedWebSocket, error: Error) => void | Promise<void>;
  heartbeatInterval?: number;
  heartbeatTimeout?: number;
}

/**
 * WebSocket message format
 */
export interface WSMessage {
  event: string;
  data: any;
  messageId?: string;
  timestamp?: number;
}

/**
 * WebSocket error response format
 */
export interface WSErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    statusCode?: number;
  };
  event: string;
  timestamp: number;
}

/**
 * WebSocket success response format
 */
export interface WSSuccessResponse {
  success: true;
  data: any;
  message?: string;
  event: string;
  timestamp: number;
}
