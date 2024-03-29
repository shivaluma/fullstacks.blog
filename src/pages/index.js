import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <Layout className="flex" location={location} title={siteTitle}>
      <Seo title="Fullstack blog" />
      <ol className="list-style-none">
        {posts.map(post => {
          const title = post.frontmatter.title || post.fields.slug

          return (
            <li key={post.fields.slug}>
              <article
                className="post-list-item max-w-sm"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <small className="flex items-center">
                    <time className="text-gray-400">{post.frontmatter.date}</time> 
                    <span className="ml-2 text-zinc-300">{post.frontmatter.tags.join(', ')}</span>
                  </small>
                  <h2 className="flex">
                    <Link to={post.fields.slug} itemProp="url">
                      <span className="text-base font-medium text-gray-200" itemProp="headline">{title}</span>
                    </Link>
                  </h2>
                </header>
              </article>
            </li>
          )
        })}
      </ol>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "DD-MM-YYYY")
          title
          description
          tags
        }
      }
    }
  }
`
