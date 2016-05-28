// RadialConvergence.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';

class RadialConvergence extends React.Component {
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
    getDegreePairs(links, points) {
        return links.map(link => {
            var fromDegree = undefined, toDegree = undefined;
            points.forEach(point => {
                if(link.fromId === point.id) { fromDegree = point.degree; }
                else if(link.toId === point.id) { toDegree = point.degree; }
            });
            return {from: fromDegree, to: toDegree};
        });
    }
    getBezierCurves(pointPairs, center = {x: 0, y: 0}) {
        return pointPairs.map(pointPair => {
            var f = pointPair.from, t = pointPair.to, c = center;
            return {
                from: pointPair.from,
                cp1: {
                    x: (f.x + f.x + f.x + t.x + t.x + c.x)/6,
                    y: (f.y + f.y + f.y + t.y + t.y + c.y)/6,
                },
                cp2: {
                    x: (f.x + f.x + t.x + t.x + t.x + c.x)/6,
                    y: (f.y + f.y + t.y + t.y + t.y + c.y)/6,
                },
                to: pointPair.to,
            };
        });
    }
    draw() {
        const canvas = this.refs.canvas;
        const ctx = this.context;
        const t = this.transformToCanvas;
        const zoom = 0.4*canvas.height;
        const circleSize = 4;
        const origin = t({x: 0, y: 0}, zoom);
        const degreePairs = this.getDegreePairs(this.state.links, this.state.points);
        const pointPairs = degreePairs.map(degreePair => {
            return {
                from: t(this.getPointFromDegree(degreePair.from), zoom),
                to: t(this.getPointFromDegree(degreePair.to), zoom),
            };
        }, this);
        const bezierCurves = this.getBezierCurves(pointPairs, origin);

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
            // Draw besier curves.
            bezierCurves.forEach(curve => {
                ctx.moveTo(curve.from.x, curve.from.y);
                ctx.bezierCurveTo(
                    curve.cp1.x, curve.cp1.y,
                    curve.cp2.x, curve.cp2.y,
                    curve.to.x, curve.to.y
                );
            });
        ctx.stroke();
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
        return <div className='radial-convergence'>
            <a id='radialConvergence' className='anchor'></a>
            <div className='panel panel-primary'>
                <div className='panel-heading'>Radial Convergence</div>
                <div className='panel-body row'>
                    <div className='col-md-6'>
                        <div className='thumbnail'>
                            <div className='ratio-wrap-16-9'>
                                <canvas ref='canvas' className='radial-convergence-canvas'></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='panel-footer'>Footer</div>
            </div>
        </div>;
    }
}
module.exports = RadialConvergence;

//* vim: filetype=php.javascript.jsx
//* vim: dictionary=~/.vim/dict/javascript.dict
