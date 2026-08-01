# ARCHITECTURE_STANDARD.md

## Mission

Build every page as a production-quality web application, not a template
page.

## Core Principles

-   Every tool must be independently valuable.
-   Every page must be capable of ranking on its own.
-   Never generate placeholder or filler sections.
-   Reuse components, not content.
-   Shared UI is acceptable. Shared copy is not.

## Information Architecture

Every tool page includes:

1.  Breadcrumbs
2.  H1 with primary keyword
3.  Functional tool
4.  Result interpretation
5.  Example use case
6.  Educational article
7.  FAQ
8.  Related tools
9.  Parent category
10. Platform section
11. Sources

## Internal Linking

Each page links to: - 1 parent category - 5 sibling tools - 3
complementary tools - 1 topical guide

Anchor text should vary naturally.

## Component Rules

Reusable UI: - calculators - converters - charts - forms - navigation -
FAQ component

Never reuse: - introductions - conclusions - examples - FAQ wording -
explanatory paragraphs

## Metadata

Unique for every page: - title - meta description - H1 - slug -
canonical - Open Graph - Twitter metadata

## Schema

Generate when appropriate: - BreadcrumbList - WebApplication - FAQPage -
Article - Organization - WebSite - HowTo

## Performance

Target: - Lighthouse \>=95 - Minimal JS - SSR friendly - Fast LCP - Lazy
load noncritical assets

## URL Design

Short descriptive slugs. One canonical URL per intent.

## Quality Rule

Before a page is accepted ask:

"If this article disappeared, would the tool still deserve to rank?"

If no, improve the tool.
