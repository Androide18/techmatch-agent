import { NextResponse } from 'next/server';
import Airtable from 'airtable';
import { google } from '@ai-sdk/google';
import { embedMany } from 'ai';
import { sql } from '@/lib/db';

const EMBEDDING_MODEL = 'text-embedding-004';
const COLLECTION_NAME = 'employee_profiles_techmatch';
const BATCH_SIZE = 10; // Process 10 records at a time (Gemini has higher limits)
const DELAY_BETWEEN_BATCHES = 500; // 500ms delay between batches

const {
  AIRTABLE_API_KEY,
  AIRTABLE_BASE_ID,
  AIRTABLE_TABLE_ID,
  GOOGLE_GENERATIVE_AI_API_KEY,
} = process.env;

// Helper function to sleep for a specified time
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const checkEnvVars = () => {
  const missingVars = [
    !AIRTABLE_API_KEY && 'AIRTABLE_API_KEY',
    !AIRTABLE_BASE_ID && 'AIRTABLE_BASE_ID',
    !AIRTABLE_TABLE_ID && 'AIRTABLE_TABLE_ID',
    !GOOGLE_GENERATIVE_AI_API_KEY && 'GOOGLE_GENERATIVE_AI_API_KEY',
  ]
    .filter(Boolean)
    .join(', ');

  return {
    missingEnvVars: missingVars,
    hasMissing: missingVars.length > 0,
  };
};

export async function GET() {
  try {
    const { missingEnvVars, hasMissing } = checkEnvVars();
    if (hasMissing) {
      return NextResponse.json(
        { error: `Missing required environment variables: ${missingEnvVars}` },
        { status: 500 }
      );
    }

    // Initialize clients
    const airtable = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(
      AIRTABLE_BASE_ID!
    );

    const logs: string[] = [];
    logs.push('Starting database seeding process...');

    // Setup PostgreSQL
    logs.push('Setting up PostgreSQL process...');

    // Enable the pgvector extension
    await sql`CREATE EXTENSION IF NOT EXISTS vector`;
    logs.push('✓ Enabled pgvector extension.');

    // Create the table to store the data and embeddings
    const tableResult = await sql`
      CREATE TABLE IF NOT EXISTS employee_profiles_techmatch (
        id SERIAL PRIMARY KEY,
        record_id TEXT UNIQUE,
        content TEXT,
        metadata JSONB,
        embedding VECTOR(768)
      );
    `;

    // Check if table already existed or was created
    if (tableResult.command === 'CREATE') {
      logs.push(`✓ Created table ${COLLECTION_NAME} with 768 dimensions.`);
    } else {
      logs.push(`✓ Table ${COLLECTION_NAME} already exists with 768 dimensions.`);
    }

    // Fetch records from Airtable
    logs.push('Fetching records from Airtable...');
    const records = await airtable(AIRTABLE_TABLE_ID!).select().all();
    logs.push(`Fetched ${records.length} records.`);

    // Filter active records first
    const activeRecords = records.filter(
      (record) =>
        record.fields['Full Name'] && record.fields['Status'] === 'Active'
    );
    const skippedCount = records.length - activeRecords.length;
    logs.push(
      `Filtered to ${activeRecords.length} active records (${skippedCount} skipped).`
    );

    // Process records in batches
    logs.push(
      `Processing records in batches of ${BATCH_SIZE} with rate limit handling...`
    );
    let processedCount = 0;
    const totalBatches = Math.ceil(activeRecords.length / BATCH_SIZE);

    for (let i = 0; i < activeRecords.length; i += BATCH_SIZE) {
      const batch = activeRecords.slice(i, i + BATCH_SIZE);
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;

      logs.push(
        `Processing batch ${batchNumber}/${totalBatches} (${batch.length} records)...`
      );

      // Prepare batch data (content, metadata, record IDs)
      const batchData = batch.map((record) => {
        const fields = record.fields;

        const content = `
    Professional Profile: ${fields['Full Name'] || 'N/A'}, ${
          fields['Position'] || fields['Job'] || 'N/A'
        }, Seniority: ${fields['Seniority'] || 'N/A'}

    Summary:
    ${fields['About you'] || 'No personal summary provided.'}

    Core Role:
    - Job Title: ${fields['Position'] || fields['Job'] || 'N/A'}
    - Department: ${fields['Area'] || 'N/A'}
    - Seniority Level: ${fields['Seniority'] || 'N/A'}
    - Contract Type: ${fields['Type of Contract']?.join(', ') || 'N/A'}

    Technical Skills:
    - Primary Skills: ${
      fields['Skills']?.join(', ') || 'No technical skills listed.'
    }

    Education:
    - University: ${fields['University'] || 'N/A'}
    - Degree: ${fields['Career'] || 'N/A'}
    - Status: ${fields['Career status'] || 'N/A'}
        `
          .trim()
          .replace(/\n\s+/g, '\n');

        const metadata = {
          record_id: record.id,
          full_name: fields['Full Name'] || null,
          email: fields['Email'] || null,
          status: fields['Status'] || null,
          area: fields['Area'] || null,
          job_title: fields['Position'] || fields['Job'] || null,
          seniority: fields['Seniority'] || null,
          location: fields['Location'] || null,
          office: fields['Office'] || null,
          profile_picture_url:
            fields['Profile Picture']?.[0]?.thumbnails?.large?.url || null,
        };

        return {
          recordId: record.id,
          content,
          metadata,
          fullName: fields['Full Name'],
        };
      });

      // Generate embeddings for the entire batch using Vercel AI SDK
      const batchContents = batchData.map((item) => item.content);
      const { embeddings } = await embedMany({
        model: google.textEmbeddingModel(EMBEDDING_MODEL),
        values: batchContents,
      });

      // Insert all records from the batch into the database
      for (let j = 0; j < batchData.length; j++) {
        const { recordId, content, metadata, fullName } = batchData[j];
        const embedding = embeddings[j];

        await sql`
          INSERT INTO employee_profiles_techmatch (record_id, content, metadata, embedding)
          VALUES (${recordId}, ${content}, ${JSON.stringify(
          metadata
        )}, ${JSON.stringify(embedding)})
          ON CONFLICT (record_id) DO UPDATE SET
            content = EXCLUDED.content,
            metadata = EXCLUDED.metadata,
            embedding = EXCLUDED.embedding;
        `;

        processedCount++;
        logs.push(
          `✓ Processed ${fullName} (${processedCount}/${activeRecords.length})`
        );
      }

      // Add delay between batches to avoid rate limits
      if (i + BATCH_SIZE < activeRecords.length) {
        logs.push(`Waiting ${DELAY_BETWEEN_BATCHES}ms before next batch...`);
        await sleep(DELAY_BETWEEN_BATCHES);
      }
    }

    logs.push(
      `✅ Successfully seeded/updated ${processedCount} employee profiles (${skippedCount} skipped).`
    );

    return NextResponse.json(
      {
        success: true,
        message: `Successfully seeded ${processedCount} employee profiles`,
        processed: processedCount,
        skipped: skippedCount,
        total: records.length,
        logs,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ An error occurred during seeding:', error);
    return NextResponse.json(
      {
        error: 'Failed to seed database',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
