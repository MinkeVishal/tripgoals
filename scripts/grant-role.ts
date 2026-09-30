/**
 * Grant or revoke a staff role.
 *
 *   npx tsx --env-file=.env scripts/grant-role.ts <email> <admin|editor|customer>
 *
 * Use this once to create the first admin: sign up on the site, then run it with your email.
 * After that, admins manage roles from Dashboard → Users.
 */
import { Client, Query, Users } from 'node-appwrite';

const [email, role] = process.argv.slice(2);
if (!email || !['admin', 'editor', 'customer'].includes(role ?? '')) {
  console.error('Usage: grant-role.ts <email> <admin|editor|customer>');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);
const users = new Users(client);

const found = await users.list({ queries: [Query.equal('email', email.toLowerCase())] });
const user = found.users[0];
if (!user) {
  console.error(`No account with email ${email}. Sign up on the site first.`);
  process.exit(1);
}

const kept = user.labels.filter((l) => l !== 'admin' && l !== 'editor');
await users.updateLabels({ userId: user.$id, labels: role === 'customer' ? kept : [...kept, role!] });
console.log(`${user.email} is now ${role}.`);
