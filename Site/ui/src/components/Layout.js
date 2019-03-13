import {CSSTransition} from 'react-transition-group';
import Header from './Header';
import Footer from './Footer';
import {Fragment,PureComponent} from 'react';

class Layout extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            appearPage: true
        }
    }
    render() {
        const {title,description,keywords} = this.props;
        const {appearPage} = this.state;
        return (
            <Fragment>
                <header>
                    <Header 
                        title={title}
                        description={description}
                        keywords={keywords}
                    />
                </header>
                <CSSTransition
                        in={appearPage}
                        appear={true}
                        timeout={400}
                        classNames="fade"
                >
                    <main>
                        {this.props.children}
                    </main>
                </CSSTransition>
                <Footer />
                <style jsx>{`
                    main.fade-appear {
                        opacity: 0;
                    }
                    main.fade-appear-active {
                        opacity: 1;
                        transition: all 400ms ease-in;
                    }
                    main.fade-active-exit {
                        opacity: 0;
                        transition: all 400ms ease-in;
                    }
                    main.fade-exit {
                        opacity: 0;
                    }
                `}</style>
            </Fragment>
        )
    }
}

export default Layout;