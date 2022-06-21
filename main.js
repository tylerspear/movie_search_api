$(document).ready(function() {
    $('#title').autocomplete({
        source: async function(request, response) {
            //fetch data
            let data = await fetch(`http://localhost:2121/search?query=${request.term}`)
                //convert to json
                .then(results => results.json())
                //map each reult to an object
                .then(results => results.map(result => {
                    return {
                        label: result.title,
                        value: result.title,
                        id: result._id
                    }
                }))
            response(data)
        },
        minLength: 2,
        select: function(event, ui) {
            console.log(ui.item.id)
            fetch(`http://localhost:2121/get/${ui.item.id}`)
            .then(result => result.json())
            .then(result => {
                $('#cast').empty()
                result.cast.forEach(cast =>
                    {
                        $("#cast").append(`<li>${cast}</li>`)
                    })
                $('img').attr('src',result.poster)
            })
        }
    })
})