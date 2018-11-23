import React, { Component } from 'react';
import {
    PanResponder,
    NativeEventEmitter,
    Platform,
    findNodeHandle,
    NativeModules
} from 'react-native';

import F2 from '@antv/f2';
import { GCanvasView } from 'react-native-gcanvas';
import { enable, ReactNativeBridge, Image as GImage } from "../libs/gcanvas.js/src";

ReactNativeBridge.GCanvasModule = NativeModules.GCanvasModule;
ReactNativeBridge.Platform = Platform;

const emitter = new NativeEventEmitter();

class index extends Component {
    constructor(props) {
        super(props);
        F2.Util.addEventListener = (source, type, listener) => {
            emitter.addListener('f2' + type + source.id, listener);
        }

        F2.Util.removeEventListener = (source, type, listener) => {
            emitter.removeListener('f2' + type + source.id, listener);
        }

        F2.Util.createEvent = (event, chart) => {
            const { locationX, locationY } = event;
            return {
                chart,
                native: event,
                x: locationX,
                y: locationY,
            };
        };
    }

    UNSAFE_componentWillMount() {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onStartShouldSetPanResponderCapture: () => true,
            onMoveShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
            onPanResponderTerminationRequest: () => true,

            onPanResponderGrant: ({ nativeEvent }) => {
                emitter.emit(`f2touchstart${findNodeHandle(this.$canvas)}`, nativeEvent);
            },
            onPanResponderMove: ({ nativeEvent }) => {
                emitter.emit(`f2touchmove${findNodeHandle(this.$canvas)}`, nativeEvent);
            },
            onPanResponderRelease: ({ nativeEvent }) => {
                emitter.emit(`f2press${findNodeHandle(this.$canvas)}`, nativeEvent);
            },
            onPanResponderEnd: ({ nativeEvent }) => {
                emitter.emit(`f2touchend${findNodeHandle(this.$canvas)}`, nativeEvent);
            },
            onPanResponderTerminate: ({ nativeEvent }) => {
                emitter.emit(`f2touchend${findNodeHandle(this.$canvas)}`, nativeEvent);
            },
            onShouldBlockNativeResponder: () => true,
        });
    }

    get canvas() {
        const { width, height } = this.props;
        const el = { ref: findNodeHandle(this.$canvas).toString(), style: { width, height } };

        return enable(el, { bridge: ReactNativeBridge });
    }

    render() {
        return (
            <GCanvasView {...this._panResponder.panHandlers} ref={e => this.$canvas = e} {...this.props} />
        );
    }
}

export default index;