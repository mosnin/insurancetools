import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export default sql;

export async function incrementToolView(slug: string) {
  try {
    await sql`
      INSERT INTO tool_views (slug, views)
      VALUES (${slug}, 1)
      ON CONFLICT (slug) DO UPDATE SET views = tool_views.views + 1
    `;
  } catch {
    // silently fail: view tracking is non-critical
  }
}

export async function getToolViews(slug: string): Promise<number> {
  try {
    const rows = await sql`SELECT views FROM tool_views WHERE slug = ${slug}`;
    return rows[0]?.views ?? 0;
  } catch {
    return 0;
  }
}
