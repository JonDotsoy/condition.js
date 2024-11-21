.PHONY: fmt lint clean page/dev build

all: build

build: lib

fmt:
	bun run fmt

lint:
	bun run lint

clean: lib/*

lib:
	bunx tsc --project tsconfig.esm.json --outDir lib/esm

page/dev:
	cd packages/page && bun dev

lib/%:
	rm -rf $^
