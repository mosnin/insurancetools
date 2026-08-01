# Insurance Tools — Project Instructions

## Project Identity

- Project name: Insurance Tools
- Domain: InsuranceTools.org
- Primary business model: Google AdSense revenue generated through high intent organic search traffic.
- Primary product: A large network of genuinely useful browser based insurance tools, calculators, estimators, comparison tools, coverage tools, claim tools, and decision support utilities.

The site must become the highest quality insurance utility platform available online.

## Primary Objective

Build browser based insurance tools that deserve to rank because they solve real user problems better than competing pages.

The objective is not to mass produce pages. The objective is to create the best available tool for each specific search intent.

Every tool must:

- Solve a real insurance problem
- Work correctly
- Provide unique value
- Be independently useful
- Target a distinct search intent
- Be designed to rank organically
- Support the topical authority of its category
- Generate long term AdSense traffic
- Avoid thin, repetitive, or template generated content

## Required Standards

Before researching, designing, creating, modifying, or auditing any tool, read and follow all of these files (in `docs/standards/`):

1. `TOOL_CREATION_STANDARD.md`
2. `NICHE_RESEARCH_STANDARD.md`
3. `ARCHITECTURE_STANDARD.md`
4. `SEO_AUDIT_STANDARD.md` — **not yet supplied.** Ask the user for this file before relying on it; do not fabricate its contents. Until it is provided, apply the Quality Audit and Final Acceptance Test sections below as the closest available substitute.

These documents are mandatory, not suggestions. They apply to every tool page, category page, article, guide, component, metadata object, schema object, internal link, and sitemap entry.

When instructions conflict, use the interpretation that produces the highest quality user experience and the strongest long term organic search value.

## Operating Sequence

For every new tool, follow this sequence:

1. Research the search opportunity
2. Confirm that the intent is real
3. Confirm that the tool can provide meaningful browser based functionality
4. Identify the parent topic cluster
5. Identify the focus keyword
6. Identify non cannibalizing long tail keywords
7. Analyze competing results
8. Define how the new tool will improve upon existing tools
9. Design the tool functionality
10. Implement the tool
11. Create unique supporting content
12. Add internal links
13. Add authoritative outbound references
14. Add metadata
15. Add structured data
16. Add breadcrumbs
17. Add the page to the sitemap
18. Run the complete SEO and quality audit
19. Reject and improve the page if it fails any standard

Never skip directly to generation without completing the research and differentiation stages.

## Tool First Philosophy

The functional tool is the primary value of the page. The supporting article exists to:

- Explain the tool
- Explain the calculation or methodology
- Help users interpret the result
- Answer related questions
- Build trust
- Strengthen topical authority

The article must never exist only to increase word count.

Ask this before approving any page: **if the supporting article disappeared, would the tool itself still deserve to rank?** If the answer is no, improve the tool.

## Anti Thin Content Standard

Google must never be able to reasonably classify the site as thin, repetitive, doorway based, scaled template content, or a content farm.

Reject any page that:

- Exists only to target a keyword
- Repeats another page with minor changes
- Uses interchangeable paragraphs
- Uses filler to reach a word count
- Provides no unique functionality
- Has the same introduction as other pages
- Has the same examples as other pages
- Has the same FAQ structure as other pages
- Has the same article flow as every other page
- Provides a generic answer that could apply to dozens of tools
- Rewords an existing page without creating new value

Reusable components are allowed. Reusable page copy is not allowed, except for limited brand, legal, safety, and platform language. Shared visual structure must not result in shared informational substance.

## Uniqueness Requirements

Every tool page must contain unique: search intent, tool logic, inputs, outputs, result explanation, examples, use cases, limitations, FAQs, supporting article, internal link selection, metadata, schema values, sources, recommendations, related tool pathways.

Do not artificially rewrite identical content using synonyms. True uniqueness must come from the subject, functionality, user problem, methodology, examples, and interpretation.

## Insurance Platform Categories

The platform may include: Auto insurance, Homeowners insurance, Renters insurance, Life insurance, Health insurance, Business insurance, Disability insurance, Umbrella insurance, Pet insurance, Travel insurance, Claims, Deductibles, Coverage planning, Policy comparisons, Insurance terminology, State requirements, Risk assessment, Replacement cost, Actual cash value, Settlement estimation, Premium analysis, Coverage gaps.

Each category must function as a coherent topic cluster.

> The live taxonomy on insurancetools.org today (see `src/lib/category-content.ts`) is: Auto, Home, Life, Health, Business, Renters, Travel, Pet, Claims, Deductibles, Coverage, State Requirements. Disability and Umbrella insurance are in-scope per this document but not yet in the live taxonomy — raise with the user before adding new top-level categories.

