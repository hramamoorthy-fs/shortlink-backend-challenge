import 'dotenv/config';
import express from 'express';
import crypto from 'crypto';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from '@prisma/client';

// Extract the required classes from the imported packages
const { Pool } = pg;
const { PrismaClient } = pkg;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static files from the 'public' directory (Your Frontend)
app.use(express.static('public'));

// Setup the PostgreSQL Pool and Prisma Adapter using your .env variable
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Helper function to validate URLs
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
};

// Helper function to generate a unique short code
const generateShortCode = async (length = 6) => {
  let code;
  let isUnique = false;

  while (!isUnique) {
    code = crypto.randomBytes(Math.ceil(length * 0.5)).toString('hex').slice(0, length);
    
    // Check if the generated code already exists in Supabase
    const existingUrl = await prisma.url.findUnique({
      where: { shortCode: code }
    });
      
    if (!existingUrl) {
      isUnique = true;
    }
  }
  return code;
};

/**
 * POST /api/shorten
 * Generates a short code and saves the URL to Supabase
 */
app.post('/api/shorten', async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl || !isValidUrl(originalUrl)) {
    return res.status(400).json({ error: 'Invalid URL provided. Please provide a valid HTTP/HTTPS URL.' });
  }

  try {
    const shortCode = await generateShortCode();
    
    await prisma.url.create({
      data: {
        originalUrl: originalUrl,
        shortCode: shortCode
      }
    });

    const shortLink = `${req.protocol}://${req.get('host')}/${shortCode}`;

    res.status(201).json({
      originalUrl,
      shortCode,
      shortLink
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error while saving to database.' });
  }
});

/**
 * GET /:shortCode
 * Redirects to the original URL and tracks the visit
 */
app.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  try {
    // findUnique -> update ensures we atomically increment the visit counter
    const urlEntry = await prisma.url.update({
      where: { shortCode: shortCode },
      data: {
        visits: { increment: 1 }
      }
    });

    res.redirect(302, urlEntry.originalUrl);
  } catch (error) {
    // P2025 is Prisma's error code for "Record to update not found"
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Short code not found or invalid.' });
    }
    console.error(error);
    res.status(500).json({ error: 'Internal server error while fetching URL.' });
  }
});

/**
 * GET /api/stats/:shortCode
 * Returns the original URL and how many times it was visited
 */
app.get('/api/stats/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  try {
    const urlEntry = await prisma.url.findUnique({
      where: { shortCode: shortCode }
    });

    if (!urlEntry) {
      return res.status(404).json({ error: 'Short code not found.' });
    }

    res.status(200).json({
      shortCode,
      originalUrl: urlEntry.originalUrl,
      visits: urlEntry.visits
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error while fetching statistics.' });
  }
});

app.listen(PORT, () => {
  console.log(`URL Shortener service is running on http://localhost:${PORT}`);
});