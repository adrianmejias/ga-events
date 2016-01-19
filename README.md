ga-events
==========

Add Google Analytics link tracking automatically

## Table of contents

- [Quick start](#quick-start)
- [What's included](#whats-included)
- [Example](#example)
- [Available options](#available-options)

## Quick start

Several quick start options are available:

- [Download the latest release](https://github.com/adrianmejias/ga-events/archive/0.0.1.zip).
- Clone the repo: `git clone https://github.com/adrianmejias/ga-events.git`.
- Install with [Bower](http://bower.io): `bower install ga-events`.

### What's included

Within the download you'll find the following directories and files, logically grouping common assets and providing both compiled and minified variations. You'll see something like this:

```
ga-events/
├── ga-events.js
├── ga-events.min.js
```

### Example
Example file upload and usage:

**Demo:** https://adrianmejias.com/ga-events

```html
<!-- Include jQuery Beforehand -->
<script src="ga-events.js"></script>
```

```javascript
$(document).gaEvents();
```

### Available options

* ``uaId``: **string** Google Analytics ID.
* ``uid``: **string** Google Analytics User-ID value.
* ``enableScrollTrack``: **boolean** Enable scroll data sending.
* ``enableClickTrack``: **boolean** Enable global click data sending.
* ``enableMailTrack``: **boolean** Enable mailto data sending.
* ``enableDownloadTrack``: **boolean** Enable download data sending.
* ``enableLinkTrack``: **boolean** Enable link data sending.
* ``enableButtonTrack``: **boolean** Enable button data sending.
* ``enableSubmitTrack``: **boolean** Enable submit data sending.
* ``downloadTrackExtension``: **array** Enable download data sending.
* ``enableAnchorTrack``: **boolean** Enable anchor data sending.
* ``enablePrintTrack``: **boolean** Enable print data sending.
* ``printTrackBefore``: **boolean** Enable before print data sending.
* ``printTrackAfter``: **boolean** Enable after print data sending.
* ``enableIdlePageTrack``: **boolean** Enable idle data sending.
* ``idlePageInterval``: **integer** Average time that will send idle data.
* ``enableErrorTrack``: **boolean** Enable javascript error

```javascript
$(document).gaEvents({
  uaId: false,
  uid: false,
  enableScrollTrack: false,
  enableClickTrack: false,
  enableMailTrack: true,
  enableDownloadTrack: true,
  enableLinkTrack: true,
  enableButtonTrack: true,
  enableSubmitTrack: true,
  downloadTrackExtension: ['zip', 'pdf', 'doc', 'docx'],
  enableAnchorTrack: true,
  enablePrintTrack: true,
  printTrackBefore: false,
  printTrackAfter: true,
  enableIdlePageTrack: false,
  idlePageInterval: 60 * 1000,
  enableErrorTrack: true
});
```
