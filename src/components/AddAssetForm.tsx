import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addAsset } from "../store/portfolioSlice";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import styles from "./AddAssetForm.module.scss";

const AddAssetForm: React.FC = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchQuery.length > 2) {
      axios
        .get(`https://api.coingecko.com/api/v3/search?query=${searchQuery}`)
        .then((response) => {
          setSearchResults(response.data.coins);
        })
        .catch((error) => {
          console.error("Ошибка при поиске валюты:", error);
          setSearchResults([]);
        });
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleCurrencySelect = (currencyId: string, currencyName: string) => {
    axios
      .get(`https://api.coingecko.com/api/v3/simple/price?ids=${currencyId}&vs_currencies=usd`)
      .then((response) => {
        const price = response.data[currencyId]?.usd;
        if (price) {
          setPrice(price.toString());
          setSelectedCurrency(currencyId);
          setName(currencyName);
          setError(null); 
        } else {
          setError("Цена не найдена для выбранной валюты.");
        }
      })
      .catch((error) => {
        console.error("Ошибка при получении цены:", error);
        setError("Ошибка при получении цены. Попробуйте снова.");
      });
  };

  const handleAddAsset = () => {
    if (!name.trim() || !amount.trim() || !price.trim() || !selectedCurrency) {
      setError("Пожалуйста, заполните все поля.");
      return;
    }

    const newAsset = {
      id: uuidv4(),
      name,
      amount: parseFloat(amount),
      currentPrice: parseFloat(price),
      priceChange24h: 0, 
    };

    console.log("Добавляемый актив:", newAsset);

    dispatch(addAsset(newAsset));

    
    setName("");
    setAmount("");
    setPrice("");
    setSearchQuery("");
    setSearchResults([]);
    setSelectedCurrency(null);
    setError(null); 
  };

  return (
    <div className={styles.formContainer}>
      <input
        type="text"
        placeholder="Поиск валюты"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className={styles.searchResults}>
        {searchResults.map((coin) => (
          <div
            key={coin.id}
            className={styles.searchResultItem}
            onClick={() => handleCurrencySelect(coin.id, coin.name)}
          >
            {coin.name} ({coin.symbol.toUpperCase()})
          </div>
        ))}
      </div>
      <input
        type="number"
        placeholder="Количество"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="number"
        placeholder="Цена за единицу ($)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        readOnly
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
      <button onClick={handleAddAsset}>Добавить</button>
    </div>
  );
};

export default AddAssetForm;