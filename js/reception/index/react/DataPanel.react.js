// DataPanel.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';
import RadialConvergence from './RadialConvergence.react.js';
import SemanticPolarGrid from './SemanticPolarGrid.react.js';
import MouseTracker from './MouseTracker.react.js';

class DataPanel extends React.Component {
    constructor(props) {
        super(props);
        this.staticStrings = {
            previousStep: {string: '上一步', context: 'Button display of go previous step button.'},
        };
        this.state = {
            points: [], links: [],
            mousePosition: {x: -1, y: -1}, selectedPointId: '',
        };
        const pointCount = 70;
        for(let i = 0; i < pointCount; ++i) {
            this.state.points.push({id: Core.newUuid(), degree: i*360/pointCount});
        }
        // TODO: Hard coded point.
        this.state.selectedPointId = this.state.points[1].id;
        const linkCount = 20;
        for(let i = 0; i < linkCount; ++i) {
            this.state.links.push({
                id: Core.newUuid(),
                fromId: this.state.points[Math.floor(pointCount*Core.random())].id,
                toId: this.state.points[Math.floor(pointCount*Core.random())].id,
            });
        }
        for(let i = 0; i < linkCount; ++i) {
            this.state.links.push({
                id: Core.newUuid(),
                fromId: this.state.points[1].id,
                toId: this.state.points[i].id,
            });
        }
        this.onMouseMove = this.onMouseMove.bind(this);
        // Operations usually carried out in componentWillMount go here
    }
    onMouseMove() {
        var mouseState = this.refs.mouseTracker.state;
        this.setState({mousePosition: mouseState.axis});
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
                                <RadialConvergence
                                    points={state.points} links={state.links}
                                    mousePosition={state.mousePosition}
                                />
                                <MouseTracker
                                    ref='mouseTracker'
                                    onMouseMove={this.onMouseMove}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='col-md-6'>
                        <div className='thumbnail'>
                            <div className='ratio-wrap-16-9'>
                                <SemanticPolarGrid
                                    rootPointId={state.selectedPointId}
                                    points={state.points} links={state.links}
                                />
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
