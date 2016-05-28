// DataPanel.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';
import RadialConvergence from './RadialConvergence.react.js';

class DataPanel extends React.Component {
    constructor(props) {
        super(props);
        this.staticStrings = {
            previousStep: {string: '上一步', context: 'Button display of go previous step button.'},
        };
        this.state = { points: [], links: [], };
        const pointCount = 70;
        for(let i = 0; i < pointCount; ++i) {
            this.state.points.push({id: i, degree: i*360/pointCount});
        }
        const linkCount = 20;
        for(let i = 0; i < linkCount; ++i) {
            this.state.links.push({
                fromId: Math.floor(pointCount*Core.random()),
                toId: Math.floor(pointCount*Core.random()),
            });
        }
        for(let i = 0; i < linkCount; ++i) {
            this.state.links.push({fromId: 1, toId: i,});
        }
        //this.logout = this.logout.bind(this);
        // Operations usually carried out in componentWillMount go here
    }
    componentDidMount() {
    }
    render() {
        const state = this.state;
        return <div className='data-panel'>
            <a id='dataPanel' className='anchor'></a>
            <div className='panel panel-primary'>
                <div className='panel-heading'>Data Panel</div>
                <div className='panel-body row'>
                    <div className='col-md-6'>
                        <div className='thumbnail'>
                            <div className='ratio-wrap-16-9'>
                                <RadialConvergence points={state.points} links={state.links}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='panel-footer'>Footer</div>
            </div>
        </div>;
    }
}
module.exports = DataPanel;

//* vim: filetype=php.javascript.jsx
//* vim: dictionary=~/.vim/dict/javascript.dict
