import mongoose from "mongoose";

const MONGODB_USER = process.env.MONGODB_USER!;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD!;
const MONGODB_CLUSTER = process.env.MONGODB_CLUSTER!;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE ?? "ludicamente";
const MONGODB_APP_NAME = process.env.MONGODB_APP_NAME ?? "ludicamente";
const MONGODB_CONNECTION_MODE = process.env.MONGODB_CONNECTION_MODE ?? "srv";
const MONGODB_DIRECT_HOSTS = process.env.MONGODB_DIRECT_HOSTS ?? "";
const MONGODB_REPLICA_SET = process.env.MONGODB_REPLICA_SET ?? "";

function buildConnectionString(): string {
  const encodedPassword = encodeURIComponent(MONGODB_PASSWORD);

  if (MONGODB_CONNECTION_MODE === "direct") {
    const hosts = MONGODB_DIRECT_HOSTS;
    return (
      `mongodb://${MONGODB_USER}:${encodedPassword}@${hosts}` +
      `/${MONGODB_DATABASE}?ssl=true&replicaSet=${MONGODB_REPLICA_SET}` +
      `&authSource=admin&appName=${MONGODB_APP_NAME}`
    );
  }

  if (MONGODB_CONNECTION_MODE === "local") {
    return `mongodb://localhost:27017/${MONGODB_DATABASE}`;
  }

  // srv (default)
  return (
    `mongodb+srv://${MONGODB_USER}:${encodedPassword}` +
    `@${MONGODB_CLUSTER}/${MONGODB_DATABASE}` +
    `?retryWrites=true&w=majority&appName=${MONGODB_APP_NAME}`
  );
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

const globalWithCache = global as typeof globalThis & {
  mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
};

if (!globalWithCache.mongooseCache) {
  globalWithCache.mongooseCache = { conn: null, promise: null };
}

const cache = globalWithCache.mongooseCache;

export async function connectDB(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    const uri = buildConnectionString();
    cache.promise = mongoose.connect(uri, { bufferCommands: false }).then((m) => m);
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
