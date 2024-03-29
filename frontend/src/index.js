import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter} from "react-router-dom";
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import ChatProvider from './Context/ChatProvider';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ChakraProvider>
      <ChatProvider>
      <App />
      </ChatProvider>
    </ChakraProvider></BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
