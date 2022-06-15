$(document).ready(function () {
    $("#img1").each(function () {
        $(this).on('load', () => {
            console.log('load')
        })

        if (this.complete) { 
            console.log('cek')
            $(this).trigger('load') 
        }
        
    })

    let _url = 'https://my-json-server.typicode.com/bramantyoharahap/exp-api-contact/contacts';
    $.get(_url, function (data) {
        let resultData = Array.from(data);
        if (resultData && resultData.length > 0) {
            fnShowData(resultData);
        }
    })
})

var fnShowData = (data) => {
    let elTableData = '' +
        '<table>' +
        '<tr>' +
        '<th>Id</th>' +
        '<th>First Name</th>' +
        '<th>Last Name</th>' +
        '<th>Email</th>' +
        '<th>Gender</th>' +
        '</tr>' +
        '[TABLE_BODY]' +
        '</table>';
    let elRowData = '<br/>'
    data.map(i => {
        elRowData +=
            '<tr>' +
            `<td>${i.id}</td>` +
            `<td>${i.first_name}</td>` +
            `<td>${i.last_name}</td>` +
            `<td>${i.email}</td>` +
            `<td>${i.gender}</td>` +
            '</tr>'
    });
    elTableData = elTableData.replace('[TABLE_BODY]', elRowData);
    $('#table-data').html(elTableData)
}