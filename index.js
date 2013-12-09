
function evaluate(expr, env) {
  switch (typeof expr) {
  case 'object':
    if (Array.isArray(expr)) {
      var head = expr[0];
      if (isSymbol(head)) {
        switch (head.value) {
        case 'lambda':
          return abstraction(expr, env);
        case 'quote':
          return quote(expr[1]);
        case 'begin':
          return progn(expr, env);
        case 'if':
          return alternate(expr, env);
        }
      }
      return application(expr, env);
    }
    else {
      switch (expr.kind) {
      case 'symbol':
        return ref(expr.value, env);
      default:
        throw new TypeError('What even is a ' + expr.kind + '?');
      }
    }
    break;
  case 'boolean':
  case 'number':
  case 'string':
    return quote(expr);
  }
}

function isSymbol(expr) {
  return (typeof expr === 'object' && expr.kind === 'symbol');
}

function quote(expr) {
  return expr;
}

function ref(symbol, env) {
  return env[symbol];
}

function alternate(exprs, env) {
  var test = exprs[0];
  var ifTrue = exprs[1];
  var ifFalse = exprs[2] || [];
  if (evaluate(test, env))
    return evaluate(ifTrue, env);
  else
    return evaluate(ifFalse, env);
}

function application(expr, env) {
  var f = evaluate(expr[0], env);
  var args = expr.slice(1).map(function(expr) {
    return evaluate(expr, env);
  });
  return f(args);
}

function abstraction(expr, env) {
  var params = expr[1];
  var paramsLen = params.length;

  function newEnv(args) {
    var env1 = Object.create(env);
    for (var i=0; i < paramsLen; i++) {
      env1[params[i].value] = args[i];
    }
    return env1;
  }

  var body = expr.slice(2);
  return function(args) {
    return progn(body, newEnv(args));
  }
}

function progn(exprs, env) {
  var len = exprs.length;
  for (var i=0; i < len - 1; i++) {
    evaluate(exprs[i], env);
  }
  return evaluate(exprs[i], env);
}

var parser = require('./grammar');

module.exports.parse = parser.parse;
module.exports.interpret = function(str, env) {
  var exprs = parser.parse(str);
  return progn(exprs, env || {});
};
