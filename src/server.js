import 'babel-polyfill';
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import React from 'react';
import ReactDOM from 'react-dom/server';
import UniversalRouter from 'universal-router';
import PrettyError from 'pretty-error';
import App from './components/App';
import Html from './components/Html';
import NotSupport, {isNotSupport} from './components/NotSupport';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.less';
import routes from './routes';
import assets from './assets'; // eslint-disable-line import/no-unresolved
import { port } from './config';
import getStore from './store.js';
import api from './api';
import './less/index.less';
import WsServer from './standard-business/wsServer';
import WebSocketProxy from './api/wsProxy';
import {epld} from "./api/gloablConfig";

const app = express();

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';
global.store = getStore();
global.isServer = true;

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '512kb', strict: false}));

if (process.env.NODE_ENV !== 'production') {
  app.enable('trust proxy');
}

app.use('/api', api);

const isLogin = (req) => {
  const {token} = req.cookies;
  return !!token;
};

const isJumpLogin = (req) => {
  const path = req.path;
  if(path === '/password/find'){
    return false;
  }else if(path === '/password/reset'){
    return false
  }else if(path === '/registered'){
    return false
  }else{
    return !isLogin(req) && (path !== '/login')
  }
};

const isRegistered = (req) => {
  const {token} = req.cookies;
  const path = req.path;
  if(path === '/registered'){
    return true
  }
  return !!token;
};


//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    const userAgent = req.headers['user-agent'];
    if (isNotSupport(userAgent)) {
      const page = ReactDOM.renderToStaticMarkup(<NotSupport userAgent={userAgent} />);
      res.send(`<!doctype html>${page}`);
      return;
    }

/*    //跳转去epld
    if (req.path === '/epldLogin'){
      res.redirect(302, epld);
      return;
    }*/

    if(req.path === '/code'){
      res.cookie('token', req.query.token);
      res.cookie('accountId', req.query.accountId);
      res.redirect(302, '/fadada');
      return
    }

    if(isJumpLogin(req)){
      res.redirect(302, '/login');
      return
    }

    if (req.path === '/signature') {
      res.cookie('token', req.query.token);
      res.redirect(302, '/');
      return;
    }
    //识别不到token跳转去注册页面
/*    if (!isRegistered(req)) {
      res.redirect(302, '/registered');
      return;
    }*/


    const css = new Set();
    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      // Enables critical path CSS rendering
      // https://github.com/kriasoft/isomorphic-style-loader
      insertCss: (...styles) => {
        // eslint-disable-next-line no-underscore-dangle
        styles.forEach(style => css.add(style._getCss()));
      },
      store: global.store,
    };

    const route = await UniversalRouter.resolve(routes, {
      path: req.path,
      query: req.query,
      url: req.path
    });

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect);
      return;
    }

    const data = { ...route };
    data.children = ReactDOM.renderToString(<App context={context}>{route.component}</App>);
    data.style = [...css].join('');
    if (route.single) {
      data.scripts = [assets.common.js, assets.single.js];
    } else {
      data.scripts = [assets.common.js, assets.client.js,];
      if (assets[route.chunk]) {
        data.scripts.push(assets[route.chunk].js);
      }
    }

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(route.status || 200);
    res.send(`<!doctype html>${html}`);
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.log(pe.render(err)); // eslint-disable-line no-console
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      style={errorPageStyle._getCss()} // eslint-disable-line no-underscore-dangle
    >
      {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
    </Html>
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
const server = app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}/`);
});

// // 建立WS服务器
// const wsProxy = new WebSocketProxy();
// const wsServer = WsServer.createServer(server);
// wsServer.onConnect(ws => wsProxy.addWebSocket(ws));
