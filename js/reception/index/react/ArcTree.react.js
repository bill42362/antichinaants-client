// ArcTree.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';

class ArcTree extends React.Component {
    render() {
        return <div className="arc-tree">
            <a id="arcTree" className="anchor"></a>
            <div className="panel panel-primary">
                <div className="panel-heading">Arc Tree</div>
                <div className="panel-body row">
                    <div className='col-md-6'>
                        <div className='ratio-wrap-16-9'>
                            <canvas className='arc-tree-canvas'></canvas>
                        </div>
                    </div>
                </div>
                <div className="panel-footer">Footer</div>
            </div>
        </div>;
    }
}
module.exports = ArcTree;

//* vim: filetype=php.javascript.jsx
//* vim: dictionary=~/.vim/dict/javascript.dict
