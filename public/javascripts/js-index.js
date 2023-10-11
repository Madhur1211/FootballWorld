
document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Display the success message
    document.getElementById('success-message').style.display = 'block';

    // Hide the form
    document.getElementById('contact-form').style.display = 'none';

    // Display the "Redirecting..." message
    document.getElementById('redirect-message').style.display = 'block';

    // Redirect to the home page (change 'home.html' to the actual URL)
    setTimeout(function () {
        window.location.href = '/';
    }, 2000); // Redirect after 2 seconds (you can adjust the timing)
});
