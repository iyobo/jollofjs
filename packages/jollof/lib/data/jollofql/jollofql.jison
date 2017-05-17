/**
 * http://zaach.github.io/jison/try/
 * http://jsonformatter.curiousconcept.com/
 * http://yobeki.com
 */

/* description: Parses SQL */
/* :tabSize=2:indentSize=2:noTabs=true: */
%lex

%options case-insensitive

%%

\s+                                              /* skip whitespace */
'BETWEEN'                                        return 'BETWEEN'
'ORDER BY'                                       return 'ORDER_BY'
','                                              return 'COMMA'
'='                                              return 'CMP_EQUALS'
'!='                                             return 'CMP_NOTEQUALS'
'>='                                             return 'CMP_GREATEROREQUAL'
'>'                                              return 'CMP_GREATER'
'<='                                             return 'CMP_LESSOREQUAL'
'<'                                              return 'CMP_LESS'
'('                                              return 'LPAREN'
')'                                              return 'RPAREN'
'['                                              return 'LBLOCK'
']'                                              return 'RBLOCK'
'IN'                                             return 'IN'
'AND'                                            return 'LOGICAL_AND'
'OR'                                             return 'LOGICAL_OR'
'NOT'                                            return 'LOGICAL_NOT'
'LIKE'                                           return 'LIKE'
'ASC'                                            return 'ASC'
'DESC'                                           return 'DESC'
["](\\.|[^"])*["]                                return 'STRING'
'NULL'                                           return 'NULL'
true                                             return 'TRUE'
false                                            return 'FALSE'
[0-9]+(\.[0-9]+)?                                return 'NUMERIC'
[a-zA-Z_\.*][a-zA-Z0-9_\.*]*                     return 'IDENTIFIER'
<<EOF>>                                          return 'EOF'
.                                                return 'INVALID'

/lex

%start main

%% /* language grammar */

main
  : expression EOF
    { return $1; }
  ;

orderBy
  : { $$ = null; }
  | ORDER_BY orderByCommaList { $$ = $2; }
  ;

orderValue
  : IDENTIFIER orderWay { $$ = {field: $1, dir: $2}; }
  ;

orderWay
  : { $$ = 'asc';}
  | ASC { $$ = 'asc'; }
  | DESC { $$ = 'desc'; }
  ;

orderByCommaList
  : orderByCommaList COMMA orderValue { $$ = $1; $1.push($3); }
  | orderValue { $$ = [$1]; }
  ;

expression
  : condition { $$ = [$1]; }
  | expression expressionConnector condition { $$ = $1; $3.connector=$2; $1.push($3); }
  ;

expressionConnector
  : LOGICAL_AND { $$ = 'and'; }
  | LOGICAL_OR { $$ = 'or'; }
  ;

condition
  : IDENTIFIER comp value { $$ = {field: $1, comp: $2, value: $3}; }
  | IDENTIFIER IN LPAREN commaList RPAREN { $$ = {field: $1, comp: 'in', value: $4}; }
  | IDENTIFIER IN LBLOCK commaList RBLOCK { $$ = {field: $1, comp: 'in', value: $4}; }
  | IDENTIFIER LOGICAL_NOT IN LPAREN commaList RPAREN { $$ = {field: $1, comp: 'not in', value: $5}; }
  | IDENTIFIER CMP_EQUALS NULL { $$ = {field: $1, comp: '=', value: null}; }
  | IDENTIFIER CMP_NOTEQUALS NULL { $$ = {field: $1, comp: '!=', value: null}; }
  | IDENTIFIER BETWEEN value LOGICAL_AND value { $$ = {field: $1, comp: 'between', value: [$3, $5]}; }
  | IDENTIFIER LOGICAL_NOT BETWEEN value LOGICAL_AND value { $$ = {field: $1, comp: 'not between', value: [$4, $6]}; }
  | LPAREN expression RPAREN { $$ = {items: $2}; }
  ;

commaList
  : commaList COMMA value { $$ = $1; $1.push($3); }
  | value { $$ = [$1]; }
  ;

value
  : STRING { $$ = yytext.substr(1, yytext.length - 2) } /* we don't want the wrapping quotes in output */
  | NUMERIC { $$ = Number(yytext) } /* output should return a true number, not a number as a string */
  | TRUE { $$ = true }
  | FALSE { $$ = false }
  | IDENTIFIER {$$ = yytext; }
  ;

comp
  : CMP_EQUALS { $$ = $1; }
  | CMP_NOTEQUALS { $$ = $1; }
  | CMP_NOTEQUALS_BASIC { $$ = $1; }
  | CMP_GREATER { $$ = $1; }
  | CMP_GREATEROREQUAL { $$ = $1; }
  | CMP_LESS { $$ = $1; }
  | CMP_LESSOREQUAL { $$ = $1; }
  | LIKE { $$ = 'like'; }
  | LOGICAL_NOT LIKE { $$ = 'not like'; }
  ;