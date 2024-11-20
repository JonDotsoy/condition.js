.PHONY: fmt lint clean

all: lib

fmt:
	bun run fmt

lint:
	bun run lint

clean:
	rm -rf lib

lib:
	bunk tsc --project tsconfig.esm.json --outDir lib/esm

demo-page:
	cd packages/page && bun dev
