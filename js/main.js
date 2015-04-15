document.addEventListener(
  'DOMContentLoaded',
  function (e) {
    var
      setAnimated = function (el) {
        el.classList.add('t-all');
        return setAnimated;
      },
      trim = ''.trim || function () {
        return this.replace(/\s/g, '');
      },
      verify = function (field) {
        var notEmpty = trim.call(field.value).length > 0;
        if (notEmpty && field.type === 'email') {
          // http://www.w3.org/TR/html-markup/datatypes.html#form.data.emailaddress-def
          notEmpty = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(field.value);
        }
        field.classList[
          notEmpty ? 'remove' : 'add'
        ]('error');
        return notEmpty;
      }
    ;
    this.getElementsByTagName('form')[0].addEventListener(
      'submit',
      function (e) {
        var
          form = e.currentTarget,
          fieldset = form.closest('fieldset'),
          fields = e.currentTarget.children,
          email = fields[0],
          subject = fields[1],
          message = fields[2],
          submit = fields[3]
        ;
        e.preventDefault();
        if (verify(email) && verify(subject) && verify(message)) {
          submit.disabled = true;
          mail({
            form: form,
            email: trim.call(email.value).slice(0, 128),
            subject: trim.call(subject.value).slice(0, 128),
            message: trim.call(message.value).slice(0, 1024),
            onerror: function () {
              submit.disabled = false;
              alert('Plese try again');
            },
            onsuccess: function () {
              fieldset.style.height = fieldset.offsetHeight + 'px';
              setTimeout(function () {
                setAnimated
                  (fieldset)
                  (email)
                  (subject)
                  (message)
                  (submit)
                ;
                [
                  function () {
                    email.style.opacity = 0;
                  },
                  function () {
                    subject.style.opacity = 0;
                  },
                  function () {
                    message.style.opacity = 0;
                  },
                  function () {
                    submit.style.opacity = 0;
                  },
                  function () {
                    var h2 = fieldset.appendChild(document.createElement('h2'));
                    h2.style.opacity = 0;
                    h2.textContent = 'Thank You!';
                    setAnimated(h2);
                    email.remove();
                    subject.remove();
                    message.remove();
                    submit.remove();
                    fieldset.style.height = (h2.offsetHeight + 64) + 'px';
                  },
                  function () {
                    fieldset.lastChild.style.opacity = 1;
                  }
                ].forEach(function (fn, i) {
                  setTimeout(fn, i * this + this);
                }, 300);
              }, 0);
            }
          });
        }
      },
      false
    );
    function mail(options) {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', options.form.action, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (199 < xhr.status && xhr.status < 400) {
            options.onsuccess();
          } else {
            options.onerror();
          }
        }
      };
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.send(Object.keys(options).reduce(function (s, key) {
        return typeof options[key] !== 'string' ? s : s.concat(
          '&',
          encodeURIComponent(key), '=',
          encodeURIComponent(options[key])
        );
      }, '').slice(1));
    }
  },
  false
);