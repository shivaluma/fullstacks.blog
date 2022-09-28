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

    sidebar = <div className="fixed top-0 left-0 flex flex-col items-end h-screen px-8 py-8 sm:max-w-xs sm:px-4 sidebar-bg">
      <Bio header={header} />
    </div>

  } else {

  }

  return (
    <div className="flex-1 h-screen max-h-screen" data-is-root-path={isRootPath}>
      <header className="w-full py-5 header-bg">
        <div className="container max-w-4xl px-5 mx-auto text-gray-100">
          <Link className="font-bold text-gray-200 text-md" to="/">{title} <span class="text-stone-300 inline-block animate-blink">▮</span></Link>
        </div>
      </header>
      <main className={`p-5 mx-auto bg-inherit max-w-4xl`}>{children}</main>

    </div>
  )
}

export default Layout
