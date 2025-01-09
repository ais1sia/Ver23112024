import { Link } from "react-router-dom"

const DashHeader = () => {
  return (
    <header className="dash-header">
      <div className="dash-header__container">
        <div className="flex items-center space-x-4">
          <Link to="/dash/materials">
            <h1 className="dash-header__title">ReadyAimFluent</h1>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default DashHeader

