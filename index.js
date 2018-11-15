import React from 'react';
import { Dimensions, PanResponder, NativeAppEventEmitter, View, ViewPropTypes } from "react-native";
import Canvas from "react-native-canvas";
import F2 from '@antv/f2';

F2.Util.isBrowser = false;

F2.Util.addEventListener = function (source, type, listener) {
  NativeAppEventEmitter.addListener(type, listener);
};

F2.Util.removeEventListener = function (source, type, listener) {
  NativeAppEventEmitter.removeListener(type, listener);
};

F2.Util.createEvent = function (event, chart) {
  const { locationX, locationY } = event;
  return {
    chart,
    native: event,
    x: locationX,
    y: locationY
  };
};

export default F2;

type IProps = {
  ViewPropTypes
};

export class F2Canvas extends React.Component<IProps> {
  UNSAFE_componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => true,

      onPanResponderGrant: ({ nativeEvent }) => {
        NativeAppEventEmitter.emit("touchstart", nativeEvent)
      },
      onPanResponderMove: ({ nativeEvent }) => {
        NativeAppEventEmitter.emit("touchmove", nativeEvent)
      },
      onPanResponderRelease: ({ nativeEvent }) => {
        NativeAppEventEmitter.emit("press", nativeEvent)
      },
      onPanResponderEnd: ({ nativeEvent }) => {
        NativeAppEventEmitter.emit("touchend", nativeEvent)
      },
      onPanResponderTerminate: ({ nativeEvent }) => {
        NativeAppEventEmitter.emit("touchend", nativeEvent)
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
