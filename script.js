const margin = {top: 100, right: 40, bottom: 100, left: 100};
const width = 1400 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;
const formatDate = d3.timeFormat("%m/%d/%Y");
let state = 'revenue';
let dataset = [];

let Tooltip =d3.select("body").append("div")	
	.attr("class", "tooltip")				
	.style("opacity", 0);

main();

function main(){
	createStateButton();
	update();
}

function update(){
	console.log(state);
	if(state === 'average'){
		removeSVG();
		const svg = d3.select("#lineChart").append("svg").attr('width', width).attr('height', height + margin.top + margin.bottom)
					.append("g").attr('transform', `translate(${margin.left},${margin.right})`);
		
		createOptionalButton();

		const line = d3.line()
			.x(d => xScale(d.date))
			.y(d => yScale(d.value));

		const xScale = d3.scaleTime().range([0, width - 160]);
		const yScale = d3.scaleLinear().range([height, 0]);

		d3.csv('apple.csv', d3.rowConverter, function(error, data){
			if(error){
				console.log(error);
			} else {
				for(let i = 0; i < 20; i++){
					dataset.push({date: new Date(data[i].Date),value: parseFloat(data[i].Average)});
				}
		
				console.log(dataset);
		
				xScale.domain(d3.extent(dataset, d => d.date));
				yScale.domain([d3.min(dataset, d => d.value), d3.max(dataset, d => d.value)]);
		
				svg.append('g')
					.attr('transform', `translate(0,${height})`)
					.attr("class", "xAxis")
				.call(d3.axisBottom(xScale)
					.ticks(d3.timeDay.every(dataset.length/3))
					.tickFormat(formatDate));
		
				svg.append('g')
					.attr('class', "yAxis")
					.call(d3.axisLeft(yScale));
		
				svg.append("path")
					.datum(dataset)
					.attr("fill", "none")
					.attr("stroke", 'steelblue')
					.attr("stroke-width", 2)
					.attr("d", line);
		
				svg.selectAll("circle")
					.data(dataset)
					.enter()
					.append("circle")
					.attr('cx', function(d){return xScale(d.date)})
					.attr('cy', function(d){return yScale(d.value)})
					.attr('r', 3)
					.attr('fill', 'red')
					.on('mouseover', mouseover)
					.on('mousemove', mousemove)
					.on('mouseleave', mouseleave);
		
				svg.append("text")
					.attr("class", "xLabel")
					.text("TimeLine")
					.attr('x', (width / 2) - 70)
					.attr('y', height + margin.top+10);
		
				svg.append("text")
					.attr("class", "yLabel")
					.text("Average Price")
					.attr('y', -50)
					.attr('x', -300);
		
				const addButton = document.querySelector('.add');
				addButton.addEventListener('click', function(){
					dataset.push({date: new Date(data[dataset.length].Date), value: data[dataset.length].Average});
					console.log(dataset);
		
					xScale.domain(d3.extent(dataset, d => d.date));
					yScale.domain([d3.min(dataset, d => d.value), d3.max(dataset, d => d.value)]);
					
					svg.selectAll("path")
						.datum(dataset)
						.transition()
						.attr("fill", "none")
						.attr("stroke", 'steelblue')
						.attr("stroke-width", 2)
						.attr("d", line);
		
					svg.selectAll("circle")
						.data(dataset)
						.enter()
						.append("circle")
							.on('mouseover', mouseover)
							.on('mousemove', mousemove)
							.on('mouseleave', mouseleave)
						.merge(svg.selectAll('circle'))
							.transition()
							.attr('cx', function(d){return xScale(d.date)})
							.attr('cy', function(d){return yScale(d.value)})
							.attr('r', 2)
							.attr('fill', 'red');
		
					svg.select(".xAxis")
						.transition()
						.call(d3.axisBottom(xScale));
					svg.select(".yAxis")
						.transition()
						.call(d3.axisLeft(yScale));
						
				})
		
				const removeButton = document.querySelector('.remove');
				removeButton.addEventListener('click', function(){
					dataset.pop();
					console.log(dataset);
		
					xScale.domain(d3.extent(dataset, d => d.date));
					yScale.domain([d3.min(dataset, d => d.value), d3.max(dataset, d => d.value)]);
					
					svg.selectAll("path")
						.datum(dataset)
						.transition()
						.attr("fill", "none")
						.attr("stroke", 'steelblue')
						.attr("stroke-width", 2)
						.attr("d", line);
		
					svg.selectAll("circle")
						.data(dataset)
						.enter()
						.append("circle")
							.merge(svg.selectAll('circle'))
							.transition()
							.attr('cx', function(d){return xScale(d.date)})
							.attr('cy', function(d){return yScale(d.value)})
							.attr('r', 3)
							.attr('fill', 'red')
		
					svg.selectAll('circle').data(dataset).exit().remove();
		
					svg.select(".xAxis")
						.transition()
						.call(d3.axisBottom(xScale));
					svg.select(".yAxis")
						.transition()
						.call(d3.axisLeft(yScale));
				})
			}
		})
	} else if(state === 'highlow'){
		removeSVG();
		const svg = d3.select("#lineChart").append("svg").attr('width', width).attr('height', height + margin.top + margin.bottom)
					.append("g").attr('transform', `translate(${margin.left},${margin.right})`);
		
		createOptionalButton();

		const xScale = d3.scaleTime().range([0, width - 160]);
		const yScale = d3.scaleLinear().range([height, 0]);

		const highline = d3.line()
					.x(d => xScale(d.date))
					.y(d => yScale(d.high));

		const lowline = d3.line()
					.x(d => xScale(d.date))
					.y(d => yScale(d.low));

		d3.csv('apple.csv', d3.rowConverter, function(error, data){
			if(error){
				console.log(error);
			} else {
				for(let i = 0; i < data.length; i++){
					dataset.push({date: new Date(data[i].Date),high: parseFloat(data[i].High), low: parseFloat(data[i].Low)});
				}

				console.log(dataset);

				xScale.domain(d3.extent(dataset, d => d.date));
				yScale.domain([d3.min(dataset, d => d.low), d3.max(dataset, d => d.high)]);

				svg.append('g')
					.attr('transform', `translate(0,${height})`)
					.attr("class", "xAxis")
				.call(d3.axisBottom(xScale)
					.ticks(d3.timeMonth.every(1))
					.tickFormat(formatDate));
		
				svg.append('g')
					.attr('class', "yAxis")
					.call(d3.axisLeft(yScale));
		
				svg.append("path")
					.attr("class", "pathHigh")
					.datum(dataset)
					.attr("fill", "none")
					.attr("stroke", 'blue')
					.attr("stroke-width", 2)
					.attr("d", highline);

				svg.append("path")
					.attr("class", "pathLow")
					.datum(dataset)
					.attr("fill", "none")
					.attr("stroke", 'orange')
					.attr("stroke-width", 2)
					.attr("d", lowline);
		
				svg.selectAll("circleHigh")
					.data(dataset)
					.enter()
					.append("circle")
					.attr('cx', function(d){return xScale(d.date)})
					.attr('cy', function(d){return yScale(d.high)})
					.attr('r', 3)
					.attr('fill', 'grey')
					.on('mouseover', mouseover)
					.on('mousemove', function(d){
						Tooltip
							.html(formatDate(d.date) + ' Value: ' + d.high)
							.style("left",(d3.event.pageX - 65) + "px")
							.style("top", (d3.event.pageY - 60) + "px");
					})
					.on('mouseleave', mouseleave);

				svg.selectAll("circleLow")
					.data(dataset)
					.enter()
					.append("circle")
					.attr('cx', function(d){return xScale(d.date)})
					.attr('cy', function(d){return yScale(d.low)})
					.attr('r', 3)
					.attr('fill', 'grey')
					.on('mouseover', mouseover)
					.on('mousemove', function(d){
						Tooltip
							.html(formatDate(d.date) + ' Value: ' + d.low)
							.style("left",(d3.event.pageX - 65) + "px")
							.style("top", (d3.event.pageY - 60) + "px");
					})
					.on('mouseleave', mouseleave);
		
				svg.append("text")
					.attr("class", "xLabel")
					.text("TimeLine")
					.attr('x', (width / 2) - 70)
					.attr('y', height + margin.top+ 10);
		
				svg.append("text")
					.attr("class", "yLabel")
					.text("Price")
					.attr('y', -50)
					.attr('x', -300);
			}
		})
	} else {
		removeSVG();
		
		const w = 1400, h = 600, leftPadding = 40, textPadding = 10, xLabelPadding = 54, size = 15;
		const svg = d3.select("#lineChart").append('svg').attr('width', w).attr('height',h);

		const xScale = d3.scaleLinear().range([20, w - 300]);
		const yScale = d3.scaleBand().rangeRound([h - 55, 0]);

		createOptionalButton();
	
		d3.csv('appleRenevue.csv', d3.rowConverter, function(error, data){
			if(error){
				console.log(error);
			} else {
				let count = 0;
				for(let i = 0; count < 20; i++){
					if(parseFloat(data[i].price) !== 0){
						dataset.push(data[i]);
						count++;
					}
				}

				console.log(dataset);

				let rect = svg.selectAll('rect').data(dataset).enter().append('rect');
				let text = svg.selectAll('text').data(dataset).enter().append('text');
				let xLabel = svg.selectAll('xLabel').data(dataset).enter().append('text');
				let yLabel = svg.selectAll('yLabel').data(dataset).enter().append('text');

				xScale.domain([0, d3.max(dataset, d => d.price)]);
				yScale.domain(d3.range(dataset.length)).paddingInner(0.05);

				const colorScale = d3.scaleLinear().range(["yellow","red"]).domain([d3.min(dataset, d => d.price), d3.max(dataset, d => d.price)]);
				
				rect.attr('x', leftPadding)
				.attr('y', function(data, iteration){
					return yScale(iteration);
				}).attr('width', function(d){
					return xScale(parseFloat(d.price));
				}).attr('height',size)
				.attr('fill', function(d){
					return colorScale(parseFloat(d.price));
				})

				text.text(function(data){
					return data['track_name'];
				}).attr('x', function(data){
					return xScale(parseFloat(data['price'])) + leftPadding + textPadding;
				}).attr('y', function(data, iteration){
					return yScale(iteration) + textPadding + 5;
				})

				svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(" + 20 + "," + (h-xLabelPadding) + ")")
				.call(xAxis = d3.axisBottom().scale(xScale));

				xLabel.text("Price")
				.attr("x", w/3)
				.attr("y", h)

				yLabel.text('Product Name')
				.attr('x', -h/1.5)
				.attr('y', -3)
				.attr("dy", "1em")
				.attr('transform', 'rotate(-90)')
				;


				const addButton = document.querySelector(".add");
				const removeButton = document.querySelector(".remove");

				addButton.addEventListener('click', function(){
					dataset.push(data[dataset.length]);

					xScale.domain([0, d3.max(dataset, d => d.price)]);
					yScale.domain(d3.range(dataset.length)).paddingInner(0.05);

					svg.selectAll('rect').data(dataset)
					.enter()
					.append('rect')
					.merge(svg.selectAll('rect'))
					.transition()
					.attr('x', leftPadding)
					.attr('y', function(data, iteration){
						return yScale(iteration);
					}).attr('width', function(d){
						return xScale(parseFloat(d.price));
					}).attr('height', size)
					.attr('fill', function(d){
						return colorScale(parseFloat(d.price));
					})

					svg.selectAll('text').data(dataset)
					.enter()
					.append('text')
					.merge(svg.selectAll('text'))
					.transition()
					.text(function(data){
						return data['track_name'];
					}).attr('x', function(data){
						return xScale(parseFloat(data['price'])) + leftPadding + textPadding;
					}).attr('y', function(data, iteration){
						return yScale(iteration) + textPadding + 5;
					})
				})

				removeButton.addEventListener('click',function(){
					dataset.pop();

					svg.selectAll('rect').data(dataset).exit().remove().transition();
					svg.selectAll('text').data(dataset).merge(xLabel, yLabel).exit().remove().transition();

					xScale.domain([0, d3.max(dataset, d => d.price)]);
					yScale.domain(d3.range(dataset.length)).paddingInner(0.05);

					svg.selectAll('rect').data(dataset)
					.enter()
					.append('rect')
					.merge(svg.selectAll('rect'))
					.transition()
					.attr('x', leftPadding)
					.attr('y', function(data, iteration){
						return yScale(iteration);
					}).attr('width', function(d){
						return xScale(parseFloat(d.price));
					}).attr('height', size)
					.attr('fill', function(d){
						return colorScale(parseFloat(d.price));
					})

					svg.selectAll('text').data(dataset)
					.enter()
					.append('text')
					.merge(svg.selectAll('text'))
					.transition()
					.text(function(data){
						return data['track_name'];
					}).attr('x', function(data){
						return xScale(parseFloat(data['price'])) + leftPadding + textPadding;
					}).attr('y', function(data, iteration){
						return yScale(iteration) + textPadding + 5;
					})

					svg.select(".xAxis")
						.transition()
						.call(d3.axisBottom(xScale));
					svg.select(".yAxis")
						.transition()
						.call(d3.axisLeft(yScale));
				})
			}
		})
	}
}

