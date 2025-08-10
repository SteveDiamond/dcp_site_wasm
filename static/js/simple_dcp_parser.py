# Simplified DCP Parser for Pyodide (without PLY dependency)
import json
import re

class Sign:
    POSITIVE = "positive"
    NEGATIVE = "negative" 
    ZERO = "zero"
    UNKNOWN = "unknown"

class Curvature:
    CONSTANT = "constant"
    AFFINE = "affine"
    CONVEX = "convex"
    CONCAVE = "concave"
    UNKNOWN = "unknown"

class Expression:
    def __init__(self, name="", sign=Sign.UNKNOWN, curvature=Curvature.UNKNOWN):
        self.name = name
        self.short_name = name
        self.sign = sign
        self.curvature = curvature
        self.subexpressions = []

    def to_dict(self):
        return {
            'name': self.name,
            'short_name': self.short_name,
            'sign': self.sign,
            'curvature': self.curvature,
            'subexpressions': [expr.to_dict() if hasattr(expr, 'to_dict') else str(expr) for expr in self.subexpressions]
        }

class Variable(Expression):
    def __init__(self, name, sign=Sign.UNKNOWN):
        super().__init__(name, sign, Curvature.AFFINE)

class Parameter(Expression):
    def __init__(self, name, sign=Sign.UNKNOWN):
        super().__init__(name, sign, Curvature.CONSTANT)

class Constant(Expression):
    def __init__(self, value):
        super().__init__(str(value))
        self.value = value
        if value > 0:
            self.sign = Sign.POSITIVE
        elif value < 0:
            self.sign = Sign.NEGATIVE
        else:
            self.sign = Sign.ZERO
        self.curvature = Curvature.CONSTANT

# Function definitions
FUNCTIONS = {
    'square': {'curvature': Curvature.CONVEX, 'sign': Sign.POSITIVE},
    'sqrt': {'curvature': Curvature.CONCAVE, 'sign': Sign.POSITIVE},
    'abs': {'curvature': Curvature.CONVEX, 'sign': Sign.POSITIVE},
    'exp': {'curvature': Curvature.CONVEX, 'sign': Sign.POSITIVE},
    'log': {'curvature': Curvature.CONCAVE, 'sign': Sign.UNKNOWN},
    'max': {'curvature': Curvature.CONVEX, 'sign': Sign.UNKNOWN},
    'min': {'curvature': Curvature.CONCAVE, 'sign': Sign.UNKNOWN},
    'pos': {'curvature': Curvature.CONVEX, 'sign': Sign.POSITIVE},
}

class SimpleDCPParser:
    def __init__(self):
        self.symbols = {}
        self.statements = []
        
    def parse(self, text):
        """Simple regex-based parsing"""
        text = text.strip()
        
        if text.startswith('variable'):
            self._parse_variable(text)
        elif text.startswith('parameter'):
            self._parse_parameter(text)
        else:
            # Try to parse as expression
            expr = self._parse_expression(text)
            self.statements.append(expr)
    
    def _parse_variable(self, text):
        # Extract variable names (simplified)
        parts = text.split()
        if len(parts) >= 2:
            vars = parts[1:]  # Skip 'variable'
            for var in vars:
                self.symbols[var] = Variable(var)
    
    def _parse_parameter(self, text):
        # Extract parameter names (simplified)
        parts = text.split()
        sign = Sign.UNKNOWN
        start_idx = 1
        
        if len(parts) > 1 and parts[1] == 'positive':
            sign = Sign.POSITIVE
            start_idx = 2
            
        if len(parts) > start_idx:
            params = parts[start_idx:]
            for param in params:
                self.symbols[param] = Parameter(param, sign)
    
    def _parse_expression(self, text):
        """Very simplified expression parsing"""
        text = text.strip()
        
        # Check for function calls
        for func_name, props in FUNCTIONS.items():
            pattern = func_name + r'\s*\('
            if re.search(pattern, text):
                expr = Expression(func_name)
                expr.curvature = props['curvature']
                expr.sign = props['sign']
                expr.short_name = func_name
                
                # Add dummy subexpression for visualization
                if func_name in ['square', 'sqrt', 'abs', 'exp', 'log', 'pos']:
                    # Single argument function
                    arg_expr = Expression('x')
                    arg_expr.curvature = Curvature.AFFINE
                    arg_expr.sign = Sign.UNKNOWN
                    arg_expr.short_name = 'x'
                    expr.subexpressions = [arg_expr]
                
                return expr
        
        # Check for simple variables
        if text in self.symbols:
            return self.symbols[text]
        
        # Check for numbers
        try:
            value = float(text)
            return Constant(value)
        except ValueError:
            pass
        
        # Default: create expression with unknown properties
        expr = Expression(text)
        expr.short_name = text
        return expr

class StatementEncoder(json.JSONEncoder):
    def default(self, obj):
        if hasattr(obj, 'to_dict'):
            return obj.to_dict()
        elif isinstance(obj, Expression):
            return {
                'name': obj.name,
                'short_name': obj.short_name,
                'sign': obj.sign,
                'curvature': obj.curvature,
                'subexpressions': obj.subexpressions
            }
        return super().default(obj)

# Create global parser instance
simple_parser = SimpleDCPParser()

def parse_dcp_expression(text):
    """Main parsing function for client"""
    try:
        simple_parser.parse(text)
        if simple_parser.statements:
            expr = simple_parser.statements[-1]
            return StatementEncoder().encode(expr)
        else:
            return json.dumps({"error": "No valid expression found"})
    except Exception as e:
        return json.dumps({"error": str(e)})