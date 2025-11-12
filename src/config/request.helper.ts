import { Request } from 'express';
export function getClientOrigin(req: Request): string {
  // Priority order: 
  // 1. Custom origin from env
  // 2. Referer header
  // 3. Host header
  // 4. Fallback to IP

  if (process.env.CLIENT_ORIGIN) {
    return process.env.CLIENT_ORIGIN;
  }

  const referer = req.get('referer') || req.get('origin');
  if (referer) {
    return referer.replace(/\/$/, ''); // Remove trailing slash
  }

  const protocol = req.protocol || 'http';
  const host = req.get('host');
  
  if (host) {
    return `${protocol}://${host}`;
  }

  // Fallback to IP
  const ip = req.ip || req.socket.remoteAddress || 'localhost:3000';
  return `http://${ip}`;
}

export function getClientIP(req: Request): string {
  return (
    req.ip ||
    req.headers['x-forwarded-for'] as string ||
    req.headers['x-real-ip'] as string ||
    req.socket.remoteAddress ||
    'unknown'
  );
}
