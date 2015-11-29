function drawChart(chartData) {
    var data = google.visualization.arrayToDataTable([
        ['Task', 'Cucumber Results'],
        ['Passed', chartData.passed],
        ['Failed', chartData.failed],
        ['Pending', chartData.notdefined],
        ['Skipped', chartData.skipped]
    ]);

    var options = {
        width: 500,
        height: 270,
        title: chartData.title,
        is3D: true,
        colors: ['#5cb85c', '#d9534f', '#5bc0de', '#f0ad4e'],
        fontSize: '13',
        fontName: '"Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif',
        slices: {
            1: {offset: 0.1},
            2: {offset: 0.2},
            3: {offset: 0.3},
        },
        titleTextStyle: {
            fontSize: '13',
            color: '#5e5e5e'
        }
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart_' + chartData.title.toLowerCase()));
    chart.draw(data, options);
}