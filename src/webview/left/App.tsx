import React from 'react';
import { VSCodeTextField, VSCodeDropdown, VSCodeOption, VSCodeButton, VSCodeCheckbox } from "@vscode/webview-ui-toolkit/react";
import vscode from '../vscode';

const App: React.FC = () => {

  return (
    <div>
      <h1>Left</h1>
      <VSCodeTextField placeholder="Enter your username" />
      <VSCodeDropdown>
        <VSCodeOption>php/5.0</VSCodeOption>
        <VSCodeOption>php/5.6</VSCodeOption>
        <VSCodeOption>php/7.0</VSCodeOption>
      </VSCodeDropdown>
      <VSCodeDropdown>
        <VSCodeOption>mysql/5.1</VSCodeOption>
        <VSCodeOption>mysql/7.1</VSCodeOption>
        <VSCodeOption>mysql/5.1</VSCodeOption>
      </VSCodeDropdown>
      <VSCodeDropdown>
        <VSCodeOption>nginx/2.2</VSCodeOption>
        <VSCodeOption>apache/2.2</VSCodeOption>
      </VSCodeDropdown>
      <br/>
      <VSCodeCheckbox>x</VSCodeCheckbox>
      <VSCodeButton onClick={() => {
        console.log('绑定消息。。。。。。。。')
        vscode.postMessage({
          command: 'handleSelect',
          operation: 'start'
        })
      }}>启动</VSCodeButton>
    </div>
  );
};

export default App;
