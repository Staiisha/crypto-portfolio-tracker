import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import styles from "./PortfolioOverview.module.scss";

const PortfolioOverview: React.FC = () => {
  const assets = useSelector((state: RootState) => state.portfolio.assets);
  const dispatch = useDispatch();

  // Рассчитываем общую стоимость портфеля
  const totalValue = assets.reduce((total, asset) => {
    const assetValue = asset.amount * asset.currentPrice;
    return total + assetValue;
  }, 0);

  return (
    <div className={styles.container}>
      <h2>Ваш портфель</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Название</th>
            <th>Количество</th>
            <th>ЦЕНА</th>
            <th>ОБЩАЯ СТОИМОСТЬ</th>
            <th>ИЗМЕНЕНИЯ ЗА 24 ЧАСА</th>
            <th>% ПОРТФЕЛЯ</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => {
            const assetValue = asset.amount * asset.currentPrice;
            const priceChange24h = asset.priceChange24h || 0; 
            const portfolioPercentage = totalValue ? (assetValue / totalValue) * 100 : 0;

            return (
              <tr key={asset.id}>
                <td>{asset.name}</td>
                <td>{asset.amount.toFixed(2)}</td>
                <td>${asset.currentPrice.toFixed(2)}</td>
                <td>${assetValue.toFixed(2)}</td>
                <td>{priceChange24h.toFixed(2)}%</td>
                <td>{portfolioPercentage.toFixed(2)}%</td>
                <td>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className={styles.totalValue}>
        <h3>Общая стоимость портфеля: ${totalValue.toFixed(2)}</h3>
      </div>
    </div>
  );
};

export default PortfolioOverview;