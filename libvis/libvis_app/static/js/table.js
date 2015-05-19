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
            url = "http://webpac.zju.edu.cn/F/VP3A9N82U2D5TGV9ESMUJX11I4N1GTDR7X9U9BD2XQ8B81PCLI-38819?func=find-b&find_code=ISB&request=" + d.isbn + "&local_base=ZJU01";
            //TODO This should be changed in realistic environment!
        }
        else {
            d.isbn = '';
        }

        if (!d.author || d.author == 'null') {
            d.author = '';
        }

        if (!d.imprint || d.imprint == 'null') {
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


