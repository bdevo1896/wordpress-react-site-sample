import Link from 'next/link';

const NavLink = ({href,as,text}) => (
    <li className="m-s-left m-s-right">
        <Link prefetch href={href} as={as}>
            <a aria-label={text}>{text}</a>
        </Link>
    </li>
)

const Navigation = () => (
    <div className="hbox p-s-all">
        <h3 className="m-s-right">The Mango Nerd Sample Site</h3>
        <nav>
            <ul className="hbox">
                <NavLink href="/" as="/" text="Home"/>
                <NavLink href="/blog" as="/blog" text="Blog"/>
            </ul>
        </nav>

        <style jsx>{`
            
            nav ul {
                list-style: none;
            }

            div {
                border-bottom: 1px solid #dddd;
            }

            @media(min-width: 500px) {
                nav {
                    border-left: 1px solid #dddd;
                }
            }
        `}</style>
    </div>
)

export default Navigation;