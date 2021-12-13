const URL = 'http://localhost:3000/users';
const clearField = document.body.querySelectorAll('.form__group-field');
const elements = {};
const keys = ['sign_in', 'sign_up', 'tab_gradient', 'signInBtn', 'signUpBtn', 'sign_in_login', 'sign_in_password', 'wrong_message_in', 'wrong_message_up', 'form', 'form__box', 'sign_up_login', 'sign_up_pass', 'sign_up_pass_repeat'];

keys.forEach(key => Object.assign(elements, {
   [key]: document.getElementById(key)
}));

function tabsPosition(x, y, z) {
	elements.sign_in.style.left = x;
   elements.sign_up.style.left = y;
   elements.tab_gradient.style.left = z;
}

function signInTab() {
	tabsPosition('-150%', '50%', '107px');
};

function signUpTab() {
	tabsPosition('50%', '150%', '0px');
};

const errMessageIn = elements.wrong_message_in;
const errMessageUp = elements.wrong_message_up;

function wrongMessageForForm(addBlock ,message) {
	addBlock.style = `opacity: 1; padding: 5px;`;
	addBlock.innerHTML = message;
	setTimeout(() => addBlock.style = `opacity: 0; padding: 0px;`, 2500);
}

elements.signInBtn.addEventListener('click', (event) => {
   event.preventDefault();

   async function fetchAsync() {
      try {
         const response = await fetch(URL);
         const data = await response.json();
         let currentUser = null;
         let currentPass = null;

         for (let i = 0; i < data.length; i++) {
            if(elements.sign_in_login.value === data[i].login) {
               currentUser = data[i].login;
               if (elements.sign_in_password.value === data[i].password) {
                  currentPass = data[i].password;
                  break;
               }
            }
         }
         if (!currentUser) {
				wrongMessageForForm(errMessageIn ,'Not existing login');
         } else if (!currentPass) {
				wrongMessageForForm(errMessageIn, 'Wrong password. Try again!');
         } else {
				elements.form__box.style.display = 'none';
				let messageWelcome = document.createElement('div');
				elements.form.appendChild(messageWelcome).className = 'welcome';
				messageWelcome.innerText = `Congratulations! You have successfully logged in as user ${currentUser}!`;
			}
      } catch (e) {
         console.warn('Что-то пошло не так:', e);
      }
   };
   fetchAsync();
})

signUpBtn.addEventListener('click', (event) => {
   event.preventDefault();

   async function fetchAsync() {
      try {
         const response = await fetch(URL);
         const data = await response.json();
         let currentUser = null;

         for (let i = 0; i < data.length; i++) {
            if(elements.sign_up_login.value === data[i].login) {
               currentUser = data[i].login;
               break;
            }
         }
         if(currentUser) {
            wrongMessageForForm(errMessageUp ,'User with this login exists');
         } else if(!currentUser && elements.sign_up_pass.value === '') {
            wrongMessageForForm(errMessageUp ,'Please enter your password');
         } else if (!currentUser && !elements.sign_up_pass_repeat.value) {
            wrongMessageForForm(errMessageUp ,'Please enter your password again');
         } else if (!currentUser 
            && elements.sign_up_pass.value !== elements.sign_up_pass_repeat.value) {
               wrongMessageForForm(errMessageUp ,'You entered different passwords. Please edit them and try again.');
         } else {
            async function postUser() {
               await (await fetch (URL, {
                  method: 'POST',
                  headers: {
                     'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                     login: `${elements.sign_up_login.value}`,
                     password: `${elements.sign_up_pass_repeat.value}`,
                  }),
               })).json();
            };
            postUser();
            clearField.forEach((elem) => {
               elem.value = '';
            });
            let message = document.createElement('div')
            message.style = `
               background: #28c76f;
               padding: 5px;
               text-align: center;
               border-radius: 50px;
               box-shadow: 0 8px 25px -8px #28c76f;
            `
            elements.sign_up.appendChild(message).innerText = 'Thanks for registration!'
            setTimeout(() => {message.remove()}, 1500);
         };


      } catch (e) {
         console.warn('Что-то пошло не так:', e);
      };
   };
   fetchAsync();
})