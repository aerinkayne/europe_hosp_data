const w = 800;
const h = 600;
const padding = 50;


function getData() {
    try { 

        const allData = euroData.map(element=>{
            return {
                country: element.country,
                date: element.date,
                value: element.value
            } 
        });
        
        let country;
        let minDate = new Date();
        let maxDate = new Date();
        let maxVal = 0;
        let arr = [];
        let arrCountries = [];
        let colorHue = 0;
        allData.forEach((element, index)=>{
            //find min max values for scaling functions
            let checkDate = new Date(element.date);
            let checkVal = element.value;
            if (checkDate < minDate){
                minDate = checkDate;
            }
            if (checkDate > maxDate){
                maxDate = checkDate;
            }
            if (checkVal > maxVal){
                maxVal = checkVal;
            }

            //update country array
            if (country == element.country && element.date) {
                arr.push(element);
            }
            if (country != element.country || index == allData.length-1)  {
                //country val starts as '', so checks if any elements have been added
                if (arr.length){
                    arrCountries.push(arr);
                }  
                country = element.country;   
                arr = [];          
            }

        });
        const xScale = d3.scaleTime()
                .domain([minDate, maxDate])  
                .range([padding, w - padding]); 

        const yScale = d3.scaleLinear()
                .domain( [0, maxVal] )
                .range( [h - padding, padding] );

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);
    
        
        const svg = d3.select('.mainContent')
            .append('svg')
            .attr('width', w)
            .attr('height', h);

        arrCountries.forEach(arr => {
            svg.selectAll(`circle.${arr.country}`)    
                .data(arr)  
                .enter()
                .append('circle')
                .attr('class', d => d.country)
                .attr('r', 2)
                .attr('cx', d => Math.floor(xScale(new Date(d.date))) )
                .attr('cy', d => Math.floor(yScale(d.value)) )  //already inverted in range scaling method
                .attr('fill', `hsl(${colorHue},90%,40%)`) 
                .attr('data-country', d => d.country)
                .attr('data-date', d => d.date)
                .attr('data-occupancy', d => d.value)
                .append('title')
                .text(d=>`Country: ${d.country}\nDate: ${d.date}\nOccupancies: ${d.value}`);
                
            colorHue += 15;
        })
        
        svg.append('g')
            .attr('transform', 'translate(0, ' + (h - padding) + ')')
            .attr('id', 'x-axis')
            .call(xAxis);
        svg.append('g')
            .attr('transform', `translate(${padding},0)`)
            .attr('id', 'y-axis')
            .call(yAxis);    
        
    }
    
    catch(error){
        console.log(error);
    }
}

getData();