nodejs-docset-builder
=====================

Build a dash docset for node.js.

WORK IN PROGRESS

usage (i mean, eventually)
--------------------------

first, build the nodejs docs (`make doc-only`). Then, call

```javascript
buildSearchIndexData('node/out/doc/api')
```

there'll probably be a cli entry point (i'm not even sure how to do
that properly in node fwiw). this will generate `index-data.json`,
which is basically the contents of searchIndex. Then, call

```javascript
createDb('docSet.dsidx', 'index-data.json')
```

again, there really ought to be a cli entry.

Now you have the searchable index and the docs. All you have to do is
place them in the standard docset directory structure and you're good
to go.

background
----------

I'm doing lots of dash-related stuff, like my new docbrowse stuff. I'm
about to start a new job, and lots of nodejs stuff could be involved
(or not). At the same time, I've never been happy with Kapeli's
official dash docs for nodejs. I'd like a higher-quality copy. And a
FOSS copy that others could make even higher-quality wouldn't hurt.

So hopefully this'll be that. I mean, when I manage to finish it.
