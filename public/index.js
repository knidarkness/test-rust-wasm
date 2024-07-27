import init, { hello_world } from './test_rust_wasm.js';

init().then(() => {
    hello_world();
});