function removeSVG(){
	dataset = [];
	d3.selectAll("svg").selectAll("*").remove();
	document.querySelector("#lineChart").remove();
	const div = document.createElement('div');
	div.id = 'lineChart';
	document.querySelector("body").appendChild(div);
}

function createStateButton(){
	const div = document.querySelector('.button');

	const averageButton = document.createElement('button');
	averageButton.textContent ='Average';
	averageButton.classList.add('averageButton');
	averageButton.addEventListener('click', function(){state = 'average'; update();});

	const highLowButton = document.createElement('button');
	highLowButton.textContent ='High Low Price';
	highLowButton.classList.add('highlowButton');
	highLowButton.addEventListener('click', function(){state = 'highlow'; update();});

	const revenueButton = document.createElement('button');
	revenueButton.textContent ='Revenue';
	revenueButton.classList.add('revenueButton');
	revenueButton.addEventListener('click', function(){state = 'revenue'; update();});

	div.appendChild(averageButton);
	div.appendChild(highLowButton);
	div.appendChild(revenueButton);
}

function createOptionalButton(){
	const lineChart = document.querySelector('#lineChart');

	const optional = document.createElement('div');
	optional.classList.add("button");
	optional.setAttribute('style', 'justify-content: center;');
	
	const addButton = document.createElement('button');
	addButton.classList.add('add');
	addButton.textContent = 'Add';

	const removeButton = document.createElement('button');
	removeButton.classList.add('remove');
	removeButton.textContent = 'Remove';

	optional.appendChild(addButton);
	optional.appendChild(removeButton);
	lineChart.appendChild(optional);
}

let mouseover = function(d) {
    Tooltip
        .style("opacity", 1)
    d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
        .attr('fill', 'red');
}

let mousemove = function(d) {
    Tooltip.transition();
	if(state === "average"){
		Tooltip
			.html(formatDate(d.date) + ' Value: ' + d.value)
			.style("left",(d3.event.pageX - 65) + "px")
			.style("top", (d3.event.pageY - 60) + "px");
	}
}

let mouseleave = function(d) {
    Tooltip
        .style("opacity", 0)
    d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.8)
}