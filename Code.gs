function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Filter Products')
    .addItem('Open Filter Interface', 'showFilterDialog')
    .addToUi();
}


function showFilterDialog() {
  const html = HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Product Filters')
    .setWidth(1200)
    .setHeight(800);
  SpreadsheetApp.getUi().showModalDialog(html, 'Index');
}



function getProductData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sourceSheet = ss.getSheetByName("Base products");
  if (!sourceSheet) {
    SpreadsheetApp.getUi().alert("Error: Source sheet 'Base products' not found.");
    return [[]];
  }
  const data = sourceSheet.getDataRange().getValues();
  if (data.length < 2) {
    SpreadsheetApp.getUi().alert("Error: No data found in 'Base products' sheet.");
    return [[]];
  }
  return data;
}

function getFilterOptions() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Base products");
  if (!sheet) {
    SpreadsheetApp.getUi().alert("Error: Base products sheet not found.");
    return { colors: [], sizes: [], genders: [] };
  }
  
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    SpreadsheetApp.getUi().alert("Error: No data available in Base products sheet.");
    return { colors: [], sizes: [], genders: [] };
  }
  
  const headers = data[0];
  const colorCol = headers.indexOf("COLOR") !== -1 ? headers.indexOf("COLOR") : headers.indexOf("Color");
  const sizeCol = headers.indexOf("SIZE") !== -1 ? headers.indexOf("SIZE") : headers.indexOf("Size");
  const genderCol = headers.indexOf("GENDER") !== -1 ? headers.indexOf("GENDER") : headers.indexOf("Gender");
  
  const colors = new Set();
  const sizes = new Set();
  const genders = new Set();
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (colorCol !== -1 && row[colorCol]?.toString().trim()) colors.add(row[colorCol]);
    if (sizeCol !== -1 && row[sizeCol]?.toString().trim()) sizes.add(row[sizeCol]);
    if (genderCol !== -1 && row[genderCol]?.toString().trim()) genders.add(row[genderCol]);
  }
  
  return {
    colors: [...colors].sort(),
    sizes: [...sizes].sort(),
    genders: [...genders].sort()
  };
}

function filterProductsWithResults(filters) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sourceSheet = ss.getSheetByName("Base products");
  if (!sourceSheet) {
    SpreadsheetApp.getUi().alert("Error: Source sheet 'Base products' not found.");
    return [[]];
  }
  
  const data = sourceSheet.getDataRange().getValues();
  if (data.length < 2) {
    SpreadsheetApp.getUi().alert("Error: No data found in 'Base products' sheet.");
    return [[]];
  }
  
  const headers = data[0];
  const priceCol = headers.indexOf("PRICE") !== -1 ? headers.indexOf("PRICE") : headers.indexOf("Price");
  const colorCol = headers.indexOf("COLOR") !== -1 ? headers.indexOf("COLOR") : headers.indexOf("Color");
  const sizeCol = headers.indexOf("SIZE") !== -1 ? headers.indexOf("SIZE") : headers.indexOf("Size");
  const genderCol = headers.indexOf("GENDER") !== -1 ? headers.indexOf("GENDER") : headers.indexOf("Gender");
  
  if (priceCol === -1 || colorCol === -1 || sizeCol === -1 || genderCol === -1) {
    SpreadsheetApp.getUi().alert("Error: Missing required columns (PRICE/Price, COLOR/Color, SIZE/Size, GENDER/Gender).");
    return [headers];
  }
  
  const results = [headers];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const price = parseFloat(row[priceCol]);
    const minPrice = filters.minPrice?.trim();
    const maxPrice = filters.maxPrice?.trim();
    
    if ((minPrice && price < parseFloat(minPrice)) ||
        (maxPrice && price > parseFloat(maxPrice)) ||
        (filters.color?.trim() && row[colorCol].toString().toLowerCase() !== filters.color.toLowerCase()) ||
        (filters.size?.trim() && row[sizeCol].toString().toLowerCase() !== filters.size.toLowerCase()) ||
        (filters.gender?.trim() && row[genderCol].toString().toLowerCase() !== filters.gender.toLowerCase())) {
      continue;
    }
    results.push(row);
  }
  
  const resultsSheet = ss.getSheetByName("FilteredResults") || ss.insertSheet("FilteredResults");
  resultsSheet.clearContents();
  if (results.length > 1) {
    resultsSheet.getRange(1, 1, results.length, headers.length).setValues(results);
  } else {
    SpreadsheetApp.getUi().alert("No matching products found with the specified filters.");
  }
  
  return results;
}

