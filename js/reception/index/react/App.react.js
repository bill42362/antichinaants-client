// App.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';
import Header from '../../../common/react/Header.react.js';
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
                            <a href="#treeDiagram" className="list-group-item">樹狀圖</a>
                        </div>
                    </div>
                    <div className="col-md-10">
                        <div className="tree-diagram">
                            <a id="treeDiagram" className="anchor"></a>
                            <div className="panel panel-primary">
                                <div className="panel-heading">樹狀圖</div>
                                <div className="panel-body">這裡是身</div>
                                <div className="panel-footer">這裡是腳</div>
                            </div>
                        </div>
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
