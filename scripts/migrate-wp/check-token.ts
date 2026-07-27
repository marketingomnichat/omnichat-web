/**
 * Manual script: verifies the SANITY_API_DEVELOPMENT_TOKEN has write access.
 * Creates then deletes a test document. On 403, prints instructions and exits 1.
 *
 * Run: npx tsx scripts/migrate-wp/check-token.ts
 */
import { writeClient } from "./sanity-write";

const TEST_DOC_ID = "migrate-wp.token-check";

async function main() {
  console.log("Checking Sanity write token…");

  try {
    // Create a temporary doc
    await writeClient.createOrReplace({
      _id: TEST_DOC_ID,
      _type: "migrate.tokenCheck",
      createdAt: new Date().toISOString(),
    });

    // Immediately delete it
    await writeClient.delete(TEST_DOC_ID);

    console.log("Token OK — write access confirmed.");
  } catch (err: unknown) {
    const status = (err as { statusCode?: number }).statusCode;
    if (status === 403 || (err as { response?: { status?: number } }).response?.status === 403) {
      console.error(
        "\nToken ERROR (403 Forbidden).\n" +
          "The current token does not have write access.\n\n" +
          "To fix:\n" +
          "  1. Go to https://www.sanity.io/manage → your project → API → Tokens\n" +
          "  2. Create a new token with role 'Editor' (or 'Developer')\n" +
          "  3. Set SANITY_API_DEVELOPMENT_TOKEN=<new-token> in .env.local\n" +
          "  4. Re-run this script to verify.\n"
      );
      process.exit(1);
    }
    throw err;
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
