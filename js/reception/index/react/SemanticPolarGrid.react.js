// SemanticPolarGrid.react.js
'use strict'
import React from 'react';
import ClassNames from 'classnames';

class TreeNode {
    constructor(pointId, parentNodeId = '', layer = 0) {
        this.pointId = pointId;
        this.forwardChildNodeIds = [];
        this.backwordChildNodeIds = [];
        this.parentNodeId = parentNodeId;
        this.layer = layer;
    }
}

class SemanticPolarGrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = { maxTreeLayer: 5, antialiasingFactor: 2, };
        this.context = undefined;
        this.transformToCanvas = this.transformToCanvas.bind(this);
        // Operations usually carried out in componentWillMount go here
    }
    transformToCanvas(point, unitInPixel = Number(5)) {
        const canvas = this.refs.canvas;
        const center = {x: canvas.width/2, y: canvas.height/2};
        var result = {x: center.x + unitInPixel*point.x, y: center.y - unitInPixel*point.y};
        return result;
    }
    drawCircle(center, radius = Number(4), style = '#888') {
        const ctx = this.context;
        ctx.fillStyle = style;
        ctx.beginPath();
            ctx.moveTo(center.x + radius, center.y);
            ctx.arc(center.x, center.y, radius, 0, Math.PI*2, true);
        ctx.fill();
    }
    getPointFromDegree(degree, center = {x: 0, y: 0}, radius = Number(1)) {
        const arc = Math.PI*degree/180;
        const unitPoint = {x: Math.sin(arc), y: Math.cos(arc)};
        return {x: center.x + unitPoint.x*radius, y: center.y + unitPoint.y*radius};
    }
    getNodeLayers(rootId = '', points = [], links = []) {
        const maxTreeLayer = this.state.maxTreeLayer;
        var nodeLayers = [];
        for(let i = 0; i < maxTreeLayer; ++i) {
            let tempNodes = [];
            if(0 === i) { tempNodes = [new TreeNode(rootId)]; }
            else {
                tempNodes = nodeLayers[i - 1].reduce((prevNodes, node) => {
                    let childNodeIds = node.forwardChildNodeIds.concat(node.backwordChildNodeIds);
                    return prevNodes.concat(childNodeIds.map(nodeId => {
                        return new TreeNode(nodeId, node.pointId, i);
                    }));
                }, []);
            }
            tempNodes.forEach(node => {
                node.forwardChildNodeIds = this.getLeafIdsOfNode(node, links);
                node.backwordChildNodeIds = this.getLeafIdsOfNode(node, links, true);
            }, this);
            nodeLayers.push(tempNodes);
        }
        return nodeLayers;
    }
    getLeafIdsOfNode(node, links = [], backward) {
        return links.map(link => {
            if(!backward && node.pointId === link.fromId) { return link.toId; }
            else if(backward && node.pointId === link.toId) { return link.fromId; }
        }).filter(leafId => { return leafId != undefined });
    }
    draw() {
        const state = this.state;
        const props = this.props;
        const antialiasingFactor = state.antialiasingFactor;
        const canvas = this.refs.canvas;
        const ctx = this.context;
        const t = this.transformToCanvas;
        const zoom = 0.4*canvas.height;
        const circleSize = 5;
        const origin = t({x: 0, y: 0}, zoom);

        let nodeLayers = this.getNodeLayers(props.rootPointId, props.points, props.links);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Compute point degrees.
        nodeLayers.forEach((nodes, layer) => {
            let degreeStep = 360/nodes.length;
            let radius = layer*zoom/(state.maxTreeLayer - 1);
            nodes.forEach((node, index) => {
                let degree = index*degreeStep;
                node.point = this.getPointFromDegree(degree, origin, radius);
            }, this);
        }, this);

        // Draw points.
        nodeLayers.forEach(nodes => {
            nodes.forEach(node => { this.drawCircle(node.point); }, this);
        }, this);
    }
    componentDidMount() {
        const canvas = this.refs.canvas;
        let antialiasingFactor = this.state.antialiasingFactor;
        this.context = canvas.getContext('2d');
        this.context.canvas.width = antialiasingFactor*canvas.clientWidth;
        this.context.canvas.height = antialiasingFactor*canvas.clientHeight;
        this.context.translate(0.5, 0.5);
        this.draw();
    }
    componentDidUpdate(prevProps, prevState) {
        this.draw();
        if(this.state.shouldCallOnChange && this.props.onChange) {
            this.props.onChange(this.state.hoveringIds);
            this.setState({shouldCallOnChange: false});
        }
    }
    render() {
        return <canvas
            ref='canvas' className='figure-canvas figure-canvas-semantic-polar-grid'
        ></canvas>;
    }
}
module.exports = SemanticPolarGrid;

//* vim: filetype=php.javascript.jsx
//* vim: dictionary=~/.vim/dict/javascript.dict
