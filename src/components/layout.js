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
        <Link className="text-2xl text-gray-50" to="/">{title}</Link>
      </h1>
    )

    sidebar = <div className="flex flex-col py-8 px-8 sm:max-w-xs sm:px-4 sidebar-bg h-screen items-end top-0 left-0 fixed">
      <Bio header={header} />
    </div>

  } else {

  }

  return (
    <div className="flex relative flex-col sm:flex-row flex-1 h-screen max-h-screen" data-is-root-path={isRootPath}>
      {sidebar}
      <main className={`p-5 ${!isRootPath ? 'mx-auto bg-inherit' : 'ml-80 overflow-y-auto w-full'} `}>{children}</main>

    </div>
  )
}

export default Layout
