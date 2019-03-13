import {CSSTransition} from 'react-transition-group';
import Header from './Header';
import Footer from './Footer';
import {PureComponent} from 'react';

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
            <div id="wrapper">
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
                    <main className="vbox">
                        <div id="content-container" className="p-s-all">
                            {this.props.children}
                        </div>
                        <Footer />
                    </main>
                </CSSTransition>
                <style jsx>{`

                    header {
                        flex: 0 1 auto;
                    }

                    main {
                        overflow-y: scroll;
                        justify-content: space-between;
                        flex: 1 1 auto;
                    }
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

                    #wrapper {
                        display: flex;
                        flex-flow: column nowrap;
                        position: fixed;
                        height: 100vh;
                        width: 100vw;
                        flex-shrink: 0;
                    }
                `}</style>
            </div>
        )
    }
}

export default Layout;