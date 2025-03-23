import { store } from "../store";  
import { updateAssetPrice } from "../store/portfolioSlice";

let ws: WebSocket | null = null;


export const connectWebSocket = () => {
  const state = store.getState();
  const assetSymbols = state.portfolio.assets.map((asset) => asset.name.toLowerCase() + "usdt");


  if (ws) {
    ws.close();
    ws = null;
  }

  if (assetSymbols.length === 0) {
    console.log("No assets to track. WebSocket connection not established.");
    return;
  }


  const streams = assetSymbols.map((symbol) => `${symbol}@ticker_24hr`).join("/");
  const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`;


  ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log("WebSocket connection established.");
  };


  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);


      if (data.data && data.data.c && data.data.p && data.stream) {
        const price = parseFloat(data.data.c);  
        const priceChange24h = parseFloat(data.data.p);  
        const assetName = data.stream.split("@")[0].toUpperCase();  

        
        store.dispatch(updateAssetPrice({ name: assetName, newPrice: price, priceChange24h }));
      } else {
        console.warn("Received unexpected WebSocket data format:", data);
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  };

  
  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  
  ws.onclose = () => {
    console.log("WebSocket connection closed. Reconnecting in 5 seconds...");
    setTimeout(() => connectWebSocket(), 5000);  
  };
};


export const disconnectWebSocket = () => {
  if (ws) {
    ws.close();
    ws = null;
    console.log("WebSocket disconnected.");
  }
};