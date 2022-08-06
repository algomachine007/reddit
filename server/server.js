import fastify from 'fastify';
import sensible from '@fastify/sensible';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

dotenv.config();
const app = fastify();
app.register(sensible);
app.get('/posts', async (req, res) => {
  return commitToDB(
    prisma.post.findMany({
      select: {
        id: true,
        title: true,
      },
    })
  );
});

async function commitToDB(promise) {
  const [error, data] = await app.to(promise);

  if (error) return app.httpErrors.internalServerError(error.message);

  return data;
}

app.listen({ port: process.env.PORT });
