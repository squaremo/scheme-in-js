
start
    = exprs:expr* { return exprs; }

ws = [ \t\n]*

expr = ws "(" ws es:expr* ws ")" { return es; }
     / ws t:term { return t; }

term = symbol
     / string
     / number
     / bool

bool = "#t" { return true; }
     / "#f" { return false; }

string
  = '"' '"'             { return "";    }
  / '"' chars:chars '"' { return chars; }

/* From JSON example
https://github.com/dmajda/pegjs/blob/master/examples/json.pegjs */

chars
  = chars:char+ { return chars.join(""); }

char
  = [^"\\\0-\x1F\x7f]
  / '\\"'  { return '"';  }
  / "\\\\" { return "\\"; }
  / "\\/"  { return "/";  }
  / "\\b"  { return "\b"; }
  / "\\f"  { return "\f"; }
  / "\\n"  { return "\n"; }
  / "\\r"  { return "\r"; }
  / "\\t"  { return "\t"; }
  / "\\u" h1:hexDigit h2:hexDigit h3:hexDigit h4:hexDigit {
      return String.fromCharCode(parseInt("0x" + h1 + h2 + h3 + h4));
    }

hexDigit
  = [0-9a-fA-F]

symbol
    = (head:[^0-9()\[\]\"] tail:[^ \"()\[\]]*)
     { return {kind: 'symbol', value: head + tail.join('')}; }

number
    = '0' { return 0; }
    / head:[1-9] tail:[0-9]* { return parseInt(head + tail.join('')); }
