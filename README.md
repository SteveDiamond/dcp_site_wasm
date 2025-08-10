# DCP Site - Client-Side WebAssembly Version

A fully client-side implementation of the Stanford DCP (Disciplined Convex Programming) educational website that runs entirely in the browser using Pyodide and WebAssembly. Converted from the original Django-based site to eliminate server requirements while preserving all functionality.

## 🚀 Quick Start

1. **Start a local web server** (required for CORS):
   ```bash
   python -m http.server 8000
   ```

2. **Open in browser**: Navigate to `http://localhost:8000`

3. **Use the tools**:
   - **Analyzer**: Enter DCP expressions and see real-time tree visualization with curvature analysis
   - **Quiz**: Practice DCP rules with automatically generated expressions
   - **Rules/Functions**: Reference materials for learning DCP

## ✨ Features

### Complete DCP Analysis
- **Original DCP Parser**: Full implementation using PLY (Python Lex-Yacc) 
- **All Atomic Functions**: `sqrt()`, `log()`, `exp()`, `square()`, `abs()`, `pos()`, `max()`, `min()`, `geo_mean()`, `norm()`, and many more
- **Composition Rules**: Proper DCP violation detection for complex expressions like `pos(log(v))`
- **Tree Visualization**: Interactive D3.js trees showing expression structure, curvature, and sign properties

### Educational Tools  
- **Interactive Quiz**: Automatically generated expressions with adaptive difficulty
- **Real-time Feedback**: Instant curvature analysis and DCP compliance checking
- **Visual Learning**: Tree diagrams with color-coded curvature and sign indicators

### Technical Excellence
- **Zero Server Dependencies**: Runs entirely in browser via WebAssembly
- **Python 3 Compatible**: Fixed all Python 2/3 compatibility issues
- **Original UI**: Preserves exact look and feel of dcp.stanford.edu
- **Performance**: Fast parsing and rendering with proper initialization handling

## 📖 Example Usage

### DCP Analyzer

Try these expressions to see the power of DCP analysis:

**Simple convex expression:**
```
square(x) + square(y)
```

**Mixed curvature (DCP):**
```
sqrt(x) - log(y) 
```

**Complex composition (non-DCP):**
```
pos(log(v))
```

**Multi-argument functions:**
```
sqrt(geo_mean(364 * z, u)) - quad_over_lin(y - 42, log(y - 42))
```

### Quiz Mode
- Automatically generates expressions with known curvature properties
- Adaptive difficulty based on your performance  
- Immediate feedback with detailed explanations
- Practice identifying: Affine, Convex, Concave, or Non-DCP expressions

## 📁 Project Structure

```
dcp_site_wasm/
├── index.html              # Home page with navigation
├── analyzer.html           # DCP Analyzer with Pyodide integration
├── quiz.html               # Interactive quiz system
├── rules.html              # DCP rules reference  
├── functions.html          # Atomic functions reference
├── about.html              # About page
│
├── dcp_parser/             # Complete original DCP parser
│   ├── parser.py           # Main PLY-based parser
│   ├── atomic/            # Atomic function definitions
│   │   ├── atoms.py        # All 35+ atomic functions
│   │   └── atom_loader.py  # Dynamic atom loading
│   ├── expression/        # Expression class hierarchy
│   ├── error_messages/    # DCP violation detection
│   └── json/              # Tree serialization
│
└── static/                # Frontend assets
    ├── js/                # Tree visualization & interaction
    │   ├── TreeConstructor.js
    │   ├── TreeDisplay.js
    │   ├── quiz.js
    │   └── quiz-generator.js
    ├── css/               # Styling
    ├── images/            # Curvature/sign icons
    └── bootstrap/         # Bootstrap 2.3.2
```

## 🔧 Technical Implementation

### Architecture
- **Frontend**: HTML5, JavaScript, D3.js for visualization, Bootstrap for UI
- **Backend**: Python DCP parser running in Pyodide (WebAssembly)
- **Parser**: PLY-based parser with complete DCP rule implementation
- **No Server**: All computation happens client-side

### Key Technical Achievements
1. **Complete Parser Migration**: Imported entire original DCP parser codebase
2. **Python 3 Compatibility**: Fixed division operators (`__truediv__`) and other compatibility issues
3. **Atomic Function Support**: All 35+ functions working (sqrt, log, geo_mean, etc.)
4. **Pyodide Integration**: Seamless JavaScript ↔ Python communication
5. **Expression Generation**: Client-side quiz expression generator with proper filtering
6. **Tree Rendering**: Full D3.js visualization with curvature/sign indicators

### Performance Optimizations
- Pyodide loads asynchronously with user feedback
- Parser initialization happens once per page load
- Efficient tree rendering with proper cleanup
- Cached expression analysis

## 🌐 Browser Requirements

- **Modern Browser**: Chrome 67+, Firefox 58+, Safari 11.1+, Edge 79+
- **WebAssembly**: Required for Pyodide
- **JavaScript**: Must be enabled
- **Local Server**: Required to avoid CORS issues with file:// protocol

## ⚡ Development

### Running Locally
```bash
# Clone the repository
git clone <repo-url>
cd dcp_site_wasm

# Start local server (required)
python -m http.server 8000

# Or using Node.js
npx http-server -p 8000

# Open browser
open http://localhost:8000
```

### Modifying the Parser
The complete DCP parser is in `/dcp_parser/`. Key files:
- `parser.py`: Main PLY grammar and parsing logic
- `atomic/atoms.py`: All atomic function definitions
- `expression/expression.py`: Expression classes with arithmetic operators

### Adding New Functions
1. Add function class to `atomic/atoms.py`
2. Define curvature, sign, and monotonicity properties
3. Parser will automatically detect and load new functions

## 🎓 Educational Value

This implementation preserves all the educational value of the original Stanford DCP site:

- **Learn DCP Rules**: Interactive examples with immediate feedback
- **Practice Recognition**: Quiz mode with hundreds of generated expressions  
- **Visual Understanding**: Tree diagrams showing how DCP rules compose
- **Real Analysis**: Same parser used in CVXPY and other convex optimization tools

Perfect for students learning convex optimization, researchers working with DCP, or anyone interested in mathematical expression analysis.

## 📚 Original Credits

Based on the DCP educational tool from Stanford University's Boyd Convex Optimization Group:
- **Original Site**: dcp.stanford.edu
- **Research**: "Disciplined Convex Programming" by Michael Grant and Stephen Boyd
- **Related Tools**: CVXPY, CVX, Convex.jl

Converted to client-side WebAssembly implementation while preserving full functionality and educational value.