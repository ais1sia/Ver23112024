import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const DashHeader = () => {
  return (
    <header className="dash-header">
      <div className="dash-header__container">
        <div className="flex items-center space-x-4">
          <Link to="/dash/materials">
            <h1 classname="dash-header__title">ReadyAimFluent</h1>
          </Link>

        </div>
        {/* <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="" alt="User" />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
          <Button variant="outline" size="sm">
            Log out
          </Button>
        </div> */}
      </div>
    </header>
  )
}

export default DashHeader

