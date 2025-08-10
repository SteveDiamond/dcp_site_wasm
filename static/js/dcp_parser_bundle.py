# DCP Parser Bundle for Pyodide
# This bundles all the dcp_parser modules into a single file

# expression/sign.py
class Sign:
    # Class constants for sign strings.
    POSITIVE_KEY = 'POSITIVE'
    NEGATIVE_KEY = 'NEGATIVE'
    ZERO_KEY = 'ZERO'
    UNKNOWN_KEY = 'UNKNOWN'
    
    SIGN_STRINGS = {}
    SIGN_STRINGS[POSITIVE_KEY] = 'positive'
    SIGN_STRINGS[NEGATIVE_KEY] = 'negative'  
    SIGN_STRINGS[ZERO_KEY] = 'zero'
    SIGN_STRINGS[UNKNOWN_KEY] = 'unknown'
    
    # Map of sign string to sign key.
    STRING_TO_SIGN = dict((v,k) for k, v in SIGN_STRINGS.items())
    
    def __init__(self, sign_str):
        if sign_str in Sign.STRING_TO_SIGN:
            self.sign_str = sign_str
        else:
            raise Exception("'%s' is not a valid sign." % sign_str)
    
    def __str__(self):
        return self.sign_str
    
    @staticmethod
    def get_sign(sign_key):
        return Sign.SIGN_STRINGS[sign_key]
    
    # Class constants.
    POSITIVE = SIGN_STRINGS[POSITIVE_KEY]
    NEGATIVE = SIGN_STRINGS[NEGATIVE_KEY]
    ZERO = SIGN_STRINGS[ZERO_KEY]
    UNKNOWN = SIGN_STRINGS[UNKNOWN_KEY]

# expression/curvature.py
class Curvature:
    # Class constants for curvature strings.
    CONSTANT_KEY = 'CONSTANT'
    AFFINE_KEY = 'AFFINE'
    CONVEX_KEY = 'CONVEX' 
    CONCAVE_KEY = 'CONCAVE'
    UNKNOWN_KEY = 'UNKNOWN'
    
    CURVATURE_STRINGS = {}
    CURVATURE_STRINGS[CONSTANT_KEY] = 'constant'
    CURVATURE_STRINGS[AFFINE_KEY] = 'affine'
    CURVATURE_STRINGS[CONVEX_KEY] = 'convex'
    CURVATURE_STRINGS[CONCAVE_KEY] = 'concave'
    CURVATURE_STRINGS[UNKNOWN_KEY] = 'unknown'
    
    # Map of curvature string to curvature key.
    STRING_TO_CURV = dict((v,k) for k, v in CURVATURE_STRINGS.items())
    
    def __init__(self, curvature_str):
        if curvature_str in Curvature.STRING_TO_CURV:
            self.curvature_str = curvature_str
        else:
            raise Exception("'%s' is not a valid curvature." % curvature_str)
    
    def __str__(self):
        return self.curvature_str
    
    @staticmethod
    def get_curvature(curvature_key):
        return Curvature.CURVATURE_STRINGS[curvature_key]
    
    # Class constants.
    CONSTANT = CURVATURE_STRINGS[CONSTANT_KEY]
    AFFINE = CURVATURE_STRINGS[AFFINE_KEY]
    CONVEX = CURVATURE_STRINGS[CONVEX_KEY]
    CONCAVE = CURVATURE_STRINGS[CONCAVE_KEY]
    UNKNOWN = CURVATURE_STRINGS[UNKNOWN_KEY]

# expression/expression.py
class Expression:
    """Base class for expressions"""
    def __init__(self, name=None):
        self.subexpressions = []
        self.sign = Sign(Sign.UNKNOWN)
        self.curvature = Curvature(Curvature.UNKNOWN)
        self.name = name if name else ""
        self.short_name = self.name
        self.parens = False
        
    def add_subexpression(self, subexpression):
        self.subexpressions.append(subexpression)
        
    def add_parens(self):
        self.parens = True
        
    def __add__(self, other):
        result = Expression('+')
        result.add_subexpression(self)
        result.add_subexpression(other)
        return result
        
    def __sub__(self, other):
        result = Expression('-')
        result.add_subexpression(self)
        result.add_subexpression(other)
        return result
        
    def __mul__(self, other):
        result = Expression('*')
        result.add_subexpression(self)
        result.add_subexpression(other)
        return result
        
    def __div__(self, other):
        result = Expression('/')
        result.add_subexpression(self)
        result.add_subexpression(other)
        return result
        
    def __neg__(self):
        result = Expression('-')
        result.add_subexpression(self)
        return result
        
    def __le__(self, other):
        from dcp_parser.expression.constraints import LEQConstraint
        return LEQConstraint(self, other)
        
    def __ge__(self, other):
        from dcp_parser.expression.constraints import GEQConstraint
        return GEQConstraint(self, other)
        
    def __eq__(self, other):
        from dcp_parser.expression.constraints import EQConstraint
        return EQConstraint(self, other)

