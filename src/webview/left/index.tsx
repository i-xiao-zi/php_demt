import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 初始化 WebView 组件
ReactDOM
    .createRoot(document.getElementById('root') as HTMLElement)
    .render(
        <App />
    );

// 添加消息监听，接收来自扩展的消息
window.addEventListener('message', event => {
  const message = event.data;
  console.log('收到来自扩展的消息:', message);
});