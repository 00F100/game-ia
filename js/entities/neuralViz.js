var NeuralViz = (function () {
    var WIDTH = 400;
    var HEIGHT = 480;
    var INPUT_LABELS = [
        'Distancia',
        'Largura',
        'Altura',
        'Solo obst.',
        'Velocidade',
        'Gravidade'
    ];
    var OUTPUT_LABELS = [
        'Continuar',
        'Pular',
        'Agachar'
    ];
    var LAYER_TITLES = [
        'Entrada',
        'Oculta',
        'Oculta',
        'Saida'
    ];

    var canvas;
    var ctx;
    var visible = false;
    var running = false;
    var target = null;
    var shownActs = null;
    var positions = null;

    function mount() {
        canvas = document.getElementById('brain');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'brain';
            document.body.appendChild(canvas);
        }
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        ctx = canvas.getContext('2d');
        hide();
        if (!running) {
            running = true;
            tick();
        }
        return api;
    }

    function show() {
        visible = true;
        if (canvas) {
            canvas.classList.add('is-on');
        }
        document.body.classList.add('ai-view');
    }

    function hide() {
        visible = false;
        target = null;
        shownActs = null;
        if (canvas) {
            canvas.classList.remove('is-on');
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
        }
        document.body.classList.remove('ai-view');
    }

    function push(state) {
        if (!state || !state.activations) {
            return;
        }
        target = state;
        if (!shownActs) {
            shownActs = cloneActs(state.activations);
        }
    }

    function cloneActs(acts) {
        var out = [];
        var i, j;
        for (i = 0; i < acts.length; i++) {
            out[i] = [];
            for (j = 0; j < acts[i].length; j++) {
                out[i][j] = acts[i][j];
            }
        }
        return out;
    }

    function lerpActs() {
        if (!target || !target.activations) {
            return;
        }
        if (!shownActs) {
            shownActs = cloneActs(target.activations);
            return;
        }
        var i, j, src, dst;
        for (i = 0; i < target.activations.length; i++) {
            src = target.activations[i];
            if (!shownActs[i]) {
                shownActs[i] = src.slice();
                continue;
            }
            dst = shownActs[i];
            for (j = 0; j < src.length; j++) {
                dst[j] += (src[j] - (dst[j] || 0)) * 0.28;
            }
        }
    }

    function layout(layers) {
        var left = 92;
        var right = WIDTH - 88;
        var top = 84;
        var bottom = HEIGHT - 28;
        var cols = [];
        var l, i, n, x, y;
        for (l = 0; l < layers.length; l++) {
            n = layers[l];
            x = layers.length === 1 ? (left + right) / 2 : left + (right - left) * (l / (layers.length - 1));
            cols[l] = [];
            for (i = 0; i < n; i++) {
                y = n === 1 ? (top + bottom) / 2 : top + (bottom - top) * (i / (n - 1));
                cols[l].push({ x: x, y: y });
            }
        }
        return cols;
    }

    function fmt(n) {
        if (typeof n !== 'number' || !isFinite(n)) {
            return '0.00';
        }
        var s = n.toFixed(2);
        if (s === '-0.00') {
            return '0.00';
        }
        return s;
    }

    function glow(value) {
        var a = Math.abs(value);
        return a / (1 + a);
    }

    function winningPath(weights, activations, action) {
        var edgeOn = {};
        var nodeOn = {};
        if (!weights || !activations || action == null || action < 0) {
            return { edgeOn: edgeOn, nodeOn: nodeOn };
        }
        var last = activations.length - 1;
        nodeOn[last + ',' + action] = true;
        var l, j, i, row, contrib, maxC, thresh;
        for (l = weights.length - 1; l >= 0; l--) {
            for (j = 0; j < weights[l].length; j++) {
                if (!nodeOn[(l + 1) + ',' + j]) {
                    continue;
                }
                row = weights[l][j];
                maxC = -Infinity;
                for (i = 0; i < row.length; i++) {
                    contrib = row[i] * ((activations[l] && activations[l][i]) || 0);
                    if (contrib > maxC) {
                        maxC = contrib;
                    }
                }
                thresh = maxC > 0 ? maxC * 0.4 : maxC;
                for (i = 0; i < row.length; i++) {
                    contrib = row[i] * ((activations[l] && activations[l][i]) || 0);
                    if (contrib >= thresh && (maxC <= 0 || contrib > 0)) {
                        edgeOn[l + ',' + i + '-' + j] = true;
                        nodeOn[l + ',' + i] = true;
                    }
                }
            }
        }
        return { edgeOn: edgeOn, nodeOn: nodeOn };
    }

    function drawEdge(from, to, active) {
        ctx.beginPath();
        if (active) {
            ctx.strokeStyle = '#d6d6d6';
            ctx.lineWidth = 2;
        } else {
            ctx.strokeStyle = '#3d3d3d';
            ctx.lineWidth = 1;
        }
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
    }

    function mainIncomingWeight(weights, activations, layerIndex, neuronIndex, path) {
        if (!weights || layerIndex <= 0 || !weights[layerIndex - 1]) {
            return 0;
        }
        var row = weights[layerIndex - 1][neuronIndex];
        if (!row) {
            return 0;
        }
        var bestW = row[0] || 0;
        var bestScore = -Infinity;
        var i, on, score, src;
        for (i = 0; i < row.length; i++) {
            on = path && path.edgeOn[(layerIndex - 1) + ',' + i + '-' + neuronIndex];
            src = activations && activations[layerIndex - 1] ? Math.abs(activations[layerIndex - 1][i] || 0) : 0;
            score = (on ? 1000 : 0) + Math.abs(row[i]) * (0.2 + src);
            if (score > bestScore) {
                bestScore = score;
                bestW = row[i];
            }
        }
        return bestW;
    }

    function draw() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = '#16110d';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        ctx.fillStyle = '#ffe2b7';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('REDE DO MELHOR', WIDTH / 2, 22);

        ctx.font = '11px monospace';
        ctx.fillStyle = '#c9b08a';
        var gen = target && target.generation ? target.generation : (game && game.ia ? game.ia.generation : 1);
        var fit = target && target.fitness ? Math.round(target.fitness) : 0;
        ctx.fillText('Geracao ' + gen + '   fitness ' + fit, WIDTH / 2, 40);

        var layers = (target && target.layers) || [6, 8, 8, 3];
        positions = layout(layers);
        var acts = shownActs;
        var weights = target && target.weights;
        var action = target && typeof target.action === 'number' ? target.action : -1;
        var path = winningPath(weights, target && target.activations, action);
        var l, i, j, from, to, x, y, r, val, g;

        if (weights) {
            for (l = 0; l < weights.length; l++) {
                for (j = 0; j < weights[l].length; j++) {
                    to = positions[l + 1] && positions[l + 1][j];
                    if (!to) {
                        continue;
                    }
                    for (i = 0; i < weights[l][j].length; i++) {
                        from = positions[l] && positions[l][i];
                        if (!from) {
                            continue;
                        }
                        if (!path.edgeOn[l + ',' + i + '-' + j]) {
                            drawEdge(from, to, false);
                        }
                    }
                }
            }
            for (l = 0; l < weights.length; l++) {
                for (j = 0; j < weights[l].length; j++) {
                    to = positions[l + 1] && positions[l + 1][j];
                    if (!to) {
                        continue;
                    }
                    for (i = 0; i < weights[l][j].length; i++) {
                        from = positions[l] && positions[l][i];
                        if (!from) {
                            continue;
                        }
                        if (path.edgeOn[l + ',' + i + '-' + j]) {
                            drawEdge(from, to, true);
                        }
                    }
                }
            }
        }

        ctx.textAlign = 'center';
        ctx.font = '10px monospace';
        ctx.fillStyle = '#8a7a66';
        for (l = 0; l < positions.length; l++) {
            if (positions[l][0]) {
                ctx.fillText(LAYER_TITLES[l] || '', positions[l][0].x, 58);
            }
        }

        for (l = 0; l < positions.length; l++) {
            for (i = 0; i < positions[l].length; i++) {
                x = positions[l][i].x;
                y = positions[l][i].y;
                val = acts && acts[l] ? acts[l][i] : 0;
                g = glow(val);
                r = l === 0 || l === positions.length - 1 ? 10 : 11;
                if (l === positions.length - 1 && i === action) {
                    ctx.beginPath();
                    ctx.strokeStyle = '#e8e8e8';
                    ctx.lineWidth = 2.5;
                    ctx.arc(x, y, r + 4, 0, Math.PI * 2);
                    ctx.stroke();
                }
                ctx.beginPath();
                ctx.fillStyle = path.nodeOn[l + ',' + i]
                    ? 'rgba(220, 220, 220,' + (0.25 + g * 0.7) + ')'
                    : 'rgba(90, 90, 90,' + (0.25 + g * 0.45) + ')';
                ctx.strokeStyle = path.nodeOn[l + ',' + i] ? '#d6d6d6' : '#5a5a5a';
                ctx.lineWidth = 1.2;
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#f2f2f2';
                ctx.font = '9px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                if (l === 0) {
                    ctx.fillText(fmt(val), x, y);
                } else {
                    ctx.fillText(fmt(mainIncomingWeight(weights, acts, l, i, path)), x, y);
                }
            }
        }

        ctx.textBaseline = 'middle';
        if (positions[0]) {
            ctx.textAlign = 'right';
            ctx.font = '10px monospace';
            for (i = 0; i < positions[0].length; i++) {
                ctx.fillStyle = '#cfcfcf';
                ctx.fillText(INPUT_LABELS[i] || ('in' + i), positions[0][i].x - 16, positions[0][i].y);
            }
        }
        var last = positions[positions.length - 1];
        if (last) {
            ctx.textAlign = 'left';
            for (i = 0; i < last.length; i++) {
                ctx.fillStyle = i === action ? '#f2f2f2' : '#9a9a9a';
                ctx.font = i === action ? 'bold 11px monospace' : '10px monospace';
                ctx.fillText(OUTPUT_LABELS[i] || ('out' + i), last[i].x + 16, last[i].y);
            }
        }
        ctx.textBaseline = 'alphabetic';
    }

    function tick() {
        if (visible) {
            lerpActs();
            draw();
        }
        requestAnimationFrame(tick);
    }

    var api = {
        mount: mount,
        show: show,
        hide: hide,
        push: push
    };
    return api;
}());
