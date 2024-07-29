use polars::{lazy::dsl::col, prelude::*};

fn main() {
    let df_customers = read_df_from_file("../dist/data/customers.json").unwrap();
    let df_products = read_df_from_file("../dist/data/products.json").unwrap();
    let df_vendors = read_df_from_file("../dist/data/vendors.json").unwrap();
    let df_purchase_orders = read_df_from_file("../dist/data/purchaseOrders.json").unwrap();

    let default_join_args = JoinArgs::new(polars::prelude::JoinType::Inner);
    let products_join_args = default_join_args.clone().with_suffix(Some("_products".to_string()));
    let customers_join_args = default_join_args.clone().with_suffix(Some("_customers".to_string()));
    let vendors_join_args = default_join_args.clone().with_suffix(Some("_vendors".to_string()));

    let df_orders_with_products = df_purchase_orders
        .lazy()
        .join(
            df_products.lazy(),
            [col("orderProductId")],
            [col("productId")],
            products_join_args,
        )
        .join(
            df_customers.lazy(),
            [col("orderCustomerId")],
            [col("customerId")],
            customers_join_args
        )
        .join(
            df_vendors.lazy(),
            [col("orderVendorId")],
            [col("vendorId")],
            vendors_join_args
        )
        .group_by([col("country")])
        .agg([col("price").sum()])
        .collect();
    
    match df_orders_with_products {
        Ok(df) => {
            println!("{}", df);
        }
        Err(e) => {
            println!("{}", e);
        }
    }
}

fn read_df_from_file(file_path: &str) -> Result<DataFrame, PolarsError> {
    let mut file = std::fs::File::open(file_path).unwrap();
    match JsonReader::new(&mut file).finish() {
        Ok(df) => Ok(df),
        Err(e) => Err(e),
    }
}