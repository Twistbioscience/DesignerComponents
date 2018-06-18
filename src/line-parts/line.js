import React from 'react';
import {
    ANNOTATION_HEIGHT,
    ANNOTATION_GAP,
    LINE_PADDING_TOP,
    MINUS_STRAND_MARGIN,
    ANNOTATION_PADDING_TOP
} from '../constants';
import LineBpIndex from '../line-parts/bp-index';
import Sequence from '../line-parts/line-sequence';
import Selection from '../line-parts/selection';
import Orf from "../line-parts/orf/orf";
import {getAnnotationLayer} from "../rendering/annotations";

const colorMap = {
    285: 'blue',
    361: 'yellow',
    319: 'green',
    170: 'black'
}
const isStarterWithinLine = (start, end, starter) => starter <= end && starter >= start;
const isOrfWithinLine = (orf, start, end) => orf.location[0].start <= end && orf.location[0].end >= start;

export const getOrfPositionInLine = (lineStartIndex, lineEndIndex, orfs, charsPerRow, letterWidth) => {
    return orfs
        .filter(orf => isOrfWithinLine(orf, lineStartIndex, lineEndIndex))
        .map(orf => {
            const orfLineStart = Math.max(lineStartIndex, orf.location[0].start);
            const orfLineEnd = Math.min(lineEndIndex, orf.location[0].end);
            return {
                orfLineStart,
                orfLineEnd,
                start: (orfLineStart % charsPerRow) * letterWidth,
                end: (orfLineEnd % charsPerRow) * letterWidth,
                orfStartIndex: orf.location[0].start,
                strand: orf.strand,
                frame: orf.frame,
                starters: orf.starters.filter(starter => isStarterWithinLine(lineStartIndex, lineEndIndex, starter))
                    .map(starter => (starter % (charsPerRow + 1)) * letterWidth),
                color: colorMap[orf.location[0].start], // for dev time only
            }
        })
};


class Line extends React.Component {

    constructor() {
        super();
        this.mouseDownHandler = this.mouseDownHandler.bind(this);
        this.mouseUpHandler = this.mouseUpHandler.bind(this);
    }

    mouseDownHandler(index, charsPerRow) {
        return this.props.onMouseDown ? (e) => {
            this.props.onMouseDown(e, index * charsPerRow);
        } : null;
    }

    mouseUpHandler(index, charsPerRow, endSelection, selectionInProgress) {

        return this.props.onMouseUp ? (e) => {
            if (selectionInProgress) {
                this.props.onMouseUp(e, index * charsPerRow, endSelection);
            }
        } : null;
    }

    render() {
        const {charsPerRow, minusStrand, index, style, selection, selectionInProgress, config} = this.props;
        const startIndex = charsPerRow * index;
        const sequence = this.props.sequence.substr(startIndex, charsPerRow).toUpperCase();
        const endIndex = startIndex + sequence.length - 1;
        const annotationsBottom = this.props.annotations
            .filter(
                annotation => (annotation.startIndex < startIndex && annotation.endIndex > startIndex) || (annotation.startIndex > startIndex && annotation.startIndex < startIndex + charsPerRow)
            )
            .map((annotation, index, arr) => {
                const layer = getAnnotationLayer(arr, index);
                const width = (annotation.endIndex - annotation.startIndex) * config.LETTER_FULL_WIDTH_SEQUENCE;
                const x = (annotation.startIndex - startIndex) * config.LETTER_FULL_WIDTH_SEQUENCE;
                const y = (config.LETTER_HEIGHT_SEQUENCE * (minusStrand ? 2 : 1)) + (minusStrand ? MINUS_STRAND_MARGIN : 0) +
                    (layer * (ANNOTATION_HEIGHT + ANNOTATION_GAP)) + LINE_PADDING_TOP + ANNOTATION_PADDING_TOP;
                const points = [
                    //arrowheads on both edges, no teeth:
                    x - 5 / 2, y,
                    x + width - 5 / 2, y,
                    x + width + 5 / 2, y + ANNOTATION_HEIGHT / 2,
                    x + width - 5 / 2, y + ANNOTATION_HEIGHT,
                    x - 5 / 2, y + ANNOTATION_HEIGHT,
                    x + 5 / 2, y + ANNOTATION_HEIGHT / 2
                ].join(' ');
                return <g key={`annotations-bottom-${index}`}>
                    <polygon key={`annotations-bottom-poly-${index}`} points={points} x={x} y={y}
                             fill={annotation.color || "#0000a4"} fillOpacity="0.3"/>
                    <text key={`annotations-bottom-text-${index}`} x={x + width / 4} y={y + (ANNOTATION_HEIGHT / 2) + 5}
                          fontSize="12px">{annotation.name}</text>
                </g>
            })

        const getRect = () => {
            const startX = (selection.startIndex && selection.startIndex > startIndex) ? (selection.startIndex - startIndex) * config.LETTER_FULL_WIDTH_SEQUENCE : 0;
            const endX = selection.endIndex ?
                (selection.endIndex < endIndex) ? (selection.endIndex - startIndex) * config.LETTER_FULL_WIDTH_SEQUENCE :
                    (endIndex - startIndex) * config.LETTER_FULL_WIDTH_SEQUENCE :
                -1;
            return {x: startX, wdt: endX - startX};
        };

        const selectionRect = selection ? getRect() : 0;
        return (
            <svg style={style} width={config.LETTER_FULL_WIDTH_SEQUENCE * charsPerRow}
                 onMouseDown={this.mouseDownHandler(index, charsPerRow)}
                 onMouseUp={this.mouseUpHandler(index, charsPerRow, true, selectionInProgress)}
                 onMouseMove={this.mouseUpHandler(index, charsPerRow, false, selectionInProgress)}>
                <Sequence sequence={sequence} minusStrand={minusStrand} config={config}/>
                <LineBpIndex startIndex={startIndex + 1} endIndex={startIndex + sequence.length} stepSize={3}
                             minusStrand={minusStrand} offset={startIndex === 1 ? 30 : 0} config={config}/>
                <Orf
                    orfs={getOrfPositionInLine(startIndex, endIndex, this.props.orfs, config.LETTER_FULL_WIDTH_SEQUENCE, config.LETTER_SPACING_SEQUENCE)}
                    charsPerRow={charsPerRow}
                    endIndex={endIndex}
                    letterWidth={config.LETTER_FULL_WIDTH_SEQUENCE}
                    config={config}
                    minusStrand={minusStrand}
                    sequence={this.props.sequence}
                />

                {annotationsBottom}
                <rect height="2" y={style.height - 2} width={config.LETTER_FULL_WIDTH_SEQUENCE * charsPerRow}
                      style={{fill: "#000000"}}/>
                {(selectionRect.wdt > 0) && <Selection height={style.height} selectionRect={selectionRect}
                                                       selection={selection} startIndex={startIndex}
                                                       endIndex={endIndex}/>}
            </svg>
        );
    }
}

export default Line;

