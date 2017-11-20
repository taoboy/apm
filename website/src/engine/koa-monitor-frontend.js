var socket = io(location.protocol + '//' + location.hostname + ':' + location.port)
/* global Chart, location, io */
var defaultSpan = 1
var spans = []

var defaultDataset = {
    label: '',
    data: [],
    lineTension: 0.2,
    pointRadius: 0
}

var defaultOptions = {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }],
        xAxes: [{
            type: 'time',
            time: {
                round: true,
                unitStepSize: 30
            },
            gridLines: {
                display: false
            }
        }]
    },
    tooltips: {
        enabled: false
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: false
}

var createChart = function (ctx, dataset) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: dataset
        },
        options: defaultOptions
    })
}

var addTimestamp = function (point) {
    return point.timestamp
}

var cpuDataset = [Object.create(defaultDataset)]
var memDataset = [Object.create(defaultDataset)]
var loadDataset = [Object.create(defaultDataset)]
var responseTimeDataset = [Object.create(defaultDataset)]
var rpsDataset = [Object.create(defaultDataset)]


export function startMonite(nodeId) {

    spans = [];
    socket.removeAllListeners();

    var cpuStat = document.getElementById('cpuStat')
    var memStat = document.getElementById('memStat')
    var loadStat = document.getElementById('loadStat')
    var responseTimeStat = document.getElementById('responseTimeStat')
    var rpsStat = document.getElementById('rpsStat')

    var cpuChartCtx = document.getElementById('cpuChart')
    var memChartCtx = document.getElementById('memChart')
    var loadChartCtx = document.getElementById('loadChart')
    var responseTimeChartCtx = document.getElementById('responseTimeChart')
    var rpsChartCtx = document.getElementById('rpsChart')

    var cpuChart = createChart(cpuChartCtx, cpuDataset)
    var memChart = createChart(memChartCtx, memDataset)
    var loadChart = createChart(loadChartCtx, loadDataset)
    var responseTimeChart = createChart(responseTimeChartCtx, responseTimeDataset)
    var rpsChart = createChart(rpsChartCtx, rpsDataset)

    var charts = [cpuChart, memChart, loadChart, responseTimeChart, rpsChart]

    cpuStat.textContent = 0 + '%'
    cpuChart.data.datasets[0].data = []
    cpuChart.data.labels = [new Date().getTime()-1000]

    memStat.textContent = 0 + 'MB'
    memChart.data.datasets[0].data = []
    memChart.data.labels = [new Date().getTime()-1000]

    loadStat.textContent = 0
    loadChart.data.datasets[0].data = []
    loadChart.data.labels = [new Date().getTime()-1000]

    responseTimeStat.textContent = 0 + 'ms'
    responseTimeChart.data.datasets[0].data = []
    responseTimeChart.data.labels = [new Date().getTime()-1000]

    rpsStat.textContent = 0
    rpsChart.data.datasets[0].data = [];
    rpsChart.data.labels = [new Date().getTime()-1000]

    charts.forEach(function (chart) {
        chart.update()
    })

    var onSpanChange = function (e) {
        e.target.classList.add('active')
        defaultSpan = parseInt(e.target.id)

        var otherSpans = document.getElementsByTagName('span')
        for (var i = 0; i < otherSpans.length; i++) {
            if (otherSpans[i] !== e.target) otherSpans[i].classList.remove('active')
        }

        socket.emit('change')
    }

    socket.on('start', function (data) {
        // Remove last element of Array because it contains malformed responses data.
        // To keep consistency we also remove os data.
        //data[defaultSpan].responses.pop()
        //data[defaultSpan].os.pop()

        var spanControls = document.getElementById('span-controls');
        var childs = spanControls.childNodes;
        for(var i = childs.length - 1; i >= 0; i--) {
            spanControls.removeChild(childs[i]);
        }
        if (data && data.length !== spans.length) {
            data.forEach(function (span) {
                if(!span){
                    spans.push(null)
                } else {
                    spans.push({
                        retention: span.retention,
                        interval: span.interval
                    })
                }
            })
            document.getElementsByTagName('span')[0].classList.add('active')

            socket.emit("stats");
        } else {
            alert('暂无数据');
        }
    })

    socket.on('stats', function (data) {
        if (!spans[defaultSpan])return;
        if (data && data.retention === spans[defaultSpan].retention && data.interval === spans[defaultSpan].interval) {

            cpuStat.textContent = data.os.cpu.toFixed(1) + '%'
            cpuChart.data.datasets[0].data.push(data.os.cpu)
            cpuChart.data.labels.push(data.os.timestamp)

            memStat.textContent = data.os.memory.toFixed(1) + 'MB'
            memChart.data.datasets[0].data.push(data.os.memory)
            memChart.data.labels.push(data.os.timestamp)

            loadStat.textContent = data.os.load[0].toFixed(2)
            loadChart.data.datasets[0].data.push(data.os.load[0])
            loadChart.data.labels.push(data.os.timestamp)

            responseTimeStat.textContent = data.responses.mean.toFixed(2) + 'ms'
            responseTimeChart.data.datasets[0].data.push(data.responses.mean)
            responseTimeChart.data.labels.push(data.responses.timestamp)

            var deltaTime = data.responses.timestamp - rpsChart.data.labels[rpsChart.data.labels.length - 1]
            if (deltaTime > 0) {
                rpsStat.textContent = (data.responses.count / deltaTime * 1000).toFixed(2)
                rpsChart.data.datasets[0].data.push(data.responses.count / deltaTime * 1000)
                rpsChart.data.labels.push(data.responses.timestamp)
            }

            charts.forEach(function (chart) {
                if (spans[defaultSpan].retention < chart.data.labels.length) {
                    chart.data.datasets[0].data.shift()
                    chart.data.labels.shift()
                }
                chart.update()
            })
        }
    })

    socket.emit("init", nodeId);
}