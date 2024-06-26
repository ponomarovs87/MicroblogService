document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('userForm');
    const submitButton = document.getElementById('submitButton');

    form.addEventListener('submit', function (e) {
        e.preventDefault(); // Предотвращает отправку формы по умолчанию

        const formData = new FormData(form);
        const formObject = {};

        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        console.log(formData,formObject,form);

        fetch(form.action, {
            method: form.method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formObject)
        })
        .then(data => {
            // Обработка успешного ответа
            console.log('Success:', data);
        })
        .catch((error) => {
            // Обработка ошибки
            console.error('Error:', error);
        });
    });
});