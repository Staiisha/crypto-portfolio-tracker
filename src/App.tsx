import React, { useEffect } from "react";
import PortfolioOverview from "./components/PortfolioOverview";
import AddAssetForm from "./components/AddAssetForm";
import { useAppSelector } from "./store/hooks";
import { connectWebSocket, disconnectWebSocket } from "./utils/WebSocketService"; // проверим, что здесь правильно импортируем
import "./App.scss";

const App: React.FC = () => {
  const assets = useAppSelector((state) => state.portfolio.assets);

  useEffect(() => {
    connectWebSocket();
    return () => disconnectWebSocket();
  }, [assets]); 

  return (
    <div className="app">
      <h1>Управление портфелем</h1>
      <AddAssetForm />
      <PortfolioOverview />
    </div>
  );
};

export default App;
