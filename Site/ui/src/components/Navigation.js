import Link from 'next/link';

const NavLink = ({href,as,text}) => (
    <Link prefetch href={href} as={as}>
        <a aria-label={text}>{text}</a>
    </Link>
)

const Navigation = () => (
    <div>
        <h3>The Mango Nerd Sample Site</h3>
        <nav>
            <ul>
                <NavLink href="/" as="/" text="Home"/>
                <NavLink href="/blog" as="/blog" text="Blog"/>
                <NavLink href="/sample" as="/sample" text="Sample" />
            </ul>
        </nav>
    </div>
)

export default Navigation;