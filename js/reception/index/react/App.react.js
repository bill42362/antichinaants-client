// App.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';
import Header from '../../../common/react/Header.react.js';
import ArcTree from './ArcTree.react.js';
import Footer from '../../../common/react/Footer.react.js';

class App extends React.Component {
    render() {
        return <div id='wrapper'>
            <Header />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-2">
                        <div className="page-anchor-list list-group list-group-root">
                            <a href="#top" className="list-group-item active">Top</a>
                            <a href="#arcTree" className="list-group-item">Arc Tree</a>
                        </div>
                    </div>
                    <div className="col-md-10">
                        <ArcTree />
                    </div>
                </div>
            </div>
            <Footer />
        </div>;
    }
}
module.exports = App;

//* vim: filetype=php.javascript.jsx
//* vim: dictionary=~/.vim/dict/javascript.dict
