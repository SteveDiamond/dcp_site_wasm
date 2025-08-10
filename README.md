# DCP Analyzer - Client-Side Version

A fully client-side implementation of the Stanford DCP (Disciplined Convex Programming) analyzer that runs entirely in the browser using Pyodide and WebAssembly.

## Quick Start

1. **Open the site**: Simply open `index.html` in a modern web browser
2. **Navigate to Analyzer**: Click on "Analyzer" in the left navigation
3. **Wait for initialization**: Pyodide will load (takes ~10-15 seconds on first load)
4. **Enter expressions**: Click the prompt box and type mathematical expressions

## Features

- **Complete DCP Parser**: Full implementation of the original DCP parser using PLY
- **Tree Visualization**: Interactive D3.js tree showing expression structure and DCP properties
- **No Server Required**: Everything runs in your browser via WebAssembly
- **Original UI**: Preserves the exact look and feel of dcp.stanford.edu

## Example Usage

In the Analyzer, try these expressions:

```
square(x) + square(y)
```

```
sqrt(x) + log(y)
```

```
variable positive x y
minimize square(x - y) subject to x + y >= 1
```

## File Structure

```
dcp_site_client/
├── index.html          # Home page
├── analyzer.html       # DCP Analyzer with tree visualization
├── test.html          # Test page to verify setup
├── static/            # All CSS, JS, and image assets
│   ├── js/           # Tree visualization and interaction code
│   ├── css/          # Styles including treeInteraction.css
│   ├── images/       # Curvature/sign icons
│   └── bootstrap/    # Bootstrap 2.3.2 assets
└── README.md         # This file
```

## Technical Details

The conversion involved:
1. **Parser Bundle**: Complete DCP parser bundled in `static/js/dcp_parser_bundle.py`
2. **Pyodide Integration**: Replaces Django's server-side parsing with in-browser Python
3. **Static Assets**: All original CSS, JavaScript, and images preserved
4. **Tree Visualization**: Original D3.js tree rendering fully functional

## Browser Requirements

- Modern browser with WebAssembly support
- JavaScript enabled
- Internet connection (for loading Pyodide and MathJax CDNs)

## Known Limitations

- Initial load time is slower due to Pyodide initialization
- Quiz mode and expression generator not yet implemented
- Feedback feature disabled (no server to send to)

## Development

To modify the parser, edit `static/js/dcp_parser_bundle.py` which contains:
- Complete expression and constraint classes
- Sign and curvature enumerations
- PLY-based parser
- JSON encoder for tree visualization

## Original Credits

Based on the DCP educational tool from Stanford University's Boyd group.