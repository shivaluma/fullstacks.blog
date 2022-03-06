import * as React from "react"
import { Link } from "gatsby"
import Bio from './bio'

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header
  let sidebar
  if (isRootPath) {


    header = (
      <h1>
        <Link className="text-2xl" to="/">{title}</Link>
      </h1>
    )

    sidebar = <div className="flex flex-col py-8 px-8 sm:max-w-xs sm:px-4 bg-zinc-100 h-full items-end">
      <Bio header={header} />
    </div>

  } else {

  }

  return (
    <div className="flex h-auto sm:h-screen flex-col sm:flex-row" data-is-root-path={isRootPath}>
      {sidebar}
      <main className={`p-5 ${!isRootPath ? 'mx-auto' : ''}`}>{children}</main>

    </div>
  )
}

export default Layout
