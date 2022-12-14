var currentData;

function refreshData() {
    //console.log(currentData);
    generatePathButtons(currentData.path);
    generateContent(currentData.content, undefined);
}

function errorResponse(rs, e) {

}

function requestData(datapath) {
    var path = JSON.stringify(datapath);
    //console.log(path)
    $.post("{% url 'dirdata' %}",
        {'requestpath': path},
        function (data) {
            currentData = data;
            refreshData();
        }
    );
}

function generateButton(name, p) {
    var x = $('<div>')
        .append($('<a>', {id: name})
            .css({'color': 'blue'})
            .addClass('pathButton')
            .text(name)
            .click(p, function (event) {
                requestData(event.data);
            })
            .hover(
                function () {
                    $(this).css({'text-decoration': 'underline', 'color': 'red'});
                }, function () {
                    $(this).css({'text-decoration': 'none', 'color': 'blue'});
                }
            )
        )
    ;
    return x;
}

function generatePathButtons(l) {
    $('#pathbar').empty();
    for (var i = 0; i < l.length; i++) {
        // append button
        var lslice = l.slice(0, i + 1);
        $('#pathbar').append($('<span>').text('/'));
        $('#pathbar').append(generateButton(l[i], lslice));
    }
}

function generateItem(key, val) {
    return $('<div>')
        .addClass('col')
        .append($('<span>')
            .text(key)
            .append($('<span>')
                .text('delete')
                .click({k: key, v: val}, function (event) {
                    alert('delete ' + event.data.v);
                })
            )
        )
        .click({k: key, v: val}, function (event) {
            if (event.data.v['type'] == 'd') {
                var lslice = currentData['path'].slice();
                lslice.push(event.data.k);
                requestData(lslice);
            } else {
                showProperties(event.data.k, event.data.v);
            }
        })
        ;
}

function generateRowItem(key, val) {
    // border box
    return $('<div>').addClass('row')
        .append($('<div>').addClass('col-lg-8 border border-primary')
            .append($('<div>').addClass('row')
                // left column
                    .append($('<div>').addClass('col display-4')
                        .text(key)
                        .click({k: key, v: val}, function (event) {
                            if (event.data.v['type'] == 'd') {
                                var lslice = currentData['path'].slice();
                                lslice.push(event.data.k);
                                requestData(lslice);
                            } else {
                                showProperties(event.data.k, event.data.v);
                            }
                        })
                    )
                    // right column
                    .append($('<div>').addClass('col text-right')
                        .append($('<button>').addClass('btn btn-lg btn-warning')
                            .text('delete')
                            .click({k: key, v: val}, function (event) {
                                var p = currentData.path.slice();
                                p.push(event.data.k);
                                alert('delete ' + JSON.stringify(p));
                            })
                        )
                    )
            )
        )
        // right vertical
        .append($('<div>').addClass('col-lg-4')
        )
        ;
}

function generateContent(content, mode) {
    $('#dircontent').empty();
    //var t = $('<div>')
    //    .addClass('row');
    $.each(content, function (key, value) {
        // tady bude rozhodovani podle mode (typ zobrazeni)
        $('#dircontent').append(generateRowItem(key, value));
    });
    //$('#dircontent').append(t);
}

function showProperties(key, val) {
    $('#dircontent').empty();
    $('#dircontent').append($('<button>')
        .addClass('btn btn-sm btn-info')
        .text("Go back")
        .click({content: currentData.content, mode: undefined}, function (event) {
            generateContent(event.data.content, event.data.mode)
        })
    );
    var t = $('<table>');
    $.each(val, function (k, v) {
        t.append($('<tr>')
            .append($('<td>')
                .text(k)
            )
            .append($('<td>')
                .text(v)
            )
        );
    });
    $('#dircontent').append(t);
    //console.log('Properities: '+key)
}

$(document).ready(function () {
    requestData(["home"]);
});


var toggler = document.getElementsByClassName("caret");
var i;

for (i = 0; i < toggler.length; i++) {
    toggler[i].addEventListener("click", function () {
        this.parentElement.querySelector(".nested").classList.toggle("active");
        this.classList.toggle("caret-down");
    });
}