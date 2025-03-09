# Project Overview

This project implements a web-based product filter tool built using Google Apps Script. It consists of two main files:

1. **code.gs** – The backend file, is the server-side script written in .gs that handles data part and filtering logic.
2. **index.html** – The frontend file, is the client-side HTML file that defines the UI, styling, and  JS logic to intereact with the UI and the back-end.

## Summary
This application allows users to make filters in a list of products based on criterias like price range(min or max), color, size, and gender. It dynamically loads filter options and product data from the server, and then displays the results in a responsive layout.

---

# File Documentation

## 1. code.gs

### Purpose
- **Server-Side Logic:** This file contains the backend functions that support the product filtering application.
- **Data Retrieval:** It defines functions that retrieve filter options  (available colors, sizes, genders) and product data (from the sheet).
- **Filtering Functionality:** It includes a function to filter products based on user-specified criteria and return a list of matching products.

### Functions

#### Logic
- **getProductData():**  
  - Retrieves all available product data.
  - Returns the data in a structured array format (with headers as the first row).
- **getFilterOptions():**  
  - Retrieves available filter options.
  - Returns an object containing arrays for colors, sizes, and genders.
- **filterProductsWithResults(filters):**  
  - Accepts a filters object containing criteria such as `minPrice`, `maxPrice`, `color`, `size`, and `gender`.
  - Processes and returns only the products that meet the criteria.

#### UI Handler
- **onOpen():** 
  - Create a new item in the sheet menu that opens the filter interface.
- **showFilterDialog():** 
  - This function creates the modal for the filter interface and exposes it so that it can be called when clicking on the new item created by onOpen().

---

## 2. index.html

### Purpose
- **User Interface:** Provides the front-end UI for the product filter application.
- **Interactivity:** Contains HTML, CSS, and JavaScript that allow users to select filters and view the filtered product list.
- **Responsive Design:** The layout adapts for both desktop (using a table view) and mobile devices (using product cards).

### Structure and Components

#### HTML Structure
- **Filter Section:**  
  - Contains a form with inputs for price range (`minPrice`, `maxPrice`), dropdowns for `color`, `size`, and `gender`, and two buttons (Apply Filters and Clear Filters).
- **Results Section:**  
  - Displays the filtered products either as a table (for wider screens) or as individual product cards (for mobile devices).

#### CSS Styling
- **Theming with CSS Variables:**  
  - Utilizes CSS custom properties (`--primary-color`, `--background-color`) for consistent theming.
- **Aesthetic Design:**  
  - Provides subtle shadows, border radios, and hover effects to improve the user experience.

#### JavaScript Logic
- **populateFilters():**  
  - Called on window load.
  - Invokes `google.script.run.getFilterOptions()` to populate the dropdowns with filter options.
  - Calls `loadProductData()` to load all available products.
- **loadProductData():**  
  - Calls `google.script.run.getProductData()` to fetch the initial product list.
  - Displays a loading message while data is being fetched.
- **handleSubmit(event):**  
  - Prevents default form submission.
  - Collects filter values and calls `google.script.run.filterProductsWithResults(filters)` to fetch filtered data.
  - Updates the UI with a progress message during filtering.
- **displayResults(results):**  
  - Renders the product data in a table format on desktops or as cards on mobile devices.
  - Checks if there are results and displays an appropriate message if no products match the criteria.
- **clearFilters():**  
  - Resets the filter form.
  - Clears messages and reloads the complete product list.

---

# How to Use

1. **Deployment:**  
   - Open the desired sheet, then go to Extensions and select Apps Script.
   - Add the two files of this project in the Apps Scripts(`index.html` and `code.gs`). 
   - Deploy the project as a Google Apps Script web app.
   - Ensure that that the privacy options are correct for your use.
     
2. **User Interaction:**  
   - When a user visits the sheet, the page automatically loads available filter options and product data.
   - Users can specify a price range, choose from available colors, sizes, or genders, and then click **Apply Filters** to see a refined list of products.
   - To reset the filters and view all products again, the user can click **Clear Filters**.

3. **Data Updates:**  
   - Update the underlying data source (e.g., Google Sheets) if the product list or filter options change.
   - The UI will automatically reflect the updated data the next time it loads or when filters are applied.

---

# Maintenance Guidelines

### Code Updates and Enhancements
- **Modularity:**  
  - Both files are modular. Changes to the UI should be made in `index.html`, while modifications to business logic and data handling should be applied in `code.gs`.
- **Testing:**  
  - Use the browser’s developer tools to debug client-side JavaScript.
  - Use the Google Apps Script logging system (`Logger.log`) to monitor server-side processes.

---
