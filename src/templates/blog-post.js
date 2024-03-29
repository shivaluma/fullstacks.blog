import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const BlogPostTemplate = ({ data, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const { previous, next } = data

  const commentBox = React.useRef(null)

  React.useEffect(() => {
    let scriptEl = document.createElement("script");
      scriptEl.setAttribute("src", "https://utteranc.es/client.js");
      scriptEl.setAttribute("crossorigin","anonymous");
      scriptEl.setAttribute("async", true);
      scriptEl.setAttribute("repo", "shivaluma/comments");
      scriptEl.setAttribute("issue-term", "pathname");
      scriptEl.setAttribute( "theme", "github-dark");
      commentBox.current.appendChild(scriptEl);
  }, [])

  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <article
        itemScope
        className="mt-16"
        itemType="http://schema.org/Article"
      >

        <Link to="/" rel="home">
          <div className="mb-4 text-gray-300">← Back to homepage</div>
        </Link>

        <header>
          <h1 itemProp="headline">{post.frontmatter.title}</h1>
          <p>{post.frontmatter.date}</p>
        </header>
        <section
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
        />
        <hr />
        <footer>
          
        </footer>
      </article>
      <nav className="blog-post-nav">
        <ul
          className="flex justify-between p-0 list-stype-none"
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev" className="text-gray-300">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next" className="text-gray-200">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>

      <section>

        <div ref={commentBox} className="comments" />
      </section>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
