import express, { Router } from 'express';
import https from 'https';
import http from 'http';
import os from 'os';

const deviceInfoRouter = Router()

/**
 * Extract IPv4 and IPv6 from request
 */
const extractIPVersions = (ip: string) => {
  let ipv4 = null;
  let ipv6 = null;
  let type = 'IPv4';

  // IPv6 mapped IPv4 (::ffff:192.168.1.1)
  if (ip.includes('::ffff:')) {
    ipv4 = ip.replace('::ffff:', '');
    ipv6 = ip;
    type = 'Mixed (IPv4-mapped IPv6)';
  }
  // Pure IPv6
  else if (ip.includes(':')) {
    ipv6 = ip;
    type = 'IPv6';
  }
  // Pure IPv4
  else {
    ipv4 = ip;
    type = 'IPv4';
  }

  return { ipv4, ipv6, type };
};

/**
 * Get location using free public API (no package needed)
 * Using ip-api.com (45 requests/minute, no API key needed)
 */
const getLocationFromAPI = (ip: string) => {
  return new Promise((resolve, reject) => {
    // Skip localhost and private IPs
    if (ip === '127.0.0.1' || ip === '::1' ||
      ip.startsWith('192.168.') ||
      ip.startsWith('10.') ||
      ip.startsWith('172.')) {
      resolve({
        country: 'Localhost',
        region: 'Local Network',
        city: 'Private IP',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        message: 'Cannot geolocate private/localhost IP'
      });
      return;
    }

    const url = `http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`;

    http.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);

          if (parsed.status === 'success') {
            resolve({
              country: parsed.country,
              countryCode: parsed.countryCode,
              region: parsed.regionName,
              city: parsed.city,
              zip: parsed.zip,
              timezone: parsed.timezone,
              latitude: parsed.lat,
              longitude: parsed.lon,
              coordinates: {
                lat: parsed.lat,
                lng: parsed.lon
              },
              isp: parsed.isp,
              org: parsed.org,
              as: parsed.as
            });
          } else {
            resolve({ message: parsed.message || 'Location not found' });
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
};

/**
 * Alternative API - ip.guide (no rate limit, no API key)
 */
const getLocationFromIPGuide = (ip: string) => {
  return new Promise((resolve, reject) => {
    https.get(`https://ip.guide/${ip}`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({
            country: parsed.location?.country,
            region: parsed.location?.state,
            city: parsed.location?.city,
            timezone: parsed.location?.timezone,
            latitude: parsed.location?.latitude,
            longitude: parsed.location?.longitude,
            isp: parsed.network?.autonomous_system_organization
          });
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
};

/**
 * Get server's own IP address
 */
const getServerLocalIP = () => {
  const interfaces = os.networkInterfaces();

  for (const interfaceName in interfaces) {
    for (const net of interfaces[interfaceName]!) {
      // Skip internal and non-IPv4 addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '127.0.0.1';
};

/**
 * Main route
 */
deviceInfoRouter.get('/', async (req, res) => {
  // Get client IP (multiple fallbacks)
  const clientIp = (req.headers['x-forwarded-for'] || '' as any).split(',')[0].trim() ||
    req.headers['x-real-ip'] ||
    req.socket.remoteAddress ||
    req.connection.remoteAddress ||
    req.ip;

  // Extract IPv4 and IPv6
  const { ipv4, ipv6, type } = extractIPVersions(clientIp);

  // Check if localhost or private IP
  const isLocalhost = clientIp === '127.0.0.1' || clientIp === '::1' || clientIp.includes('::ffff:127.0.0.1');
  const isPrivate = ipv4 ? (
    ipv4.startsWith('192.168.') ||
    ipv4.startsWith('10.') ||
    ipv4.startsWith('172.16.') ||
    ipv4.startsWith('172.31.')
  ) : false;

  // Get location data
  let location = {};
  try {
    location = await getLocationFromAPI(ipv4 || clientIp) as any;
  } catch (error) {
    console.error('Location fetch error:', error);
    location = {
      message: 'Unable to fetch location',
      error: (error as Error).message
    };
  }

  // Server info
  const serverIP = getServerLocalIP();

  console.log(`🌐 Incoming request from IP: ${clientIp}, user data: ${JSON.stringify({
    message: 'Welcome to the Secufi Wallet!',
    status: 'running',
    ip: {
      original: clientIp,
      ipv4: ipv4,
      ipv6: ipv6,
      type: type,
      isLocalhost: isLocalhost,
      isPrivate: isPrivate
    },
    location: location,
    getLocationFromIPGuide: {
      ...(await getLocationFromIPGuide(ipv4 || clientIp).catch(err => ({ error: err.message }))) as any
    },
    server: {
      localIP: serverIP,
      hostname: os.hostname(),
      platform: os.platform(),
      uptime: os.uptime()
    },
    request: {
      method: req.method,
      userAgent: req.headers['user-agent'],
      language: req.headers['accept-language'],
      referer: req.headers['referer'] || 'Direct'
    },
    timestamp: new Date().toISOString()
  })}`);

  res.json({
    message: 'Welcome to the Secufi Wallet',
    status: 'running',
    ip: {
      original: clientIp,
      ipv4: ipv4,
      ipv6: ipv6,
      type: type,
      isLocalhost: isLocalhost,
      isPrivate: isPrivate
    },
    location: location,
    AlternateLocation: {
      ...(await getLocationFromIPGuide(ipv4 || clientIp).catch(err => ({ error: err.message }))) as any
    },
    server: {
      localIP: serverIP,
      hostname: os.hostname(),
      platform: os.platform(),
      uptime: os.uptime()
    },
    request: {
      method: req.method,
      userAgent: req.headers['user-agent'],
      language: req.headers['accept-language'],
      referer: req.headers['referer'] || 'Direct'
    },
    timestamp: new Date().toISOString()
  });
});

export default deviceInfoRouter;