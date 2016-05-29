// RadialConvergence.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';

class RadialConvergence extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIds: [],
            shouldCallOnChange: false,
        };
        this.context = undefined;
        this.transformToCanvas = this.transformToCanvas.bind(this);
        this.getValue = this.getValue.bind(this);
        //this.logout = this.logout.bind(this);
        // Operations usually carried out in componentWillMount go here
    }
    getValue() { return this.state.selectedIds; }
    transformToCanvas(point, unitInPixel = Number(5)) {
        const canvas = this.refs.canvas;
        const center = {x: canvas.width/2, y: canvas.height/2};
        var result = {x: center.x + unitInPixel*point.x, y: center.y - unitInPixel*point.y};
        return result;
    }
    drawCircle(center, radius, opt_style) {
        const ctx = this.context;
        ctx.fillStyle = opt_style || '#888';
        ctx.beginPath();
            ctx.moveTo(center.x + radius, center.y);
            ctx.arc(center.x, center.y, radius, 0, Math.PI*2, true);
        ctx.fill();
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
        const circleSize = 2.5;
        const origin = t({x: 0, y: 0}, zoom);
        const degreePairs = this.getDegreePairs(this.props.links, this.props.points);
        const pointPairs = degreePairs.map(degreePair => {
            return {
                from: t(this.getPointFromDegree(degreePair.from), zoom),
                to: t(this.getPointFromDegree(degreePair.to), zoom),
            };
        }, this);
        const bezierCurves = this.getBezierCurves(pointPairs, origin);
        let selectedIds = [];

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw points.
        this.props.points.forEach(point => {
            var pointCenter = t(this.getPointFromDegree(point.degree), zoom);
            if(-1 != this.state.selectedIds.indexOf(point.id)) {
                this.drawCircle(pointCenter, 2*circleSize, '#8a6d3b');
            }
            this.drawCircle(pointCenter, circleSize);
            let mousePosition = this.props.mousePosition;
            var isPointInPath = ctx.isPointInPath(mousePosition.x, mousePosition.y);
            if(isPointInPath) { selectedIds.push(point.id); }
        }, this);
        ctx.strokeStyle = '#555';
        ctx.beginPath();
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

        if(!this.state.selectedIds.equals(selectedIds)) {
            this.setState({selectedIds: selectedIds, shouldCallOnChange: true});
        }
    }
    componentDidMount() {
        const canvas = this.refs.canvas;
        canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight;
        this.context = canvas.getContext('2d');
        this.context.canvas.width = canvas.clientWidth; this.context.canvas.height = canvas.clientHeight;
        this.context.translate(0.5, 0.5);
        this.draw();
    }
    componentDidUpdate(prevProps, prevState) {
        this.draw();
        if(this.state.shouldCallOnChange && this.props.onChange) {
            this.props.onChange(this.state.selectedIds);
            this.setState({shouldCallOnChange: false});
        }
    }
    render() {
        return <canvas ref='canvas' className='radial-convergence-canvas'>
        </canvas>;
    }
}
module.exports = RadialConvergence;

//* vim: filetype=php.javascript.jsx
//* vim: dictionary=~/.vim/dict/javascript.dict
