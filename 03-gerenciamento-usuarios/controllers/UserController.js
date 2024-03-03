// @ts-nocheck
class UserController {
    constructor(formIdCreate, formIdUpdate, tableId) {
        this.formEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();
        this.onEdit();
    }

    onEdit() {
        document.querySelector('#box-user-update .btn-cancel').addEventListener('click', (e) => {
            this.showPanelCreate();
        });

        this.formUpdateEl.addEventListener('submit', (event) => {
            event.preventDefault();

            let btn = this.formUpdateEl.querySelector('[type=submit]');
            btn.disabled = true;

            let values = this.getValues(this.formUpdateEl);
            let index = this.formUpdateEl.dataset.trIndex;
            let tr = this.tableEl.rows[index];
            let userOld = JSON.parse(tr.dataset.user);
            let result = Object.assign({}, userOld, values);

            this.getPhoto(this.formUpdateEl).then(
                (content) => {
                    if (!values.photo) {
                        result._photo = userOld._photo;
                    } else {
                        result._photo = content;
                    }

                    tr.dataset.user = JSON.stringify(result);
                    tr.innerHTML = `
                        <td>
                            <img src="${result._photo}" alt="User Image" class="img-circle img-sm" />
                        </td>
                        <td>${result._name}</td>
                        <td>${result._email}</td>
                        <td>${result._admin ? 'Sim' : 'Não'}</td>
                        <td>${Utils.dateFormat(result._register)}</td>
                        <td>
                            <button type="button" class="btn btn-edit btn-primary btn-xs btn-flat">Editar</button>
                            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                        </td>
                    `;

                    this.addEventsTR(tr);
                    this.updateCount();
                    this.formUpdateEl.reset();
                    this.showPanelCreate();
                    btn.disabled = false;
                },
                (e) => {
                    console.error(e);
                }
            );
        });
    }

    onSubmit() {
        this.formEl.addEventListener('submit', (event) => {
            event.preventDefault();

            let btn = this.formEl.querySelector('[type=submit]');
            btn.disabled = true;

            let values = this.getValues(this.formEl);
            if (!values) return false;

            this.getPhoto(this.formEl).then(
                (content) => {
                    values.photo = content;
                    this.addLine(values);

                    this.formEl.reset();
                    btn.disabled = false;
                },
                (e) => {
                    console.error(e);
                }
            );
        });
    }

    getPhoto(formEl) {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();

            let elements = [...formEl.elements].filter((item) => {
                if (item.name === 'photo') {
                    return item;
                }
            });

            let file = elements[0].files[0];
            fileReader.onload = () => {
                resolve(fileReader.result); // Base64 Image Encoder
            };

            fileReader.onerror = (e) => {
                reject(e);
            };

            if (file) {
                fileReader.readAsDataURL(file);
            } else {
                function getRandomColor() {
                    const letters = '0123456789ABCDEF';
                    let color = '';
                    for (let i = 0; i < 6; i++) {
                        color += letters[Math.floor(Math.random() * 16)];
                    }
                    return color;
                }

                let firstLetter = this.getValues(formEl).name;
                firstLetter = firstLetter.charAt(0).toUpperCase();

                const imageUrl = 'https://placehold.co/30x30/' + getRandomColor() + '/white?text=' + firstLetter;
                resolve(imageUrl);
            }
        });
    }

    getValues(formEl) {
        let user = {};
        let isValid = true;

        [...formEl.elements].forEach(function (field, index) {
            if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) {
                field.parentElement.classList.add('has-error');
                isValid = false;
            } else {
                field.parentElement.classList.remove('has-error');
            }

            if (field.name == 'gender') {
                if (field.checked) {
                    user[field.name] = field.value;
                }
            } else if (field.name == 'admin') {
                user[field.name] = field.checked;
            } else {
                user[field.name] = field.value;
            }
        });

        if (!isValid) {
            this.formEl.querySelector('[type=submit]').disabled = false;
            return false;
        }
        // prettier-ignore
        return new User(
            user.name, 
            user.gender, 
            user.birth, 
            user.country, 
            user.email, 
            user.password, 
            user.photo, 
            user.admin
        );
    }

    addLine(dataUser) {
        let tr = document.createElement('tr');

        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML = `
            <td>
                <img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm" />
            </td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${dataUser.admin ? 'Sim' : 'Não'}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-edit btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;

        this.addEventsTR(tr);
        this.tableEl.appendChild(tr);
        this.updateCount();
    }

    addEventsTR(tr) {
        tr.querySelector('.btn-edit').addEventListener('click', (e) => {
            let json = JSON.parse(tr.dataset.user);

            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;

            for (let name in json) {
                let field = this.formUpdateEl.querySelector('[name=' + name.replace('_', '') + ']');

                if (field) {
                    switch (field.type) {
                        case 'file':
                            continue;
                            break;
                        case 'radio':
                            field = this.formUpdateEl.querySelector('[name=' + name.replace('_', '') + '][value=' + json[name] + ']');
                            field.checked = true;
                            break;
                        case 'checkbox':
                            field.checked = json[name];
                            break;
                        default:
                            field.value = json[name];
                    }
                }
            }

            this.formUpdateEl.querySelector('.photo').src = json._photo;
            this.showPanelUpdate();
        });
    }

    showPanelCreate() {
        document.querySelector('#box-user-create').style.display = 'block';
        document.querySelector('#box-user-update').style.display = 'none';
    }

    showPanelUpdate() {
        document.querySelector('#box-user-create').style.display = 'none';
        document.querySelector('#box-user-update').style.display = 'block';
    }

    updateCount() {
        let numberUsers = 0;
        let numberUsersAdmin = 0;

        [...this.tableEl.children].forEach((tr) => {
            numberUsers++;

            let user = JSON.parse(tr.dataset.user);
            if (user._admin) numberUsersAdmin++;
        });

        document.querySelector('#number-users').innerHTML = numberUsers;
        document.querySelector('#number-users-admin').innerHTML = numberUsersAdmin;
    }
}
