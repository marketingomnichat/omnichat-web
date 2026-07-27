/**
 * WordPress REST API client with pagination support.
 */

export async function wpFetchAll<T>(endpoint: string): Promise<T[]> {
  const results: T[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const url = new URL(endpoint);
    url.searchParams.set("per_page", "100");
    url.searchParams.set("page", String(page));

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(
        `WordPress API error: ${response.status} ${response.statusText} — ${url.toString()}`
      );
    }

    const pagesHeader = response.headers.get("x-wp-totalpages");
    if (pagesHeader) {
      totalPages = parseInt(pagesHeader, 10);
    }

    const data = (await response.json()) as T[];
    results.push(...data);
    page++;
  } while (page <= totalPages);

  return results;
}
