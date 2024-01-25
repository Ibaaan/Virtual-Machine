let fs = require('fs');
let mem = new Array();
let inText = fs.readFileSync('program.spml');
inText = inText.toString();
mem = inText.split(/ |\r\n/);
mem.push('exit');
let ip = 0;
let loopStack = [];
let loopMap = {};
let error = 0;


function findMatchingEnd(ip) {
    let depth = 1;
    while (depth != 0 && ip < mem.length) {
        ip++;
        if (mem[ip] == 'while==') depth++;
        if (mem[ip] == 'end_of_while') depth--;
    }
    return ip;
}

for (let i = 0; i < mem.length; i++) {
    if (mem[i] == 'while==') {
        loopMap[i] = findMatchingEnd(i);
    }
}

while (mem[ip] != 'exit') {
    switch (mem[ip]) {
        case 'set':    
            mem[mem[ip + 1]] = parseInt(mem[ip + 2])
            ip += 3
            break;

        case 'output':     
            console.log(mem[mem[ip + 1]]);
            ip += 2
            break;

        case 'add':         
            mem[mem[ip + 3]] = mem[mem[ip + 1]] + mem[mem[ip + 2]]
            ip += 4
            break;

        case 'sub':        
            mem[mem[ip + 3]] = mem[mem[ip + 1]] - mem[mem[ip + 2]]
            ip += 4
            break;

        case 'mul':         
            mem[mem[ip + 3]] = mem[mem[ip + 1]] * mem[mem[ip + 2]]
            ip += 4
            break;

        case 'dif':         
            if (mem[mem[ip + 2]] != 0) {
                mem[mem[ip + 3]] = Math.floor(mem[mem[ip + 1]] / mem[mem[ip + 2]])
                ip += 4
            } else {
                mem[mem[ip + 3]] = 'NaN';
                ip += 4;
            }
            break;

        case 'difo':          
            if (mem[mem[ip + 2]] != 0) {
                mem[mem[ip + 3]] = mem[mem[ip + 1]] % mem[mem[ip + 2]];
                ip += 4;
            }
            break;

        case 'as':      
            mem[mem[ip + 1]] = mem[mem[ip + 2]]
            ip += 3
            break;

        case 'if=':         
            if (mem[mem[ip + 1]] == mem[mem[ip + 2]]) {
                ip += 3;
            } else {
                while (mem[ip] != 'els') {
                    ip++;
                }
            }
            break;

        case 'if!=':         
            if (mem[mem[ip + 1]] != mem[mem[ip + 2]]) {
                ip += 3;
            } else {
                while (mem[ip] != 'els') {
                    ip++;
                }
            }
            break;

        case 'while==': 
            if (mem[mem[ip + 1]] != mem[mem[ip + 2]]) {
                loopStack.push(ip);
            } else {
                ip = loopMap[ip] + 1;
            }
            ip += 3;
            break;

        case 'end_of_while':
            if (mem[mem[loopStack[loopStack.length - 1] + 1]] != mem[mem[loopStack[loopStack.length - 1] + 2]]) {
                ip = loopStack[loopStack.length - 1];
            } else {
                loopStack.pop();
                ip++;
            }
            break;

        case 'sqr':
            mem[mem[ip + 2]] = mem[mem[ip + 1]] ** 2;
            break;
    }

    error++;

    if (error > 10000) {
        break;
    }
}

