use polars::df;
use wasm_bindgen::prelude::*;

use rand::{thread_rng, Rng};

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn hello_world() {

    let mut arr = [0f64; 5];
    thread_rng().fill(&mut arr);

    let mut df = df! (
        "nrs" => &[Some(1), Some(2), Some(3), None, Some(5)],
        "names" => &[Some("foo"), Some("ham"), Some("spam"), Some("eggs"), None],
        "random" => &arr,
        "groups" => &["A", "A", "B", "C", "B"],
    ).unwrap();
    
    log("Started");
    for _ in 0..20 {
        log("adding");
        df = df.vstack(&df).unwrap();
    }

    log(&df.to_string());
    log("Hello, world!");
}
