import postgres from 'postgres';

// Ensure the POSTGRES_URL is available
if (!process.env.POSTGRES_URL) {
  throw new Error('Missing POSTGRES_URL environment variable');
}

// Create a postgres connection
// This works with local PostgreSQL databases (like Docker)
export const sql = postgres(process.env.POSTGRES_URL, {
  // Connection pool configuration
  max: 10, // Maximum number of connections
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Timeout after 10 seconds
});
