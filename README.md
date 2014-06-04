Canvas Zone export
===
a prototype app that extracts text information from user defined areas on a PDF.

---

Binaries needed:
--

**pdftocairo** converts PDFs to PNG format.
**imagemagick** is responsible for cropping PNG to user defined zones
**tesseract** handles the text extraction

http://manpages.ubuntu.com/manpages/precise/man1/pdftocairo.1.html


install
--

`git clone https://github.com/remyyounes/zonecanvas.git`
`cd zonecanvas`
`npm install `

if you encounter this problem:

Package 'xcb-shm', required by 'cairo', not found
gyp: Call to 'pkg-config --cflags poppler-glib cairo' returned exit status 1. while trying to load binding.gyp

you might need to fix your path:

export`PKG_CONFIG_PATH=/opt/X11/lib/pkgconfig`

Getting Started
--
- Start the server `node server.js`
- Select a PDF using the form. ( no need to press upload, it automatically handles it - needs to be removed )
- Wait for the list to populate
- Click on the `zone` buttons next to the `title` and `drawing number` fields
- define a zone on the large canvas. ( You can zoom with `mousewheel` and drag on the the thumbnail for scrolling navigation ).
- Save your zone
- Apply the current profile ( set of defined zones) to all Pages ( currently automatic)
