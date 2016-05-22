// ArcTree.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';

class ArcTree extends React.Component {
    constructor(props) {
        super(props);
        this.staticStrings = {
            previousStep: {string: '上一步', context: 'Button display of go previous step button.'},
        };
        this.state = {
            points: [
                {id: '0', degree: 0},
                {id: '1', degree: 15},
                {id: '2', degree: 30},
                {id: '3', degree: 60},
                {id: '4', degree: 120},
                {id: '5', degree: 240},
            ],
            links: [
                {fromId: '0', toId: '1'},
                {fromId: '0', toId: '2'},
                {fromId: '0', toId: '4'},
                {fromId: '1', toId: '3'},
                {fromId: '1', toId: '5'},
                {fromId: '2', toId: '5'},
            ],
        };
        this.context = undefined;
        this.transformToCanvas = this.transformToCanvas.bind(this);
        //this.logout = this.logout.bind(this);
        // Operations usually carried out in componentWillMount go here
    }
    transformToCanvas(point, unitInPixel = Number(5)) {
        const canvas = this.refs.canvas;
        const center = {x: canvas.width/2, y: canvas.height/2};
        var result = {x: center.x + unitInPixel*point.x, y: center.y - unitInPixel*point.y};
        return result;
    }
    drawCircle(center, radius) {
        const ctx = this.context;
        ctx.moveTo(center.x + radius, center.y);
        ctx.arc(center.x, center.y, radius, 0, Math.PI*2, true);
    }
    getPointFromDegree(degree, center = {x: 0, y: 0}, radius = 1) {
        const arc = Math.PI*degree/180;
        const unitPoint = {x: Math.sin(arc), y: Math.cos(arc)};
        return {x: center.x + unitPoint.x*radius, y: center.y + unitPoint.y*radius};
    }
    draw() {
        const canvas = this.refs.canvas;
        const ctx = this.context;
        const t = this.transformToCanvas;
        const zoom = 0.4*canvas.height;
        const circleSize = 4;
        const origin = t({x: 0, y: 0}, zoom);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
            ctx.arc(origin.x, origin.y, 1, 0, Math.PI*2, true);
            // Draw points.
            this.state.points.forEach(point => {
                this.drawCircle(
                    t(this.getPointFromDegree(point.degree), zoom),
                    circleSize
                );
            }, this);
        ctx.fill();
    }
    componentDidMount() {
        const canvas = this.refs.canvas;
        canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight;
        this.context = canvas.getContext('2d');
        this.context.canvas.width = canvas.clientWidth; this.context.canvas.height = canvas.clientHeight;
        this.context.translate(0.5, 0.5);
        this.draw();
    }
    render() {
        return <div className='arc-tree'>
            <a id='arcTree' className='anchor'></a>
            <div className='panel panel-primary'>
                <div className='panel-heading'>Arc Tree</div>
                <div className='panel-body row'>
                    <div className='col-md-6'>
                        <div className='ratio-wrap-16-9'>
                            <canvas ref='canvas' className='arc-tree-canvas'></canvas>
                        </div>
                    </div>
                </div>
                <div className='panel-footer'>Footer</div>
            </div>
        </div>;
    }
}
module.exports = ArcTree;

//* vim: filetype=php.javascript.jsx
//* vim: dictionary=~/.vim/dict/javascript.dict
