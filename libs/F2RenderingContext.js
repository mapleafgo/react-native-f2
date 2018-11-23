import FillStyleLinearGradient from './gcanvas.js/src/context-2d/FillStyleLinearGradient';
import FillStyleRadialGradient from './gcanvas.js/src/context-2d/FillStyleRadialGradient';
import RenderingContext from './gcanvas.js/src/context-2d/RenderingContext';

import { Dimensions, Platform } from 'react-native';

export default class F2CanvasRenderingContext2D extends RenderingContext {
    pixelRatio = Dimensions.get("window").scale;

    _lineWidth = this.getNum(1);
    _miterLimit = this.getNum(10);

    _font = `12px sans-serif`;

    getNum(n) {
        return Platform.select({
            ios: n,
            android: n * this.pixelRatio,
        })
    }

    strLen(str) {
        let len = 0;
        for (let i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128) len += 1.3;
            else len += 1.8;
        }
        return len;
    }

    set lineWidth(value) {
        this._lineWidth = value;
        this._drawCommands = this._drawCommands.concat("W" + this.getNum(value) + ";");
    }

    set miterLimit(value) {
        this._miterLimit = value;
        this._drawCommands = this._drawCommands.concat("M" + this.getNum(value) + ";");
    }

    set font(value) {
        this._font = value;
        let vs = value.split(' ');
        vs[3] = this.getNum(parseInt(vs[3], 10)) + 'px';
        value = vs.join(' ');
        this._drawCommands = this._drawCommands.concat("j" + value + ";");
    }

    setTransform(a, b, c, d, tx, ty) {
        this._drawCommands = this._drawCommands.concat("t"
            + (a === 1 ? "1" : a.toFixed(2)) + ","
            + (b === 0 ? "0" : b.toFixed(2)) + ","
            + (c === 0 ? "0" : c.toFixed(2)) + ","
            + (d === 1 ? "1" : d.toFixed(2)) + "," + this.getNum(tx.toFixed(2)) + "," + this.getNum(ty.toFixed(2)) + ";");
    }

    transform(a, b, c, d, tx, ty) {
        this._drawCommands = this._drawCommands.concat("f"
            + (a === 1 ? "1" : a.toFixed(2)) + ","
            + (b === 0 ? "0" : b.toFixed(2)) + ","
            + (c === 0 ? "0" : c.toFixed(2)) + ","
            + (d === 1 ? "1" : d.toFixed(2)) + "," + this.getNum(tx) + "," + this.getNum(ty) + ";");
    }

    scale(a, d) {
        this._drawCommands = this._drawCommands.concat("k" + this.getNum(a.toFixed(2)) + "," + this.getNum(d.toFixed(2)) + ";");
    }

    translate(tx, ty) {
        this._drawCommands = this._drawCommands.concat("l" + this.getNum(tx.toFixed(2)) + "," + this.getNum(ty.toFixed(2)) + ";");
    }

    createLinearGradient(x0, y0, x1, y1) {
        return super.createLinearGradient(this.getNum(x0), this.getNum(y0), this.getNum(x1), this.getNum(y1));
    }

    createRadialGradient(x0, y0, r0, x1, y1, r1) {
        return super.createRadialGradient(this.getNum(x0), this.getNum(y0), this.getNum(r0), this.getNum(x1), this.getNum(y1), this.getNum(r1));
    };

    strokeRect(x, y, w, h) {
        super.strokeRect(this.getNum(x), this.getNum(y), this.getNum(w), this.getNum(h));
    }

    clearRect(x, y, w, h) {
        super.clearRect(this.getNum(x), this.getNum(y), this.getNum(w), this.getNum(h));
    }

    moveTo(x, y) {
        this._drawCommands = this._drawCommands.concat("g" + this.getNum(x.toFixed(2)) + "," + this.getNum(y.toFixed(2)) + ";");
    }

    lineTo(x, y) {
        this._drawCommands = this._drawCommands.concat("i" + this.getNum(x.toFixed(2)) + "," + this.getNum(y.toFixed(2)) + ";");
    }

    quadraticCurveTo(cpx, cpy, x, y) {
        super.quadraticCurveTo(this.getNum(cpx), this.getNum(cpy), this.getNum(x), this.getNum(y));
    }

    bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y, ) {
        this._drawCommands = this._drawCommands.concat(
            "z" + this.getNum(cp1x.toFixed(2)) + "," + this.getNum(cp1y.toFixed(2)) + "," + this.getNum(cp2x.toFixed(2)) + "," + this.getNum(cp2y.toFixed(2)) + "," +
            this.getNum(x.toFixed(2)) + "," + this.getNum(y.toFixed(2)) + ";");
    }

    arcTo(x1, y1, x2, y2, radius) {
        super.arcTo(this.getNum(x1), this.getNum(y1), this.getNum(x2), this.getNum(y2), this.getNum(radius));
    }

    fillRect(x, y, w, h) {
        super.fillRect(this.getNum(x), this.getNum(y), this.getNum(w), this.getNum(h));
    }

    rect(x, y, w, h) {
        super.rect(this.getNum(x), this.getNum(y), this.getNum(w), this.getNum(h));
    }

    arc(x, y, radius, startAngle, endAngle, anticlockwise) {

        let ianticlockwise = 0;
        if (anticlockwise) {
            ianticlockwise = 1;
        }

        this._drawCommands = this._drawCommands.concat(
            "y" + this.getNum(x.toFixed(2)) + "," + this.getNum(y.toFixed(2)) + ","
            + this.getNum(radius.toFixed(2)) + "," + startAngle + "," + endAngle + "," + ianticlockwise
            + ";"
        );
    }

    fillText(text, x, y) {
        super.fillText(text, this.getNum(x), this.getNum(y));
    }

    strokeText = (text, x, y) => {
        super.strokeText(text, this.getNum(x), this.getNum(y));
    }

    measureText = text => {
        let fontSize = 12;
        fontSize /= 2;
        return { width: this.strLen(text) * fontSize };
    }
}