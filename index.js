import React from 'react';
import { Dimensions, PanResponder, NativeAppEventEmitter, View, ViewPropTypes } from "react-native";
import Canvas from "react-native-canvas";
import F2 from '@antv/f2';
import uuid from 'uuid';

/**
 * ReactNative F2
 *
 * @author 慕枫
 * @date 2018-11-21
 * @export
 * @class F2Canvas
 * @extends {React.Component}
 */

type props = {
  ...ViewPropTypes
};

export default class F2Canvas extends React.Component<props> {
  id = uuid.v4();
  F2 = F2;

  constructor(props) {
    super(props);
    this.F2.Util.measureText = str => { return { width: str.length * 6 } };

    this.F2.Util.addEventListener = (source, type, listener) => {
      NativeAppEventEmitter.addListener(this.id + type, listener);
    };

    this.F2.Util.removeEventListener = (source, type, listener) => {
      NativeAppEventEmitter.removeListener(this.id + type, listener);
    };

    this.F2.Util.createEvent = (event, chart) => {
      const { locationX, locationY } = event;
      return {
        chart,
        native: event,
        x: locationX,
        y: locationY
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
        NativeAppEventEmitter.emit(`${this.id}touchstart`, nativeEvent)
      },
      onPanResponderMove: ({ nativeEvent }) => {
        NativeAppEventEmitter.emit(`${this.id}touchmove`, nativeEvent)
      },
      onPanResponderRelease: ({ nativeEvent }) => {
        NativeAppEventEmitter.emit(`${this.id}press`, nativeEvent)
      },
      onPanResponderEnd: ({ nativeEvent }) => {
        NativeAppEventEmitter.emit(`${this.id}touchend"`, nativeEvent)
      },
      onPanResponderTerminate: ({ nativeEvent }) => {
        NativeAppEventEmitter.emit(`${this.id}touchend`, nativeEvent)
      },
      onShouldBlockNativeResponder: () => true,
    });
  }

  getCanvas() {
    return this.$canvas;
  }

  render() {
    return (
      <View {...this._panResponder.panHandlers} {...this.props}>
        <Canvas ref={e => this.$canvas = e} />
      </View>
    );
  }
}
