fetch('/getFormData')
    .then(response => response.json())
    .then(data => {
        // Use the data here
        console.log(data);
    });