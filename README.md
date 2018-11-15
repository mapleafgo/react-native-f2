# react-native-f2
antv-f2的react-native实现

## 文档：
文档请看官方的[docs](https://antv.alipay.com/zh-cn/f2/3.x/index.html)

## 使用示例：
安装
```
yarn add react-native-f2
或
npm i -S react-native-f2
```

```js
import F2, { F2Canvas } from 'react-native-f2';

const width = Dimensions.get("window").width;

class Demo extends Component {
  componentDidMount() {
    const data = [
      { year: '1951', sales: 38 },
      { year: '1952', sales: 52 },
      { year: '1956', sales: 61 },
      { year: '1957', sales: 145 },
      { year: '1958', sales: 48 },
      { year: '1959', sales: 38 },
      { year: '1960', sales: 38 },
      { year: '1962', sales: 38 },
    ];
    //TODO: 宽高必须指定
    const chart = new F2.Chart({
      el: this.$canvas.getCanvas(),
      width,
      height: width - 100,
    });
    chart.source(data);
    chart.interval().position('year*sales');
    chart.render();
  }

  render() {
    <F2Canvas ref={e => this.$canvas = e} />
  }
}
```
