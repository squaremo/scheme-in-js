PEGJS:=node_modules/.bin/pegjs

.PHONY: all

all: grammar.js

grammar.js: $(PEGJS)
	$(PEGJS) grammar.pegjs

$(PEGJS):
	npm install
