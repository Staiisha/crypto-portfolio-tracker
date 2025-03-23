import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Asset {
  id: string;
  name: string;
  amount: number;
  currentPrice: number;
  priceChange24h: number; 
}

interface PortfolioState {
  assets: Asset[];
}

const loadFromLocalStorage = (): Asset[] => {
  const data = localStorage.getItem("portfolio");
  return data ? JSON.parse(data) : [];
};

const initialState: PortfolioState = {
  assets: loadFromLocalStorage(),
};

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    addAsset: (state, action: PayloadAction<Asset>) => {
      state.assets.push(action.payload);
      localStorage.setItem("portfolio", JSON.stringify(state.assets));  
    },
    removeAsset: (state, action: PayloadAction<string>) => {
      state.assets = state.assets.filter((asset) => asset.id !== action.payload);
      localStorage.setItem("portfolio", JSON.stringify(state.assets));  
    },
    updateAssetPrice: (
      state,
      action: PayloadAction<{ name: string; newPrice: number; priceChange24h: number }>
    ) => {
      state.assets = state.assets.map((asset) =>
        asset.name.toLowerCase() === action.payload.name.toLowerCase()
          ? { ...asset, currentPrice: action.payload.newPrice, priceChange24h: action.payload.priceChange24h }
          : asset
      );
      localStorage.setItem("portfolio", JSON.stringify(state.assets));  
    },
  },
});

export const { addAsset, removeAsset, updateAssetPrice } = portfolioSlice.actions;
export default portfolioSlice.reducer;