class Variable(Expression):
    def __init__(self, name, sign=Sign.UNKNOWN):
        super().__init__(name)
        self.sign = Sign(sign)
        self.curvature = Curvature(Curvature.AFFINE)

class Parameter(Expression):
    def __init__(self, name, sign=Sign.UNKNOWN):
        super().__init__(name)
        self.sign = Sign(sign)
        self.curvature = Curvature(Curvature.CONSTANT)

class Constant(Expression):
    def __init__(self, value):
        super().__init__(str(value))
        self.value = value
        if value > 0:
            self.sign = Sign(Sign.POSITIVE)
        elif value < 0:
            self.sign = Sign(Sign.NEGATIVE)
        else:
            self.sign = Sign(Sign.ZERO)
        self.curvature = Curvature(Curvature.CONSTANT)

# expression/statement.py
class Statement:
    """Base class for statements"""
    pass

# expression/constraints.py
class Constraint(Statement):
    def __init__(self, lhs, rhs):
        self.lhs = lhs
        self.rhs = rhs
        self.name = ""
        self.short_name = ""
        
class LEQConstraint(Constraint):
    def __init__(self, lhs, rhs):
        super().__init__(lhs, rhs)
        self.name = "<="
        self.short_name = "<="

class GEQConstraint(Constraint):
    def __init__(self, lhs, rhs):
        super().__init__(lhs, rhs)
        self.name = ">="
        self.short_name = ">="
        
class EQConstraint(Constraint):
    def __init__(self, lhs, rhs):
        super().__init__(lhs, rhs)
        self.name = "=="
        self.short_name = "=="

# atomic/atoms.py - simplified atom definitions
class Atom:
    def __init__(self, name, curvature, sign, num_args=None):
        self.name = name
        self.curvature = curvature
        self.sign = sign
        self.num_args = num_args
        
    def __call__(self, *args):
        expr = Expression(self.name)
        expr.curvature = Curvature(self.curvature)
        expr.sign = Sign(self.sign)
        for arg in args:
            expr.add_subexpression(arg)
        return expr

# Define standard atoms
ATOM_DICT = {
    'abs': Atom('abs', Curvature.CONVEX, Sign.POSITIVE, 1),
    'exp': Atom('exp', Curvature.CONVEX, Sign.POSITIVE, 1),
    'square': Atom('square', Curvature.CONVEX, Sign.POSITIVE, 1),
    'sqrt': Atom('sqrt', Curvature.CONCAVE, Sign.POSITIVE, 1),
    'log': Atom('log', Curvature.CONCAVE, Sign.UNKNOWN, 1),
    'entr': Atom('entr', Curvature.CONCAVE, Sign.UNKNOWN, 1),
    'inv_pos': Atom('inv_pos', Curvature.CONVEX, Sign.POSITIVE, 1),
    'pos': Atom('pos', Curvature.CONVEX, Sign.POSITIVE, 1),
    'neg': Atom('neg', Curvature.CONVEX, Sign.POSITIVE, 1),
    'max': Atom('max', Curvature.CONVEX, Sign.UNKNOWN),
    'min': Atom('min', Curvature.CONCAVE, Sign.UNKNOWN),
    'norm2': Atom('norm2', Curvature.CONVEX, Sign.POSITIVE),
    'norm1': Atom('norm1', Curvature.CONVEX, Sign.POSITIVE),
    'norm_inf': Atom('norm_inf', Curvature.CONVEX, Sign.POSITIVE),
    'geo_mean': Atom('geo_mean', Curvature.CONCAVE, Sign.POSITIVE),
    'quad_over_lin': Atom('quad_over_lin', Curvature.CONVEX, Sign.POSITIVE, 2),
    'pow': Atom('pow', Curvature.CONVEX, Sign.POSITIVE, 2),
    'kl_div': Atom('kl_div', Curvature.CONVEX, Sign.POSITIVE, 2),
    'log_sum_exp': Atom('log_sum_exp', Curvature.CONVEX, Sign.UNKNOWN),
    'huber': Atom('huber', Curvature.CONVEX, Sign.POSITIVE, 1),
}

# json/statement_encoder.py
import json

class StatementEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Expression):
            result = {
                'name': obj.name,
                'short_name': obj.short_name,
                'sign': str(obj.sign),
                'curvature': str(obj.curvature),
                'subexpressions': obj.subexpressions
            }
            if hasattr(obj, 'value'):
                result['value'] = obj.value
            return result
        elif isinstance(obj, Constraint):
            return {
                'name': obj.name,
                'short_name': obj.short_name,
                'lhs': obj.lhs,
                'rhs': obj.rhs
            }
        elif isinstance(obj, Statement):
            return {'statement': True}
        return super().default(obj)

# parser.py - Main parser using PLY
from ply import yacc, lex

class Parser:
    def __init__(self):
        self.clear()
        self.atom_dict = ATOM_DICT
        self.parser = self.build_parser()
        
    def clear(self):
        self.symbol_table = {}
        self.statements = []
        
    def parse(self, statement):
        self.errors = 0
        lines = statement.split('\n')
        for line in lines:
            if len(line.strip()) > 0:
                self.parser.parse(line)
            if self.errors > 0:
                raise Exception("'%s' is not a valid expression." % line)
                
    def build_parser(self):
        # Reserved keywords
        reserved = {
           'variable' : 'VARIABLE',
           'parameter' : 'PARAMETER',
            str(Sign.POSITIVE).lower() : 'SIGN',
            str(Sign.NEGATIVE).lower() : 'SIGN',
            str(Sign.ZERO).lower() : 'SIGN',
            str(Sign.UNKNOWN).lower() : 'SIGN',
            'Inf' : 'STRING_ARG',
        }
        
        tokens = [
            'INT','FLOAT',
            'PLUS','MINUS','TIMES','DIVIDE',
            'EQUALS','GEQ','LEQ',
            'LPAREN','RPAREN','COMMA',
            'ID'] + list(set(reserved.values()))
            
        # Tokens
        t_PLUS    = r'\+'
        t_MINUS   = r'-'
        t_TIMES   = r'\*'
        t_DIVIDE  = r'/'
        t_EQUALS  = r'=='
        t_LEQ     = r'<='
        t_GEQ     = r'>='
        t_LPAREN  = r'\('
        t_RPAREN  = r'\)'
        t_COMMA   = r','
        
        def t_ID(t):
            r'[a-zA-Z_][a-zA-Z_0-9]*'
            t.type = reserved.get(t.value,'ID')
            return t
            
        def t_FLOAT(t):
            r'\d*\.\d+'
            t.value = float(t.value)
            return t
            
        def t_INT(t):
            r'\d+'
            t.value = int(t.value) 
            return t
            
        t_ignore_COMMENT = r'\#.*'
        t_ignore = " \t"
        
        def t_newline(t):
            r'\n+'
            t.lexer.lineno += t.value.count("\n")
            
        def t_error(t):
            if t.value[0] == '=':
                raise Exception("'=' is not valid. Did you mean '=='?")
            elif t.value[0] == '<':
                raise Exception("'<' constraints are not valid. Consider using '<='.")
            elif t.value[0] == '>':
                raise Exception("'>' constraints are not valid. Consider using '>='.")
            elif t.value[0] == '^':
                raise Exception("'^' is not valid. Consider using the 'pow' function.")
            else:
                raise Exception("Illegal character '%s'." % t.value[0])
                
        # Build lexer
        lexer = lex.lex()
        
        # Parser rules
        precedence = (
            ('nonassoc', 'EQUALS', 'LEQ', 'GEQ'),
            ('left','PLUS','MINUS'),
            ('left','TIMES','DIVIDE'),
            ('right','UMINUS', 'UPLUS'),
        )
        
        def p_statement_variables(p):
            '''statement : VARIABLE id_list'''
            add_variables(p[2], Sign.UNKNOWN)
            
        def p_statement_variables_sign(p):
            '''statement : VARIABLE SIGN id_list'''
            add_variables(p[3], Sign(p[2]))
            
        def add_variables(variables, sign):
            for id in variables:
                self.symbol_table[id] = Variable(id, sign)
                
        def p_statement_parameters(p):
            '''statement : PARAMETER id_list'''
            add_parameters(p[2], Sign.UNKNOWN)
            
        def p_statement_parameters_sign(p):
            '''statement : PARAMETER SIGN id_list'''
            add_parameters(p[3], Sign(p[2]))
            
        def add_parameters(parameters, sign):
            for id in parameters:
                self.symbol_table[id] = Parameter(id, sign)
                
        def p_id_list(p):
            '''id_list : ID
                       | id_list ID '''
            if len(p) == 2:
                p[0] = [p[1]]
            else:
                p[1].append(p[2])
                p[0] = p[1]
                
        def p_statement_expr(p):
            '''statement : expression
                         | constraint'''
            self.statements.append(p[1])
            
        def p_statement_error(p):
            '''statement : expression error
                         | constraint error'''
            raise Exception("Invalid syntax after '%s'." % str(p[1]))
            
        def p_expression_arith_binop(p):
            '''expression : expression PLUS expression
                          | expression MINUS expression
                          | expression TIMES expression
                          | expression DIVIDE expression'''
            if p[2] == '+': p[0] = p[1] + p[3]
            elif p[2] == '-': p[0] = p[1] - p[3]
            elif p[2] == '*': p[0] = p[1] * p[3]
            elif p[2] == '/': p[0] = p[1] / p[3]
            
        def p_expression_bool_binop(p):
            '''constraint : expression EQUALS expression
                          | expression LEQ expression
                          | expression GEQ expression'''
            if p[2] == '==': p[0] = p[1].__eq__(p[3])
            elif p[2] == '<=': p[0] = p[1].__le__(p[3])
            elif p[2] == '>=': p[0] = p[1].__ge__(p[3])
            
        def p_expression_bool_binop_errors(p):
            '''constraint : constraint EQUALS expression
                          | constraint LEQ expression
                          | constraint GEQ expression'''
            raise Exception("An expression can only contain one constraint.")
            
        def p_expression_atom(p):
            'expression : ID LPAREN expression_list RPAREN'
            if not p[1] in self.atom_dict:
                raise Exception("'%s' is not a known function." % p[1])
            atom = self.atom_dict[p[1]]
            try:
                p[0] = atom(*p[3])
            except TypeError:
                raise Exception("Incorrect number of arguments in '%s'." % p[1])
                
        def p_expression_atom_error(p):
            '''expression : ID LPAREN error RPAREN'''
            raise Exception("Syntax error in call to '%s'." % p[1])
            
        def p_expression_list_single(p):
            '''expression_list : expression_or_empty
                               | STRING_ARG'''
            p[0] = [p[1]]
            
        def p_expression_list_multi(p):
            '''expression_list : expression_list COMMA expression_or_empty
                               | expression_list COMMA STRING_ARG'''
            p[1].append(p[3])
            p[0] = p[1]
            
        def p_expression_or_empty(p):
            '''expression_or_empty :
                                   | expression '''
            p[0] = '' if len(p) == 1 else p[1]
            
        def p_expression_uplus(p):
            'expression : PLUS expression %prec UPLUS'
            p[0] = p[2]
            
        def p_expression_uminus(p):
            'expression : MINUS expression %prec UMINUS'
            p[0] = -p[2]
            
        def p_expression_group(p):
            'expression : LPAREN expression RPAREN'
            p[2].add_parens()
            p[0] = p[2]
            
        def p_expression_number(p):
            '''expression : INT
                          | FLOAT'''
            p[0] = Constant(p[1])
            
        def p_expression_id(p):
            'expression : ID'
            try:
                p[0] = self.symbol_table[p[1]]
            except LookupError:
                raise Exception("'%s' is not a known variable or parameter." % p[1])
                
        def p_error(p):
            self.errors += 1
            
        return yacc.yacc()

