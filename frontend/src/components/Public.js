import { Link } from 'react-router-dom'

const Public = () => {
    const content = (
        <section className="public">
            <header>
                <h1>Welcome to <span className="nowrap">ReadyAimFluent!</span></h1>
            </header>
            <main className="public__main">
                <p>Make your journey to language fluency!</p>
            </main>
            <footer>
                <p><Link to="/login">Sign up</Link></p>
                <p><Link to="/register">Sign in</Link></p>
            </footer>
        </section>

    )
    return content
}
export default Public