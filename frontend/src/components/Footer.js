import React from "react";

const Footer = () => {

    return (
        <footer className="footer">
            <div className="container-fluid">
                <div className="level">
                    <dia className="level-left">
                        <div className="level-item">
                            © 2020, JustBoil.me
                        </div>
                        <div className="level-item">
                            <a href="https://github.com/vikdiesel/admin-one-bulma-dashboard" style="height: 20px">
                                <img src="https://img.shields.io/github/v/release/vikdiesel/admin-one-bulma-dashboard?color=%23999"></img>
                            </a>
                        </div>
                    </dia>
                    <div className="level-right">
                        <div className="level-item">
                            <div className="logo">
                                <a href="https://justboil.me"><img src="img/justboil-logo.svg" alt="JustBoil.me"></img></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )

}

export default Footer;