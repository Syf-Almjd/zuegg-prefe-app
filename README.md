# Zuegg Prefe BI Explorer

A data visualization and analytics dashboard for exploring Zuegg product distribution across retail stores.


## Overview

Zuegg Store Explorer is an interactive web application that provides insights into Zuegg product distribution, pricing, and store analytics. The application allows users to:

- Visualize store locations on an interactive map
- Analyze store distribution by retail chains and groups
- Search for specific products and view their pricing across different stores
- Compare product pricing and promotional data

## Features

### 🗺️ Store Map

- Interactive map showing all store locations
- Color-coded markers based on product pricing
- Detailed store information in popups
- Filtering stores by selected product

### 📊 Analytics Dashboard

- Store distribution by retail chain (Insegna)
- Store distribution by parent company (Gruppo)
- Key insights and statistics
- Interactive charts with tooltips

### 🔍 Product Search

- Search functionality for all Zuegg products
- Detailed product pricing analysis
- Price range and average price calculations
- Promotion tracking and statistics

## Technologies Used

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Mapping**: Leaflet & React Leaflet
- **Charts**: Recharts
- **UI Components**: 
  - Radix UI primitives
  - Ant Design components
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Data Processing**: Custom CSV parsing utilities

## Installation

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v10.4.1 or higher)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Syf-Almjd/zuegg-prefe-app
   cd zuegg-prefe-app
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Usage

### Store Map

The Store Map view displays all store locations on an interactive map. When a product is selected, the map will show only stores that carry that product, with markers color-coded based on pricing (green for lower prices, red for higher prices).

### Analytics

The Analytics view provides insights into store distribution across different retail chains and parent companies. Interactive charts show the number of stores by Insegna and Gruppo.

### Product Search

The Product Search view allows you to search for specific Zuegg products and view detailed pricing information, including:

- Average price across all stores
- Price range (min to max)
- Number of stores carrying the product
- Promotion statistics

## Project Structure

zuegg-prefe-app/
├── public/
│   ├── index.html
│   └── logo.svg
├── src/
│   ├── assets/
│   │   ├── zuegg_logo.png
│   │   └── ...
│   ├── components/
│   │   ├── dashboard/
│   │   │   └── Dashboard.jsx
│   │   ├── landing/
│   │   │   └── WelcomePage.jsx
│   │   ├── map/
│   │   │   └── StoreMap.jsx
│   │   ├── charts/
│   │   │   └── StoreCountCharts.jsx
│   │   ├── search/
│   │   │   └── ProductSearch.jsx
│   │   └── ...
│   ├── contexts/
│   │   └── AppContext.jsx
│   ├── hooks/
│   │   └── use-mobile.js
│   ├── lib/
│   │   ├── dataUtils.js
│   │   └── utils.js
│   ├── App.jsx
│   └── main.jsx
├── dist/
│   ├── index.html
│   └── ...
├── package.json
└── README.md

## Data Sources

The application uses two main data sources:

1. **storesvisible.csv**: Contains store information including:
   - Store ID
   - Address (city, street, province)
   - Geographic coordinates (latitude, longitude)
   - Store metadata (insegna, gruppo, centrale)

2. **zueggproducts.csv**: Contains product information including:
   - Store ID
   - Product name and brand
   - Base price
   - Promotional price (if available)

## Development

### Building for Production

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
