use std::io::Cursor;
use std::time::Instant;

use polars::prelude::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub async fn hello_world() {
    log("Hello, world!");
    log("Fetching data...");
    let df_customers = fetch_data("http://localhost:3000/data/customers.json").await.unwrap();
    log("Customers fetched");
    let df_vendors = fetch_data("http://localhost:3000/data/vendors.json").await.unwrap();
    log("Vendors fetched");
    let df_products = fetch_data("http://localhost:3000/data/products.json").await.unwrap();
    log("Products fetched");
    let df_purchase_orders = fetch_data("http://localhost:3000/data/purchaseOrders.json").await.unwrap();  
    log("Purchase orders fetched");

    log(&df_products.to_string());
    log(&df_purchase_orders.to_string());
    log(&df_customers.to_string());
    log(&df_vendors.to_string());
    let now = web_sys::window().expect("should have windows").performance().unwrap().now();
    let default_join_args = JoinArgs::new(polars::prelude::JoinType::Inner);
    let products_join_args = default_join_args.clone().with_suffix(Some("products".to_string()));
    let customers_join_args = default_join_args.clone().with_suffix(Some("customers".to_string()));
    let vendors_join_args = default_join_args.clone().with_suffix(Some("vendors".to_string()));

    log("Joining dataframes...");
    let df_orders_with_products = df_purchase_orders
        .join(
            &df_products,
            ["orderProductId"],
            ["productId"],
            products_join_args,
        )
        .unwrap()
        .join(
            &df_customers,
            ["orderCustomerId"],
            ["customerId"],
            customers_join_args
        )
        .unwrap()
        .join(
            &df_vendors,
            ["orderVendorId"],
            ["vendorId"],
            vendors_join_args
        );
    match df_orders_with_products {
        Ok(df) => {
            log(&df.to_string());
            df.get_column_names().iter().for_each(|col| log(&col));
        },
        Err(e) => log(&e.to_string())
        
    }
    let later = web_sys::window().expect("should have windows").performance().unwrap().now();
    let total = later - now;
    log(&total.to_string())
}

async fn fetch_data(address: &str) -> Result<polars::prelude::DataFrame, Box<dyn std::error::Error>> {
    let url = reqwest::Url::parse(address)?;
    let response = reqwest::get(url).await?;
    let response_json: serde_json::Value = response.json().await?;
    let json_string = serde_json::to_string(&response_json)?;
    let cursor = Cursor::new(json_string);
    let customers_df = JsonReader::new(cursor).finish()?;
    Ok(customers_df)
}
