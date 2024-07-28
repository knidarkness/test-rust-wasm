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

assemble:
    mkdir -p "./dist"
    cp public/* ./dist/
    cp pkg/{{PROJECT_NAME}}.js ./dist/{{PROJECT_NAME}}.js
    cp pkg/{{PROJECT_NAME}}_bg.wasm ./dist/{{PROJECT_NAME}}_bg.wasm
    cp pkg/{{PROJECT_NAME}}.d.ts ./dist/{{PROJECT_NAME}}.d.ts

generate-data:
    cd helpers && npm i
    cd helpers && CUSTOMERS=20000 PURCHASE_ORDERS=1000000 PRODUCTS=20000 VENDORS=5000 npm run generate_data
    mkdir -p "./dist/data"
    cp ./helpers/output/* ./dist/data/

build-wasm:
    wasm-pack build --target web 

serve:
    serve dist