<<<<<<< HEAD
// CSV 파일을 불러와 히스토그램 표시
d3.csv("../data/mydata1105.csv", function(error, data){
	// SVG 요소의 넓이과 높이를 구함
	var svgEle = document.getElementById("myGraph1");
	var svgWidth = window.getComputedStyle(svgEle, null).getPropertyValue("width");
	var svgHeight = window.getComputedStyle(svgEle, null).getPropertyValue("height");
	svgWidth = parseFloat(svgWidth);	// 값에 단위가 포함되었으므로 단위를 삭제
	svgHeight = parseFloat(svgHeight);	// 값에 단위가 포함되었으므로 단위를 삭제
	var yAxisHeight = svgHeight - 30;	// 가로축의 넓이
	var xAxisWidth = svgWidth - 40;	// 세로축의 넓이
	var offsetX = 30;	// 가로 오프셋
	var offsetY = 10;	// 세로 오프셋
	var stepX = 10;	// 막대그래프의 개수. 10 간격.
	var xScale;	// 가로 스케일
	var yScale;	// 세로 스케일
	//색상
	var color = d3.scale.ordinal()	
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
	// 데이터셋 불러오기
	var dataSet = [ ];
	data.forEach(function(d, i){
		dataSet.push(d.g1);	// 1학년 데이터 입력
	})
	// 히스토그램 설정
	var histogram = d3.layout.histogram()
	  .range([0, 100])
	  .bins(d3.range(0, 100.1, stepX))	// ●범위를 계산하여 구함
	// 데이터셋으로부터 스케일 계산
	function calcScale(){
		// 데이터셋으로부터 최댓값을 구함
		var maxValue = d3.max(histogram(dataSet), function(d, i){
				return d.y;	// 데이터 자체가 아닌 최대 횟수를 반환
			})
		// 세로 스케일 설정
		yScale = d3.scale.linear()
		  .domain([0, maxValue])
		  .range([yAxisHeight, 0])
		// 가로 스케일을 설정
		xScale = d3.scale.linear()
		  .domain([0, 100])
		  .range([0, xAxisWidth ])
	}
	// 눈금 표시
	function drawScale(){
		// 세로 눈금 표시
		d3.select("#myGraph1")	// SVG 요소 지정
			  .append("g")	// g요소를 추가. 이것이 눈금을 표시하는 요소가 됨
			  .attr("class", "axis")	// CSS 클래스 지정
			  .attr("transform", "translate("+offsetX+", "+offsetY+")")
			  .call(
					d3.svg.axis()
				  .scale(yScale)  // 스케일 적용
				  .orient("left") //눈금의 표시 위치를 왼쪽으로 지정
				)
		// 가로 눈금 표시
		d3.select("#myGraph1")	// SVG 요소 지정
			  .append("g")	// g요소를 추가. 이것이 눈금을 표시하는 요소가 됨
			  .attr("class", "axis")	// CSS 클래스 지정
			  .attr("transform", "translate("+offsetX+", "+(yAxisHeight + offsetY)+")")
			  .call(
					d3.svg.axis()
				  .scale(xScale)  // 스케일 적용
				  .orient("bottom") // 눈금의 표시 위치를 아래쪽으로 지정
				)
	}
	// 히스토그램 요소 설정
	function drawHistgram(){
		var barElements = d3.select("#myGraph1")
		  .selectAll("rect")	// rect 요소로 히스토그램 표시
		  .data(histogram(dataSet))	// 데이터를 대응시킴
		  .enter()
		  .append("rect")	// rect 요소를 추가
		  .attr("class", "bar")	// CSS 클래스 추가
		  .attr("width", function(d, i){	// 넓이 설정
				return xScale(d.dx);
			})
		  .attr("x", function(d, i){	// X 좌표 설정
				return i * xScale(d.dx) + offsetX;
			})
		  .attr("y", function(d, i){	// Y 좌표 설정
				return yScale(d.y) + offsetY;
			})
		  .attr("y", yAxisHeight + offsetY)
		  .attr("height", 0)
		  .transition()
		  .duration(1000)
		  .attr("y", function(d, i){	// Y 좌표 설정
				return yScale(d.y) + offsetY;
			})
		  .attr("height", function(d, i){	// 높이 설정
				return yAxisHeight - yScale(d.y);
			})
			.style("fill", function(d, i) {return color(d.data.x)});
	}
	// 간격이 변경되면 히스토그램을 갱신
	d3.select("#step").on("change", function(){
		stepX = this.value; 
		histogram
		  .bins(d3.range(0, 100.1, stepX))
		// 히스토그램 다시 그리기
		d3.select("#myGraph1").selectAll("*").remove();	// 요소 삭제
		calcScale();
		drawHistgram();
		drawScale();
	})
	// 최초의 히스토그램 표시 처리
	calcScale();
	drawHistgram();
	drawScale();
	// 이벤트 설정
	d3.select("#dataSelect").selectAll("input[type='button']")
	  .on("click", function(){
			var grader = d3.select(this).attr("data-grader");	// 학년 데이터 (g1〜g6)
			// 데이터 설정
			dataSet = [ ];
			data.forEach(function(d, i){
				dataSet.push(d[grader]);	// 클릭한 학년의 데이터를 입력
			})
			// 히스토그램 갱신
			d3.select("#myGraph1").selectAll("*").remove();	// 요소 삭제
			calcScale();
			drawHistgram();
			drawScale();
		});
})