## Topic Cluster Requirements

Every tool must belong to a clearly defined category. Every tool page must link to its parent category, relevant sibling tools, complementary tools, related educational guides, and more specific or broader tools where appropriate. No page may be orphaned. Internal links must help users continue solving related problems. Anchor text must be natural, descriptive, and varied. Do not create internal links only for search engines.

## Keyword Research Requirements

For every tool, identify: one primary focus keyword, five to eight long tail keywords, question based keywords, comparison keywords, alternative terminology, related entities, supporting concepts, primary search intent, secondary search intent, estimated competition, estimated commercial value, and the reason the tool deserves to rank.

Keywords must not cannibalize existing pages. One page must target one primary intent. Do not create multiple pages that solve the same problem unless the intent, inputs, outputs, or audience are meaningfully different.

## Search Intent Requirements

Classify intent as Informational, Commercial, Transactional, or Navigational. The page must satisfy the primary intent immediately — a user should not need to read a long article before accessing the tool. The tool should appear prominently near the top of the page.

## Tool Quality Requirements

Every tool must: work accurately, work on mobile, work on desktop, validate inputs, handle edge cases, explain invalid inputs, show useful results, explain what the results mean, avoid misleading precision, explain assumptions, explain limitations, include professional guidance where appropriate, avoid representing estimates as guaranteed outcomes.

Where appropriate, include: live updating results, charts, comparison mode, advanced options, presets, export, copy result, printable summary, formula explanation, example calculation, result ranges, scenario analysis, actionable next steps.

Each tool must include at least one meaningful improvement over typical competitors.

## Insurance Accuracy and Trust

Insurance tools may influence financial decisions. Never fabricate: state requirements, coverage limits, tax rules, policy language, claim rules, legal requirements, government data, industry statistics.

Use authoritative sources. Preferred sources include: state insurance departments, federal agencies, government publications, official insurance regulators, standards organizations, academic institutions, recognized actuarial organizations, trusted industry bodies.

Explain assumptions clearly. State when results are estimates. State when users should consult a licensed insurance agent, a financial professional, a claims professional, an attorney, a tax professional, or a state insurance regulator. Do not provide individualized legal, tax, medical, or regulated insurance advice.

## Content Requirements

Supporting content should be as long as necessary to completely satisfy the intent. A typical target is approximately 900–1380 words when the topic requires that depth. Do not pad content. Do not force every article to have the same length.

Every article should generally address: what the tool does, who should use it, how to use it, how the result is calculated, what the result means, a realistic example, common mistakes, important assumptions, limitations, relevant insurance terminology, frequently asked questions, related tools, authoritative sources.

Section order should vary according to the tool and intent. Do not mechanically use the same heading sequence on every page.

## Focus Keyword Placement

The focus keyword should appear naturally in: the URL slug, the page title, the SEO title, the H1, the meta description, the first ten percent of the article, at least one relevant subheading, relevant image alt text when images exist. Do not force exact match phrases where they reduce readability. Avoid keyword stuffing.

## Title Requirements

Every page requires a unique H1, SEO title, meta description, canonical URL, Open Graph title, Open Graph description, and social metadata. The slug should closely match the primary keyword.

Do not mechanically use the same title pattern for every tool. "100% Free Online" may be used only when it improves clarity and click value; do not use the exact same title prefix across every page. Rotate natural patterns based on intent, e.g. "Free Online Tool Name," "Tool Name Calculator," "Tool Name Estimator," "Compare Tool Name Options," "Calculate Tool Name Online," "Tool Name Guide and Calculator." Do not produce titles that look mass generated.

## Article Originality

Every article introduction must be original. Never reuse opening sentences, paragraph structures, examples, transitions, conclusions, FAQ wording, section order, common mistake lists, benefit lists, or formula explanations across pages. Do not create artificial uniqueness through word substitution — every page must reflect the actual tool, audience, use case, and insurance context.

## FAQ Requirements

Every tool page should include an FAQ when useful. FAQs must answer real user questions, be specific to the tool, avoid generic insurance questions, avoid duplicate answers, avoid unnecessary keyword repetition, and be concise but complete. Only use FAQ structured data when the visible page contains the same questions and answers.

## Outbound Link Requirements

Use approximately three to five authoritative outbound sources when the subject requires evidence. Prefer primary sources. Do not link to low quality blogs, affiliate sites, scraped pages, or competitors merely to satisfy a link count. Every outbound source must support a specific claim, rule, definition, methodology, or limitation.

