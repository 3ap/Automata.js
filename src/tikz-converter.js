var TIKZHEADER = '\\begin{tikzpicture}\n';
var TIKZEND = '\\end{tikzpicture}';

function escapeCharacter(token) {
  switch (token)  {
    case 'ε':
      return '\\epsilon';
  }
  return token;
}

function format() {
  var args = arguments;
  return args[0].replace(/{(\d+)}/g, function(match, number) {
    return typeof args[number + 1] != 'undefined'
      ? args[number + 1]
      : match
    ;
  });
};

exports.toTikz = function(fsm) {
  var transitionsTikz = '\\path[->]';
  for (var from_id in fsm.transitions) {
    for (var to_id in fsm.transitions[from_id]) {
      var label = escapeCharacter(fsm.transitions[from_id][to_id]);
      transitionsTikz += `\n(S_${from_id}) edge [bend left=30] node [above] { $${label}$ } (S_${to_id})`;
    }
  }
  transitionsTikz += ';\n';

  var statesTikz = '';
  for (var i = 0; i < fsm.numOfStates; ++i) {
    var previous = i - 1;
    if (fsm.initialState == i.toString()) {
      statesTikz += `\\node[state, initial] (S_${i}) {$S_${i}$};\n`
    } else if (fsm.acceptStates.indexOf(i.toString()) != -1) {
      statesTikz += `\\node[state, accepting] (S_${i}) [right=of S_${previous}] {$S_${i}$};\n`
    } else {
      statesTikz += `\\node[state] (S_${i}) [right=of S_${previous}] {$S_${i}$};\n`
    }
  }
  return TIKZHEADER + statesTikz + transitionsTikz + TIKZEND;
}
