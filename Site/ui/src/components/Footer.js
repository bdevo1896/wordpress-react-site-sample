const Footer = () => (
    <footer>
        <h4>Footer</h4>
        <p>This sample site is yours to use however you want. I hope it helps you understand React, Next, and Apollo!</p>
        {/* 
            In Next.js you can use a component called Links to prefetch content for future pages the user might go to, basically,
            this makes your app seemingly faster, but Links can only be used internally to the site. Whenever you want to go to
            an external link, just use a regular a tag.
        */}
        <a href="https://github.com/bdevo1896">My Github</a>
    </footer>
)

export default Footer;