var DOTSCRIPTHEADER = 'digraph finite_state_machine {\n' + '  rankdir = LR;\n';
var DOTSCRIPTEND = '}\n';

function escapeCharacter(token) {
  switch (token)  {
    case ' ':
      return '[space]';
    case '\n':
      return '\\\\n';
    case '\t':
      return '\\\\t';
    case '\r':
      return '\\\\r';
    case '\\':
      return '[\\\\]';
  }
  return token;
}

function node_name(i, alpha) {
  return alpha ? String.fromCharCode("A".charCodeAt(0) + Number(i)) : i;
}

exports.toDotScript = function(fsm, alpha) {
  var transitionDotScript = '  node [shape = circle];\n';
  for (var from_id in fsm.transitions) {
    for (var to_id in fsm.transitions[from_id]) {
    transitionDotScript += '  ' + node_name(from_id, alpha) + '->' + node_name(to_id, alpha) + ' [label="' +
        escapeCharacter(fsm.transitions[from_id][to_id]) + '"];\n';
    }
  }
  var initialStatesDotScript = '';
  var initialStatesStartDotScript = '  node [shape = plaintext];\n';
  var acceptStatesDotScript = '';
  for (var i = 0; i < fsm.numOfStates; ++i) {
    if (fsm.acceptStates.indexOf(i.toString()) != -1) {
      acceptStatesDotScript += '  node [shape = doublecircle]; ' + node_name(i, alpha) + ';\n';
    }
    if (fsm.initialState == i.toString()) {
      initialStatesStartDotScript += '  "" -> ' + node_name(i, alpha) + ' [label = "start"];\n';
      // accept is higher priority than initial state.
      if (fsm.acceptStates.indexOf(i.toString()) == -1)
        initialStatesDotScript += '  node [shape = circle]; ' + node_name(i, alpha) + ';\n';
    }
  }
  return DOTSCRIPTHEADER + initialStatesDotScript + acceptStatesDotScript +
      initialStatesStartDotScript + transitionDotScript + DOTSCRIPTEND;
}