=======
// CSV 파일을 불러와 히스토그램 표시
d3.csv("../data/mydata1105.csv", function(error, data){
	// SVG 요소의 넓이과 높이를 구함
	var svgEle = document.getElementById("myGraph1");
	var svgWidth = window.getComputedStyle(svgEle, null).getPropertyValue("width");
	var svgHeight = window.getComputedStyle(svgEle, null).getPropertyValue("height");
	svgWidth = parseFloat(svgWidth);	// 값에 단위가 포함되었으므로 단위를 삭제
	svgHeight = parseFloat(svgHeight);	// 값에 단위가 포함되었으므로 단위를 삭제
	var yAxisHeight = svgHeight - 30;	// 가로축의 넓이
	var xAxisWidth = svgWidth - 40;	// 세로축의 넓이
	var offsetX = 30;	// 가로 오프셋
	var offsetY = 10;	// 세로 오프셋
	var stepX = 10;	// 막대그래프의 개수. 10 간격.
	var xScale;	// 가로 스케일
	var yScale;	// 세로 스케일
	//색상
	var color = d3.scale.ordinal()	
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
	// 데이터셋 불러오기
	var dataSet = [ ];
	data.forEach(function(d, i){
		dataSet.push(d.g1);	// 1학년 데이터 입력
	})
	// 히스토그램 설정
	var histogram = d3.layout.histogram()
	  .range([0, 100])
	  .bins(d3.range(0, 100.1, stepX))	// ●범위를 계산하여 구함
	// 데이터셋으로부터 스케일 계산
	function calcScale(){
		// 데이터셋으로부터 최댓값을 구함
		var maxValue = d3.max(histogram(dataSet), function(d, i){
				return d.y;	// 데이터 자체가 아닌 최대 횟수를 반환
			})
		// 세로 스케일 설정
		yScale = d3.scale.linear()
		  .domain([0, maxValue])
		  .range([yAxisHeight, 0])
		// 가로 스케일을 설정
		xScale = d3.scale.linear()
		  .domain([0, 100])
		  .range([0, xAxisWidth ])
	}
	// 눈금 표시
	function drawScale(){
		// 세로 눈금 표시
		d3.select("#myGraph1")	// SVG 요소 지정
			  .append("g")	// g요소를 추가. 이것이 눈금을 표시하는 요소가 됨
			  .attr("class", "axis")	// CSS 클래스 지정
			  .attr("transform", "translate("+offsetX+", "+offsetY+")")
			  .call(
					d3.svg.axis()
				  .scale(yScale)  // 스케일 적용
				  .orient("left") //눈금의 표시 위치를 왼쪽으로 지정
				)
		// 가로 눈금 표시
		d3.select("#myGraph1")	// SVG 요소 지정
			  .append("g")	// g요소를 추가. 이것이 눈금을 표시하는 요소가 됨
			  .attr("class", "axis")	// CSS 클래스 지정
			  .attr("transform", "translate("+offsetX+", "+(yAxisHeight + offsetY)+")")
			  .call(
					d3.svg.axis()
				  .scale(xScale)  // 스케일 적용
				  .orient("bottom") // 눈금의 표시 위치를 아래쪽으로 지정
				)
	}
	// 히스토그램 요소 설정
	function drawHistgram(){
		var barElements = d3.select("#myGraph1")
		  .selectAll("rect")	// rect 요소로 히스토그램 표시
		  .data(histogram(dataSet))	// 데이터를 대응시킴
		  .enter()
		  .append("rect")	// rect 요소를 추가
		  .attr("class", "bar")	// CSS 클래스 추가
		  .attr("width", function(d, i){	// 넓이 설정
				return xScale(d.dx);
			})
		  .attr("x", function(d, i){	// X 좌표 설정
				return i * xScale(d.dx) + offsetX;
			})
		  .attr("y", function(d, i){	// Y 좌표 설정
				return yScale(d.y) + offsetY;
			})
		  .attr("y", yAxisHeight + offsetY)
		  .attr("height", 0)
		  .transition()
		  .duration(1000)
		  .attr("y", function(d, i){	// Y 좌표 설정
				return yScale(d.y) + offsetY;
			})
		  .attr("height", function(d, i){	// 높이 설정
				return yAxisHeight - yScale(d.y);
			})
			.style("fill", function(d, i) {return color(d.data.x)});
	}
	// 간격이 변경되면 히스토그램을 갱신
	d3.select("#step").on("change", function(){
		stepX = this.value; 
		histogram
		  .bins(d3.range(0, 100.1, stepX))
		// 히스토그램 다시 그리기
		d3.select("#myGraph1").selectAll("*").remove();	// 요소 삭제
		calcScale();
		drawHistgram();
		drawScale();
	})
	// 최초의 히스토그램 표시 처리
	calcScale();
	drawHistgram();
	drawScale();
	// 이벤트 설정
	d3.select("#dataSelect").selectAll("input[type='button']")
	  .on("click", function(){
			var grader = d3.select(this).attr("data-grader");	// 학년 데이터 (g1〜g6)
			// 데이터 설정
			dataSet = [ ];
			data.forEach(function(d, i){
				dataSet.push(d[grader]);	// 클릭한 학년의 데이터를 입력
			})
			// 히스토그램 갱신
			d3.select("#myGraph1").selectAll("*").remove();	// 요소 삭제
			calcScale();
			drawHistgram();
			drawScale();
		});
})

>>>>>>> 098f034d171c07a931c452de701643f03ab412d2
