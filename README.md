# Au-Hexx

> crazy monolith-like Webgl Demo for 4 DEVX2108

[![AU-HEXX](https://spleennooname.github.io/au-hexx/au.png)](http://devx.ddd.it/en/experiment/5 "Au Hexx")

## demo

[au-hexx](https://au-hexx.surge.sh/)

## setup

``` bash
# install dependencies
npm i

# serve with hot reload at localhost:3000
npm run dev

# build for production
npm run build
```

## changelog

* 02/2018, first release for DEVX 2018!!

* 04/2019, massive rebuild-from-scratch with new techniques acquired in the while. New features:
  * A lot GSL optimizations (many computations shifted in the vertex shader)
  * remove VueJS
  * builtWith [TwglJS](http://twgljs.org)
  * FBO ping pong buffering
  * [detect-gpu](https://www.npmjs.com/package/detect-gpu) for sniffing, providing scalability choices
  * update deps with Webpack, etc.

* 04/2022
  * rewrite with vitejs, add meyda
