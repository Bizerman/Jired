import { createConnection } from 'typeorm';

async function test() {
  try {
    const conn = await createConnection({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: '3657635',
      database: 'jira_development',
      synchronize: false,
    });
    await conn.close();
  } catch (error) {
    console.error('❌ Connection error:', error);
  }
}

test();