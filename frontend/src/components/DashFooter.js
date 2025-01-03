import React from 'react'
import { Link } from 'react-router-dom'

const DashFooter = () => {
    const content = (
        <footer className="dash-footer">
            <div className="container mx-auto px-4">
                <div>
                    <p>&copy; 2025 ReadyAimFluent. All rights reserved.</p>
                    <nav className="mt-4 md:mt-0">
                        <ul className="flex space-x-4">
                            <li>
                                <Link to="/terms" className="text-sm text-gray-600 hover:text-blue-600">Terms of Service</Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="text-sm text-gray-600 hover:text-blue-600">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-sm text-gray-600 hover:text-blue-600">Contact Us</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </footer>
    )

    return content
}

export default DashFooter

