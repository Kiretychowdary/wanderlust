(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
          if (!form.checkValidity()) {
              event.preventDefault()
              event.stopPropagation()
          }

          form.classList.add('was-validated')
      }, false)

      // Real-time validation
      const inputs = form.querySelectorAll('input, textarea, select')
      inputs.forEach(input => {
          input.addEventListener('input', () => {
              if (input.checkValidity()) {
                  input.classList.add('is-valid')
                  input.classList.remove('is-invalid')
              } else {
                  input.classList.add('is-invalid')
                  input.classList.remove('is-valid')
              }
          })
      })
  })
})()
