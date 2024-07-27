PROJECT_NAME := test_rust_wasm

debug:
	make build-wasm	
	make assemble
	make generate-data
	serve ./pkg

build-wasm:
	wasm-pack build --release --target web

assemble:
	cp public/* ./dist/
	cp pkg/$(PROJECT_NAME).js ./dist/$(PROJECT_NAME).js
	cp pkg/$(PROJECT_NAME)_bg.wasm ./dist/$(PROJECT_NAME)_bg.wasm
	cp pkg/$(PROJECT_NAME).d.ts ./dist/$(PROJECT_NAME).d.ts

generate-data:
	cd helpers && npm run generate_data
	mkdir ./dist/data
	cp ./helpers/output/* ./dist/data/
	cd ..

debug-html:
	make assemble && serve dist