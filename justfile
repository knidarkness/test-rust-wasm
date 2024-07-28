set dotenv-load

PROJECT_NAME := "test_rust_wasm"

help:
    @echo "build - Build the project"
    @echo "build-and-run - Build and run the project"
    @echo "assemble - Assemble the project"
    @echo "generate-data - Generate data"
    @echo "build-wasm - Build the wasm"
    @echo "serve - Serve the project"

build: build-wasm generate-data assemble
build-and-run: build serve
run-cli:
    cd rust-cli && cargo run

build-cli:
    cd rust-cli && cargo build    

benchmark-cli:
    cd rust-cli && cargo build --release && cp target/release/rust-cli . && hyperfine --warmup 3 './rust-cli'

assemble:
    mkdir -p "./dist"
    cp public/* ./dist/
    cp rust-wasm/pkg/{{PROJECT_NAME}}.js ./dist/{{PROJECT_NAME}}.js
    cp rust-wasm/pkg/{{PROJECT_NAME}}_bg.wasm ./dist/{{PROJECT_NAME}}_bg.wasm
    cp rust-wasm/pkg/{{PROJECT_NAME}}.d.ts ./dist/{{PROJECT_NAME}}.d.ts

generate-data:
    cd helpers && npm i
    cd helpers && CUSTOMERS=50000 PURCHASE_ORDERS=2000000 PRODUCTS=30000 VENDORS=15000 npm run generate_data
    mkdir -p "./dist/data"
    cp ./helpers/output/* ./dist/data/

build-wasm:
    wasm-pack build --target web ./rust-wasm

serve:
    serve dist