import { env } from "cloudflare:workers";
import pg from "pg";

const { Client } = pg;

const createClient = () =>
  new Client({
    connectionString: env.HYPERDRIVE.connectionString,
  });

const pool = {
  query: async (text, params = []) => {
    const client = createClient();

    try {
      await client.connect();
      return await client.query(text, params);
    } finally {
      await client.end();
    }
  },

  connect: async () => {
    const client = createClient();

    await client.connect();

    return {
      query: (text, params = []) => client.query(text, params),

      release: async () => {
        await client.end();
      },
    };
  },
};

export default pool;
