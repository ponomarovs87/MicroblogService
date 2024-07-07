module.exports = (string) => {
  if (!string) {
    return null;
  }

  const operators = {
    "+": { precedence: 1, assoc: "L", fn: (a, b) => a + b },
    "-": { precedence: 1, assoc: "L", fn: (a, b) => a - b },
    "*": { precedence: 2, assoc: "L", fn: (a, b) => a * b },
    "/": { precedence: 2, assoc: "L", fn: (a, b) => a / b },
  };

  const outputQueue = [];
  const operatorStack = [];

  const tokens = string.match(/\d+|\+|\-|\*|\//g);

  if (!tokens) {
    return null;
  }

  tokens.forEach((token) => {
    if (!isNaN(token)) {
      outputQueue.push(parseFloat(token));
    } else if (operators[token]) {
      while (
        operatorStack.length &&
        operators[
          operatorStack[operatorStack.length - 1]
        ] &&
        ((operators[token].assoc === "L" &&
          operators[token].precedence <=
            operators[
              operatorStack[operatorStack.length - 1]
            ].precedence) ||
          (operators[token].assoc === "R" &&
            operators[token].precedence <
              operators[
                operatorStack[operatorStack.length - 1]
              ].precedence))
      ) {
        outputQueue.push(operatorStack.pop());
      }
      operatorStack.push(token);
    }
  });

  while (operatorStack.length) {
    outputQueue.push(operatorStack.pop());
  }

  const stack = [];
  outputQueue.forEach((token) => {
    if (typeof token === "number") {
      stack.push(token);
    } else if (operators[token]) {
      const b = stack.pop();
      const a = stack.pop();
      stack.push(operators[token].fn(a, b));
    }
  });

  return stack.length === 1 ? stack[0] : null;
};