# Create module namespaces
import sys
from types import ModuleType

# Create dcp_parser module structure
dcp_parser = ModuleType('dcp_parser')
dcp_parser.expression = ModuleType('dcp_parser.expression')
dcp_parser.json = ModuleType('dcp_parser.json')
dcp_parser.atomic = ModuleType('dcp_parser.atomic')

# Add classes to modules
dcp_parser.expression.Sign = Sign
dcp_parser.expression.Curvature = Curvature
dcp_parser.expression.Expression = Expression
dcp_parser.expression.Variable = Variable
dcp_parser.expression.Parameter = Parameter
dcp_parser.expression.Constant = Constant
dcp_parser.expression.Statement = Statement
dcp_parser.expression.constraints = ModuleType('dcp_parser.expression.constraints')
dcp_parser.expression.constraints.Constraint = Constraint
dcp_parser.expression.constraints.LEQConstraint = LEQConstraint
dcp_parser.expression.constraints.GEQConstraint = GEQConstraint
dcp_parser.expression.constraints.EQConstraint = EQConstraint

dcp_parser.parser = ModuleType('dcp_parser.parser')
dcp_parser.parser.Parser = Parser

dcp_parser.json.statement_encoder = ModuleType('dcp_parser.json.statement_encoder')
dcp_parser.json.statement_encoder.StatementEncoder = StatementEncoder

# Register modules
sys.modules['dcp_parser'] = dcp_parser
sys.modules['dcp_parser.expression'] = dcp_parser.expression
sys.modules['dcp_parser.expression.constraints'] = dcp_parser.expression.constraints
sys.modules['dcp_parser.parser'] = dcp_parser.parser
sys.modules['dcp_parser.json'] = dcp_parser.json
sys.modules['dcp_parser.json.statement_encoder'] = dcp_parser.json.statement_encoder