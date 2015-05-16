function resetTable() {
    d3.select("#bookTable").selectAll("tr").remove()
}

function updateTable(data) {
    d3.select("#bookTable").selectAll("tr")
        .data(data)
        .enter().append("tr")
        .html(function (d) {
        var str = "";
        var url = "";
        if (d.isbn && d.isbn != 'null') {
            url = "http://webpac.zju.edu.cn/F/LDK7TCKI2F1BCSB281JMD682LCUUKE9ISDAH5YQVA6BC99HBE6-29330?find_base=ZJU01&find_base=ZJU09&func=find-m&find_code=ISB&request=" + d.isbn + "&local_base=&x=19&y=14&filter_code_1=WLN&filter_request_1=&filter_code_2=WYR&filter_request_2=&filter_code_3=WYR&filter_request_3=&filter_code_4=WFM&filter_request_4=&filter_code_5=WSL&filter_request_5=";
        }
        else {
            d.isbn = '';
        }

        if (d.auther == 'null') {
            d.auther = '';
        }

        if (d.imprint == 'null') {
            d.imprint = '';
        }

        //        str += '<td><a href="'+url+'" target="iframe0">' + d.title + "</a></td>";
        str += '<td><a href="' + url + '" target="_blank">' + d.title + "</a></td>";
        str += "<td>" + d.author + "</td>";
        str += "<td>" + d.imprint + "</td>";
        str += "<td>" + d.isbn + "</td>";
        return str;
    });
}


