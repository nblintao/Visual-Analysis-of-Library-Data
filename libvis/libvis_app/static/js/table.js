function resetTable () {
    d3.select("#bookTable").selectAll("tr").remove()  
}

function updateTable (data) {
    d3.select("#bookTable").selectAll("tr")
        .data(data)
      .enter().append("tr")
        .html(function(d){
            str = ""
            str += "<td>"+ d.title +"</td>" 
            str += "<td>"+ d.author +"</td>" 
            str += "<td>"+ d.imprint +"</td>" 
            str += "<td>"+ d.isbn +"</td>" 
            return str;
        });    
}


