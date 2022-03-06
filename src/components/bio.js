/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

const Bio = ({header}) => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            twitter
          }
        }
      }
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author

  return (
    <div className="flex flex-col items-end">
      
      <StaticImage
        className="bio-avatar"
        layout="fixed"
        formats={["auto", "webp", "avif"]}
        src="../images/avt.png"
        width={120}
        height={120}
        quality={80}
        alt="Profile picture"
      />

      <header>{header}</header>  
      <span className="font-bold text-gray-500 mb-5">By {author?.name}</span>
      {author?.name && (
        <p className="text-right text-sm ml-6">
          {author?.summary || null}
        </p>
      )}

      <section className="py-4 w-full flex flex-col items-end">
        <div className="header-top"></div>
        <Link to="/rss"><div className="py-1">RSS</div></Link>
        <Link to="http://github.com/shivaluma"><div className="py-1">Github</div></Link>
        <Link to="http://linkedin.com/shivaluma"><div className="py-1">LinkedIn</div></Link>
        <Link to="http://facebook.com/shiro.nvthanh"><div className="py-1">Facebook</div></Link>
      </section>
    </div>
  )
}

export default Bio
