import { BlogPost } from "@/types";

interface StructuredDataProps {
  post?: BlogPost;
  type: "website" | "blog" | "article";
}

export default function StructuredData({ post, type }: StructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://voidd.space";

  const generateWebsiteSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Website",
    name: "Void Space",
    description:
      "A contemplative space for deep thoughts, mindful reflections, and meaningful connections.",
    url: baseUrl,
    author: {
      "@type": "Person",
      name: "Vedant Karle",
      url: `${baseUrl}`,
    },
    publisher: {
      "@type": "Organization",
      name: "Void Space",
      url: baseUrl,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/?tag={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  });

  const generateBlogSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Void Space Blog",
    description:
      "Thoughts on consciousness, technology, and the spaces between thoughts.",
    url: baseUrl,
    author: {
      "@type": "Person",
      name: "Vedant Karle",
      url: `${baseUrl}`,
    },
    publisher: {
      "@type": "Organization",
      name: "Void Space",
      url: baseUrl,
    },
  });

  const generateArticleSchema = (post: BlogPost) => ({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.bannerImage || `${baseUrl}/og-image.png`,
    url: `${baseUrl}/blog/${post.slug}`,
    datePublished: (post.publishedAt || post.createdAt).toISOString(),
    dateModified: (
      post.updatedAt ||
      post.publishedAt ||
      post.createdAt
    ).toISOString(),
    author: {
      "@type": "Person",
      name: post.author.displayName,
      url: `${baseUrl}`,
    },
    publisher: {
      "@type": "Organization",
      name: "Void Space",
      url: baseUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${post.slug}`,
    },
    keywords: post.tags.join(", "),
    wordCount: post.content.split(/\s+/).length,
    timeRequired: `PT${post.readingTime}M`,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    ...(post.category && {
      about: {
        "@type": "Thing",
        name: post.category,
      },
    }),
  });

  let schema;
  switch (type) {
    case "website":
      schema = generateWebsiteSchema();
      break;
    case "blog":
      schema = generateBlogSchema();
      break;
    case "article":
      if (!post) return null;
      schema = generateArticleSchema(post);
      break;
    default:
      return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
