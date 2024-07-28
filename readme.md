# pola.rs tests

on 2kk purchase events, 5k vendors, 5k products, 5k customers
```bash
knidarkness@knidarknes-yoga:~/work/test-rust-wasm/rust-cli$ just benchmark-cli 
cd rust-cli && cargo build --release && cp target/release/rust-cli . && hyperfine --warmup 3 './rust-cli'
    Finished `release` profile [optimized] target(s) in 0.13s
Benchmark 1: ./rust-cli
  Time (mean ± σ):      2.495 s ±  0.054 s    [User: 2.644 s, System: 1.146 s]
  Range (min … max):    2.435 s …  2.567 s    10 runs
```

On 50000 customers, 15000 vendors, 30000 products, and 2000000 purchase orders

```bash
knidarkness@knidarknes-yoga:~/work/test-rust-wasm/rust-cli$ just benchmark-cli 
cd rust-cli && cargo build --release && cp target/release/rust-cli . && hyperfine --warmup 3 './rust-cli'
    Finished `release` profile [optimized] target(s) in 0.13s
Benchmark 1: ./rust-cli
  Time (mean ± σ):      2.797 s ±  0.104 s    [User: 3.050 s, System: 1.230 s]
  Range (min … max):    2.649 s …  2.966 s    10 runs
```