## Structured Data Requirements

Use valid structured data where appropriate: BreadcrumbList, WebApplication, SoftwareApplication, FAQPage, Article, Organization, WebSite, HowTo. Do not use schema that does not accurately match the visible page. Do not generate fake reviews, ratings, authors, dates, pricing, or organizational claims. Validate structured data before shipping.

## Breadcrumb Requirements

Every tool page requires visible breadcrumbs reflecting the actual hierarchy, e.g. `Home > Auto Insurance Tools > Coverage Calculators > Liability Coverage Calculator`. Breadcrumb structured data must match the visible breadcrumbs.

## Sitemap Requirements

The XML sitemap must include canonical indexable pages only; exclude redirects, error pages, duplicate URLs, parameter variations, and pages marked noindex; use accurate modification dates; be split into logical groups at scale; be referenced in `robots.txt`; and remain valid as the platform grows. A sitemap is not schema — do not call it "sitemap schema."

## Technical Architecture

Use clean, semantic, accessible HTML. Prioritize server rendered or statically generated indexable content, fast first render, low JavaScript overhead, stable layouts, fast interaction, mobile usability, accessibility, correct labels, keyboard support, clear focus states, Core Web Vitals, minimal third party scripts. Target a Lighthouse performance score of at least 95 where realistically possible.

## AdSense Requirements

The primary revenue source is Google AdSense. Ad placement must not reduce tool usefulness. Do not create pages around ads, obscure the tool with advertising, place ads in ways that cause accidental clicks, or create deceptive buttons or layouts. Maintain enough original value that the page is clearly a functional product, not an ad container.

Prioritize high viewability, strong UX, clear content hierarchy, fast loading, mobile friendly ad placements, useful session depth, related tool discovery. The tool must remain fully usable without interacting with an advertisement.

## Brand Requirements

- Brand name: Insurance Tools
- Domain: InsuranceTools.org
- Positioning: Free browser based tools that help users understand insurance coverage, costs, claims, deductibles, policies, and financial risk.
- Brand characteristics: Trustworthy, Clear, Useful, Modern, Professional, Accessible, Non sensational, Non manipulative.

Avoid exaggerated promises. Avoid implying affiliation with insurers, regulators, or government agencies.

## Reusable Platform Section

A short Insurance Tools platform section may appear near the bottom of tool pages, explaining that Insurance Tools provides free browser based insurance utilities. The language may be structurally reusable, but wording should vary enough to avoid obvious duplication across thousands of pages. Do not allow the reusable section to become a large percentage of the page content.

## Competitor Analysis

Before building a tool, examine the strongest competing results. Identify missing functionality, poor explanations, weak mobile design, unclear outputs, missing examples, missing methodology, missing limitations, slow workflows, excessive friction, registration walls, weak visualizations.

The Insurance Tools version must outperform competitors in at least three meaningful ways, e.g. better functionality, faster workflow, better explanation, better mobile experience, better scenario comparison, better transparency, better examples, better source quality, better result interpretation.

## Quality Audit

Before considering a page complete, verify: the tool works; calculations are accurate; inputs are validated; edge cases are handled; results are understandable; the tool is useful without the article; the content is unique; the content is not thin; the page satisfies one clear intent; the focus keyword is used naturally; metadata is unique; internal links are useful; sources are authoritative; schema is valid; breadcrumbs are correct; the page is in the sitemap; the page is mobile responsive; the page has no console errors; the page is accessible; the page loads quickly; the page does not look mass generated; the page does not duplicate another page; the page strengthens its topic cluster; the page deserves to rank.

If any item fails, do not mark the tool complete. Fix the problem first.

## Final Acceptance Test

Before shipping any page, every answer below must be yes:

1. Does this tool solve a real problem?
2. Is it more useful than the current ranking alternatives?
3. Is its content genuinely unique?
4. Could a user understand the result?
5. Does the page clearly explain assumptions and limitations?
6. Does it strengthen the site's insurance authority?
7. Would a human bookmark or recommend it?
8. Would the page deserve to rank without backlinks?
9. Is the page clearly more than a template?
10. Would this page remain valuable if search engines did not exist?

## Default Instruction

When asked to create a tool, never immediately begin writing code or content. First provide:

- Search intent
- Primary keyword
- Long tail keywords
- Topic cluster placement
- Competitor gaps
- Tool functionality
- Differentiation
- Content plan
- Internal linking plan
- Schema plan
- Quality risks

Then build the tool according to all required standards.

The permanent standard for InsuranceTools.org is:

**Build the best browser based insurance utility on the internet for each exact search intent.**
