const url = `https://6099728e99011f0017140ecc.mockapi.io/api/vi/contacts`,
    contacts = document.querySelector(`#contacts`);

class XHR{
	static async xhr(url, method='GET', data){
		let options = {
			method: method,
			headers: {
				'Content-type': 'application/json; charset=UTF-8'
			}
		}
		if(data)
			options.body = JSON.stringify(data);
		let request = await fetch(url,options),
			response = await request.json();
		return response;
	}
}

class Contact{
	constructor(contact){
		this.create(contact);
		this.render();
	}

	create(contact){
		for(let key in contact){
			this[key] = contact[key];
		}
	}

	render(){
		let tr = document.createElement(`tr`),
			tdBtn = document.createElement(`td`),
			editButton = document.createElement(`button`),
			saveButton = document.createElement(`button`),
			deleteButton = document.createElement(`button`);

		tr.dataset.id = this.id;

		editButton.innerHTML = `Edit`;
		editButton.className = `btn btn-outline-success btn-edit`;
		editButton.addEventListener(`click`,this.edit.bind(this));

		saveButton.innerHTML = `Save`;
		saveButton.className = `btn btn-outline-secondary btn-save`;
		saveButton.disabled = true;
		saveButton.addEventListener('click',this.save.bind(this));

		deleteButton.innerHTML = `Delete`;
		deleteButton.className = `btn btn-outline-danger`;
		deleteButton.addEventListener(`click`,this.delete.bind(this));
        
		tr.innerHTML = `<td><input type="text" id="name" value="${this.name}" disabled></td>
                        <td><input type="text" id="surname" value="${this.surname}" disabled></td>
                        <td><input type="text" id="phone" value="${this.phone}" disabled></td>`;

		tdBtn.append(editButton,saveButton,deleteButton);
		tr.append(tdBtn);
		contacts.append(tr);
	}
	delete(){
		XHR.xhr(`${url}/${this.id}`,`DELETE`)
			.then(
				() => Form.get()
			)
	}
	edit(){
		let tr = document.querySelector(`tr[data-id="${this.id}"]`),
            inputName = tr.querySelector(`#name`),
            inputSurname = tr.querySelector(`#surname`),
            inputPhone = tr.querySelector(`#phone`),
			editButton = tr.querySelector(`button.btn-edit`),
			saveButton = tr.querySelector(`button.btn-save`);

        inputName.disabled = false;
        inputName.focus();

        inputSurname.disabled = false;
        inputSurname.focus();

        inputPhone.disabled = false;
        inputPhone.focus();

		saveButton.classList.add(`btn-outline-dark`);
		saveButton.disabled = false;
	}
	save(){
		let tr = document.querySelector(`tr[data-id="${this.id}"]`),
            inputName = tr.querySelector(`#name`),
            inputSurname = tr.querySelector(`#surname`),
            inputPhone = tr.querySelector(`#phone`);

		let contact = {
			id: tr.dataset.id,
			name: inputName.value,
            surname: inputSurname.value,
            phone: inputPhone.value
		}
		XHR.xhr(`${url}/${this.id}`,`PUT`,contact)
			.then(
				() => Form.get()
			)
	}
}

class Form {
    constructor(el){
        this.el = document.querySelector(el);
        this.el.addEventListener('submit', this.submit.bind(this));
    }

    async submit(e){
        e.preventDefault();
        let inputName = this.el.querySelector('#name'),
            nameValue = inputName.value,
            inputSurname = this.el.querySelector('#surname'),
            surnameValue = inputSurname.value,
            inputPhone = this.el.querySelector('#phone'),
            phoneValue = inputPhone.value;
        
        inputName.value='';
        inputSurname.value='';
        inputPhone.value='';
        this.add(nameValue,surnameValue,phoneValue);
    }

    async add(nameValue,surnameValue,phoneValue){
        let contact_ = {
            name: nameValue,
            surname: surnameValue,
            phone: phoneValue,
        }
        let newContact = await XHR.xhr(url,`POST`,contact_),
			createContact = await new Contact(newContact);
    };

    static get(){
        XHR.xhr(url)
            .then(
                tasks => {
                    contacts.innerHTML='';
                    return tasks;
                }
            )
            .then(
				tasks => tasks.forEach(contact_ => new Contact(contact_))
			)
    }
}

Form.get();

let createContact = new Form(`#createContact`);