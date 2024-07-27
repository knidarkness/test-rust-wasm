PROJECT_NAME := test_rust_wasm

debug:
	make build-wasm	
	make assemble
	make generate-data
	serve ./dist

build-wasm:
	wasm-pack build --target web 

assemble:
	cp public/* ./dist/
	cp pkg/$(PROJECT_NAME).js ./dist/$(PROJECT_NAME).js
	cp pkg/$(PROJECT_NAME)_bg.wasm ./dist/$(PROJECT_NAME)_bg.wasm
	cp pkg/$(PROJECT_NAME).d.ts ./dist/$(PROJECT_NAME).d.ts

generate-data:
	cd helpers && CUSTOMERS=20000 PURCHASE_ORDERS=1000000 PRODUCTS=20000 VENDORS=5000 npm run generate_data
	@if [ ! -d "./dist/data" ]; then\
		mkdir "./dist/data";\
	fi
	cp ./helpers/output/* ./dist/data/
	cd ..

debug-html:
	make assemble && serve dist

serve:
	serve dist