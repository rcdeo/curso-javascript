// @ts-nocheck
class DropboxController {
    constructor() {
        this.currentFolder = ['rcdeo'];

        this.onselectionchange = new Event('selectionchange');

        this.navEl = document.querySelector('#browse-location');
        this.btnSendFileEl = document.querySelector('#btn-send-file');
        this.inputFilesEl = document.querySelector('#files');
        this.snackModalEl = document.querySelector('#react-snackbar-root');
        this.progressBarEl = this.snackModalEl.querySelector('.mc-progress-bar-fg');
        this.filenameEl = this.snackModalEl.querySelector('.filename');
        this.timeleftEl = this.snackModalEl.querySelector('.timeleft');
        this.listFilesEl = document.querySelector('#list-of-files-and-directories');

        this.btnNewFolder = document.querySelector('#btn-new-folder');
        this.btnRename = document.querySelector('#btn-rename');
        this.btnDelete = document.querySelector('#btn-delete');

        this.connectFirebase();
        this.initEvents();
        this.openFolder();
    }

    connectFirebase() {
        const config = {
            apiKey: 'YOUR_API_KEY',
            authDomain: 'YOUR_AUTH_DOMAIN',
            databaseURL: 'YOUR_DATABASE_URL',
            projectId: 'YOUR_PROJECT_ID',
            storageBucket: 'YOUR_STORAGE_BUCKET',
            messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
            appId: 'YOUR_APP_ID',
        };
        firebase.initializeApp(config);
    }

    getSelection() {
        return this.listFilesEl.querySelectorAll('.selected');
    }

    removeFolderTask(ref, name) {
        return new Promise((resolve, reject) => {
            let folderRef = this.getFirebaseRef(ref + '/' + name);

            folderRef.on('value', (snapshot) => {
                folderRef.off('value');

                snapshot.forEach((item) => {
                    let data = item.val();
                    data.key = item.key;

                    if (data.type === 'folder') {
                        this.removeFolderTask(ref + '/' + name, data.name)
                            .then(() => {
                                resolve({
                                    fields: {
                                        key: data.key,
                                    },
                                });
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    } else if (data.type) {
                        this.removeFile(ref + '/' + name, data.name)
                            .then(() => {
                                resolve({
                                    fields: {
                                        key: data.key,
                                    },
                                });
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    }
                });
                folderRef.remove();
            });
        });
    }

    removeTask() {
        let promises = [];

        this.getSelection().forEach((li) => {
            let file = JSON.parse(li.dataset.file);
            let key = li.dataset.key;

            promises.push(
                new Promise((resolve, reject) => {
                    if (file.type === 'folder') {
                        this.removeFolderTask(this.currentFolder.join('/'), file.name)
                            .then(() => {
                                resolve({
                                    fields: {
                                        key,
                                    },
                                });
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    } else if (file.type) {
                        this.removeFile(this.currentFolder.join('/'), file.name)
                            .then(() => {
                                resolve({
                                    fields: {
                                        key,
                                    },
                                });
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    }
                })
            );
        });
        return Promise.all(promises);
    }

    removeFile(ref, name) {
        let fileRef = firebase.storage().ref(ref).child(name);
        return fileRef.delete();
    }

    initEvents() {
        this.btnNewFolder.addEventListener('click', (e) => {
            let name = prompt('Nome da nova pasta:');
            if (name) {
                this.getFirebaseRef()
                    .push()
                    .set({
                        name,
                        type: 'folder',
                        path: this.currentFolder.join('/'),
                    });
            }
        });

        this.btnDelete.addEventListener('click', (e) => {
            this.removeTask()
                .then((responses) => {
                    responses.forEach((response) => {
                        if (response.fields.key) {
                            this.getFirebaseRef().child(response.fields.key).remove();
                        }
                    });
                })
                .catch((err) => {
                    console.error(err);
                });
        });

        this.btnRename.addEventListener('click', (e) => {
            let li = this.getSelection()[0];
            let file = JSON.parse(li.dataset.file);
            let name = prompt('Renomear o arquivo:', file.name);

            if (name) {
                file.name = name;
                this.getFirebaseRef().child(li.dataset.key).set(file);
            }
        });

        this.listFilesEl.addEventListener('selectionchange', (e) => {
            switch (this.getSelection().length) {
                case 0:
                    this.btnDelete.style.display = 'none';
                    this.btnRename.style.display = 'none';
                    break;

                case 1:
                    this.btnDelete.style.display = 'block';
                    this.btnRename.style.display = 'block';
                    break;

                default:
                    this.btnDelete.style.display = 'block';
                    this.btnRename.style.display = 'none';
                    break;
            }
        });

        this.btnSendFileEl.addEventListener('click', (event) => {
            this.inputFilesEl.click();
        });

        this.inputFilesEl.addEventListener('change', (event) => {
            this.btnSendFileEl.disabled = true;

            this.uploadTask(event.target.files)
                .then((responses) => {
                    responses.forEach((resp) => {
                        this.getFirebaseRef().push().set({
                            name: resp.name,
                            type: resp.contentType,
                            path: resp.customMetadata.downloadURL,
                            size: resp.size,
                        });
                    });

                    this.uploadComplete();
                })
                .catch((err) => {
                    this.uploadComplete();
                    console.log(err);
                });

            this.modalShow();
        });
    }

    uploadComplete() {
        this.modalShow(false);
        this.inputFilesEl.value = '';
        this.btnSendFileEl.disabled = false;
    }

    getFirebaseRef(path) {
        if (!path) path = this.currentFolder.join('/');
        return firebase.database().ref(path);
    }

    modalShow(show = true) {
        this.snackModalEl.style.display = show ? 'block' : 'none';
    }

    ajax(url, method = 'GET', formData = new FormData(), onprogress = function () {}, onloadstart = function () {}) {
        return new Promise((resolve, reject) => {
            let ajax = new XMLHttpRequest();
            ajax.open(method, url);

            ajax.onload = (event) => {
                try {
                    resolve(JSON.parse(ajax.responseText));
                } catch (e) {
                    reject(e);
                }
            };

            ajax.onerror = (event) => {
                reject(event);
            };

            ajax.upload.onprogress = onprogress;
            onloadstart();
            ajax.send(formData);
        });
    }

    uploadTask(files) {
        let promises = [];

        [...files].forEach((file) => {
            promises.push(
                new Promise((resolve, reject) => {
                    let fileRef = firebase.storage().ref(this.currentFolder.join('/')).child(file.name);
                    let task = fileRef.put(file);

                    task.on(
                        'state_changed',
                        (snapshot) => {
                            this.uploadProgress(
                                {
                                    loaded: snapshot.bytesTransferred,
                                    total: snapshot.totalBytes,
                                },
                                file
                            );
                        },
                        (error) => {
                            console.error(error);
                            reject(error);
                        },
                        () => {
                            fileRef.getDownloadURL().then((downloadURL) => {
                                fileRef
                                    .updateMetadata({ customMetadata: { downloadURL } })
                                    .then((metadata) => {
                                        resolve(metadata);
                                    })
                                    .catch((error) => {
                                        console.error('Error update metadata:', error);
                                        reject(error);
                                    });
                            });
                        }
                    );
                })
            );
        });

        return Promise.all(promises);
    }

    uploadProgress(event, file) {
        let timespent = Date.now() - this.startUploadTime;
        let loaded = event.loaded;
        let total = event.total;
        let porcent = parseInt((loaded / total) * 100);
        let timeleft = ((100 - porcent) * timespent) / porcent;

        this.progressBarEl.style.width = `${porcent}%`;
        this.filenameEl.innerHTML = file.name;
        this.timeleftEl.innerHTML = this.formatTimeToHuman(timeleft);
    }

    formatTimeToHuman(duration) {
        let seconds = parseInt((duration / 1000) % 60);
        let minutes = parseInt((duration / (1000 * 60)) % 60);
        let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        if (hours > 0) {
            return ` - ${hours} horas, ${minutes} minutos e ${seconds} segundos restantes`;
        }
        if (minutes > 0) {
            return ` - ${minutes} minutos e ${seconds} segundos restantes`;
        }
        if (seconds > 0) {
            return ` - ${seconds} segundos restantes`;
        }

        return '';
    }

    getFileIconView(file) {
        switch (file.type) {
            case 'folder':
                return `
                <svg width="160px" height="160px" viewBox="-9.6 -9.6 43.20 43.20" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0" transform="translate(12,12), scale(0)"><rect x="-9.6" y="-9.6" width="43.20" height="43.20" rx="0" fill="#ffffff" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M22 14V11.7979C22 11.4227 21.9978 10.75 21.9978 10.75L22 10H2V10.75V14C2 17.7712 2 19.6569 3.17157 20.8284C4.34315 22 6.22876 22 10 22H14C17.7712 22 19.6569 22 20.8284 20.8284C22 19.6569 22 17.7712 22 14Z" fill="#638272"></path> <path opacity="0.5" d="M11 4L10.4497 3.44975C10.1763 3.17633 10.0396 3.03961 9.89594 2.92051C9.27652 2.40704 8.51665 2.09229 7.71557 2.01738C7.52976 2 7.33642 2 6.94975 2C6.06722 2 5.62595 2 5.25839 2.06935C3.64031 2.37464 2.37464 3.64031 2.06935 5.25839C2 5.62595 2 6.06722 2 6.94975V9.25V10H22L21.9531 9.25C21.8809 8.20117 21.6973 7.51276 21.2305 6.99383C21.1598 6.91514 21.0849 6.84024 21.0062 6.76946C20.1506 6 18.8345 6 16.2021 6H15.8284C14.6747 6 14.0979 6 13.5604 5.84678C13.2651 5.7626 12.9804 5.64471 12.7121 5.49543C12.2237 5.22367 11.8158 4.81578 11 4Z" fill="#638272"></path> </g></svg>
                `;
                break;

            case 'image/jpeg':
            case 'image/png':
            case 'image/gif':
            case 'image/bmp':
            case 'image/webp':
            case 'image/svg':
            case 'image/tiff':
            case 'image/heic':
            case 'image/heif':
            case 'image/raw':
                return `
                <svg width="160px" height="160px" viewBox="-12 -12 48.00 48.00" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0" transform="translate(12,12), scale(0)"><rect x="-12" y="-12" width="48.00" height="48.00" rx="0" fill="#ffffff" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18 8C18 9.10457 17.1046 10 16 10C14.8954 10 14 9.10457 14 8C14 6.89543 14.8954 6 16 6C17.1046 6 18 6.89543 18 8Z" fill="#638272"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9426 1.25H12.0574C14.3658 1.24999 16.1748 1.24998 17.5863 1.43975C19.031 1.63399 20.1711 2.03933 21.0659 2.93414C21.9607 3.82895 22.366 4.96897 22.5603 6.41371C22.75 7.82519 22.75 9.63423 22.75 11.9426V12.0309C22.75 13.9397 22.75 15.5023 22.6463 16.7745C22.5422 18.0531 22.3287 19.1214 21.8509 20.0087C21.6401 20.4001 21.3812 20.7506 21.0659 21.0659C20.1711 21.9607 19.031 22.366 17.5863 22.5603C16.1748 22.75 14.3658 22.75 12.0574 22.75H11.9426C9.63423 22.75 7.82519 22.75 6.41371 22.5603C4.96897 22.366 3.82895 21.9607 2.93414 21.0659C2.14086 20.2726 1.7312 19.2852 1.51335 18.0604C1.29935 16.8573 1.2602 15.3603 1.25207 13.5015C1.25 13.0287 1.25 12.5286 1.25 12.001L1.25 11.9426C1.24999 9.63423 1.24998 7.82519 1.43975 6.41371C1.63399 4.96897 2.03933 3.82895 2.93414 2.93414C3.82895 2.03933 4.96897 1.63399 6.41371 1.43975C7.82519 1.24998 9.63423 1.24999 11.9426 1.25ZM6.61358 2.92637C5.33517 3.09825 4.56445 3.42514 3.9948 3.9948C3.42514 4.56445 3.09825 5.33517 2.92637 6.61358C2.75159 7.91356 2.75 9.62178 2.75 12C2.75 12.5287 2.75 13.0257 2.75205 13.4949C2.76025 15.369 2.80214 16.7406 2.99017 17.7978C3.17436 18.8333 3.48774 19.4981 3.9948 20.0052C4.56445 20.5749 5.33517 20.9018 6.61358 21.0736C7.91356 21.2484 9.62178 21.25 12 21.25C14.3782 21.25 16.0864 21.2484 17.3864 21.0736C18.6648 20.9018 19.4355 20.5749 20.0052 20.0052C20.2151 19.7953 20.3872 19.5631 20.5302 19.2976C20.8619 18.6816 21.0531 17.8578 21.1513 16.6527C21.2494 15.4482 21.25 13.9459 21.25 12C21.25 9.62178 21.2484 7.91356 21.0736 6.61358C20.9018 5.33517 20.5749 4.56445 20.0052 3.9948C19.4355 3.42514 18.6648 3.09825 17.3864 2.92637C16.0864 2.75159 14.3782 2.75 12 2.75C9.62178 2.75 7.91356 2.75159 6.61358 2.92637Z" fill="#638272"></path> <path opacity="0.4" d="M20.6069 19.1463L17.7765 16.599C16.737 15.6634 15.1889 15.5702 14.0446 16.3744L13.7464 16.5839C12.9513 17.1428 11.8695 17.0491 11.1822 16.3618L6.89252 12.0721C6.03631 11.2159 4.66289 11.1702 3.75162 11.9675L2.75049 12.8435C2.75077 13.0665 2.75128 13.2835 2.7522 13.4949C2.7604 15.369 2.80229 16.7406 2.99032 17.7978C3.17451 18.8333 3.48788 19.4981 3.99494 20.0052C4.5646 20.5749 5.33532 20.9018 6.61372 21.0736C7.9137 21.2484 9.62192 21.25 12.0001 21.25C14.3784 21.25 16.0866 21.2484 17.3866 21.0736C18.665 20.9018 19.4357 20.5749 20.0054 20.0052C20.2153 19.7953 20.3873 19.5631 20.5303 19.2976C20.5568 19.2485 20.5823 19.1981 20.6069 19.1463Z" fill="#638272"></path> </g></svg>
                `;
                break;

            case 'application/pdf':
                return `
                <svg width="160px" height="160px" viewBox="-96 -96 384.00 384.00" xmlns="http://www.w3.org/2000/svg" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0" transform="translate(96,96), scale(0)"><rect x="-96" y="-96" width="384.00" height="384.00" rx="0" fill="#ffffff" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M77.749 42.134c1.157 27.686 11.572 35.67 27.002 55.113 19.417 24.595 34.075 38.438 45.969 41.657 17.809 4.764 27.645-10.302 10.287-17.834-17.36-7.533-48.22-5.151-66.22-2.383-29.253 4.7-50.277 13.07-66.543 31.355-14.272 15.839-1.607 27.686 12.666 13.907 13.051-12.233 30.474-46.034 37.61-61.808 9.516-20.99 20.188-39.661 18.806-64.256-1.382-24.595-20.348-18.8-19.577 4.25Z" style="fill:none;stroke:#638272;stroke-width:12;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1"></path></g></svg>
                `;
                break;

            case 'audio/aac':
            case 'audio/mp3':
            case 'audio/ogg':
            case 'audio/flac':
            case 'audio/alac':
            case 'audio/wav':
            case 'audio/aiff':
            case 'audio/amr':
            case 'audio/mpeg':
                return `
                <svg width="160px" height="160px" viewBox="-12 -12 48.00 48.00" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0" transform="translate(12,12), scale(0)"><rect x="-12" y="-12" width="48.00" height="48.00" rx="0" fill="#ffffff" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2 12.124C2 6.53269 6.47713 2 11.9999 2C17.5228 2 21.9999 6.53269 21.9999 12.124L21.9999 17.3675C22.0002 18.1844 22.0004 18.7446 21.8568 19.2364C21.576 20.1982 20.9046 20.9937 20.01 21.4245C19.5525 21.6449 19.0059 21.732 18.2088 21.8591L18.0789 21.8799C17.7954 21.9252 17.5532 21.9639 17.3522 21.9839C17.1431 22.0047 16.9299 22.0111 16.7118 21.9676C15.9942 21.8245 15.4024 21.3126 15.1508 20.6172C15.0744 20.4059 15.0474 20.1916 15.035 19.9793C15.0232 19.7753 15.0232 19.527 15.0232 19.2365L15.0231 15.0641C15.0226 14.6386 15.0222 14.2725 15.1195 13.959C15.3422 13.2416 15.9238 12.6975 16.6477 12.5292C16.9641 12.4556 17.3246 12.4849 17.7435 12.5189L17.8367 12.5264L17.9465 12.5352C18.7302 12.5975 19.2664 12.6402 19.7216 12.8106C20.0415 12.9304 20.3381 13.0953 20.6046 13.2976V12.124C20.6046 7.31288 16.7521 3.41266 11.9999 3.41266C7.24776 3.41266 3.39534 7.31288 3.39534 12.124V13.2976C3.66176 13.0953 3.95843 12.9304 4.27829 12.8106C4.73345 12.6402 5.26965 12.5975 6.05335 12.5352L6.16318 12.5264L6.25641 12.5189C6.67534 12.4849 7.03581 12.4556 7.35224 12.5292C8.07612 12.6975 8.65766 13.2416 8.88039 13.959C8.97774 14.2725 8.9773 14.6386 8.97678 15.0641L8.97671 19.2365C8.97671 19.527 8.97672 19.7753 8.96487 19.9793C8.95254 20.1916 8.9255 20.4059 8.84906 20.6172C8.59754 21.3126 8.00574 21.8245 7.28812 21.9676C7.07001 22.0111 6.85675 22.0047 6.64768 21.9839C6.44671 21.9639 6.20449 21.9252 5.92102 21.8799L5.79106 21.8591C4.99399 21.732 4.44737 21.6449 3.98991 21.4245C3.09534 20.9937 2.42388 20.1982 2.14308 19.2364C2.02467 18.8309 2.00404 18.3788 2.0006 17.7747L2 17.5803V12.124Z" fill="#638272"></path> <g opacity="0.5"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 5.75C12.4142 5.75 12.75 6.08579 12.75 6.5L12.75 11.5C12.75 11.9142 12.4142 12.25 12 12.25C11.5858 12.25 11.25 11.9142 11.25 11.5L11.25 6.5C11.25 6.08579 11.5858 5.75 12 5.75Z" fill="#638272"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M15 7.25C15.4142 7.25 15.75 7.58579 15.75 8V10C15.75 10.4142 15.4142 10.75 15 10.75C14.5858 10.75 14.25 10.4142 14.25 10V8C14.25 7.58579 14.5858 7.25 15 7.25Z" fill="#638272"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M9 7.25C9.41421 7.25 9.75 7.58579 9.75 8L9.75 10C9.75 10.4142 9.41421 10.75 9 10.75C8.58579 10.75 8.25 10.4142 8.25 10L8.25 8C8.25 7.58579 8.58579 7.25 9 7.25Z" fill="#638272"></path> </g> </g></svg>
                `;
                break;

            case 'video/mp4':
            case 'video/mov':
            case 'video/mkv':
            case 'video/avi':
            case 'video/flv':
            case 'video/hevc':
            case 'video/wmv':
            case 'video/mpeg':
            case 'video/3gp':
            case 'video/vp9':
            case 'video/av1':
            case 'video/ogg':
                return `
                <svg width="160px" height="160px" viewBox="-9.6 -9.6 43.20 43.20" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0" transform="translate(12,12), scale(0)"><rect x="-9.6" y="-9.6" width="43.20" height="43.20" rx="0" fill="#ffffff" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17 9.50019L17.6584 9.17101C19.6042 8.19807 20.5772 7.7116 21.2886 8.15127C22 8.59094 22 9.67872 22 11.8543V12.1461C22 14.3217 22 15.4094 21.2886 15.8491C20.5772 16.2888 19.6042 15.8023 17.6584 14.8294L17 14.5002V9.50019Z" fill="#638272"></path> <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M2.90796 5.46243C2 6.56878 2 8.21252 2 11.5V12.5C2 15.7875 2 17.4312 2.90796 18.5376C3.07418 18.7401 3.25989 18.9258 3.46243 19.092C4.56878 20 6.21252 20 9.5 20C12.7875 20 14.4312 20 15.5376 19.092C15.7401 18.9258 15.9258 18.7401 16.092 18.5376C17 17.4312 17 15.7875 17 12.5V11.5C17 8.21252 17 6.56878 16.092 5.46243C15.9258 5.25989 15.7401 5.07418 15.5376 4.90796C14.4312 4 12.7875 4 9.5 4C6.21252 4 4.56878 4 3.46243 4.90796C3.25989 5.07418 3.07418 5.25989 2.90796 5.46243Z" fill="#638272"></path> <path d="M14 8.5C14 9.32843 13.3284 10 12.5 10C11.6716 10 11 9.32843 11 8.5C11 7.67157 11.6716 7 12.5 7C13.3284 7 14 7.67157 14 8.5Z" fill="#638272"></path> </g></svg>
                `;
                break;

            case 'application/x-zip-compressed':
            case 'application/x-compressed':
                return `
                <svg width="160px" height="160px" viewBox="-12 -12 48.00 48.00" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0" transform="translate(12,12), scale(0)"><rect x="-12" y="-12" width="48.00" height="48.00" rx="0" fill="#ffffff" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g opacity="0.3"> <path d="M4.66602 9C3.73413 9 3.26819 9 2.90065 8.84776C2.41059 8.64477 2.02124 8.25542 1.81826 7.76537C1.66602 7.39782 1.66602 6.93188 1.66602 6C1.66602 5.06812 1.66602 4.60217 1.81826 4.23463C2.02124 3.74458 2.41059 3.35523 2.90065 3.15224C3.26819 3 3.73413 3 4.66602 3H11.934C11.8905 3.07519 11.8518 3.15353 11.8183 3.23463C11.666 3.60217 11.666 4.06812 11.666 5L11.666 9H4.66602Z" fill="#638272"></path> <path d="M21.666 6C21.666 6.93188 21.666 7.39782 21.5138 7.76537C21.3108 8.25542 20.9214 8.64477 20.4314 8.84776C20.0638 9 19.5979 9 18.666 9H17.666V5C17.666 4.06812 17.666 3.60217 17.5138 3.23463C17.4802 3.15353 17.4415 3.07519 17.3981 3H18.666C19.5979 3 20.0638 3 20.4314 3.15224C20.9214 3.35523 21.3108 3.74458 21.5138 4.23463C21.666 4.60217 21.666 5.06812 21.666 6Z" fill="#638272"></path> </g> <g opacity="0.7"> <path d="M17.5138 20.7654C17.666 20.3978 17.666 19.9319 17.666 19V15H18.666C19.5979 15 20.0638 15 20.4314 15.1522C20.9214 15.3552 21.3108 15.7446 21.5138 16.2346C21.666 16.6022 21.666 17.0681 21.666 18C21.666 18.9319 21.666 19.3978 21.5138 19.7654C21.3108 20.2554 20.9214 20.6448 20.4314 20.8478C20.0638 21 19.5979 21 18.666 21H17.3981C17.4415 20.9248 17.4802 20.8465 17.5138 20.7654Z" fill="#638272"></path> <path d="M11.934 21H4.66602C3.73413 21 3.26819 21 2.90065 20.8478C2.41059 20.6448 2.02124 20.2554 1.81826 19.7654C1.66602 19.3978 1.66602 18.9319 1.66602 18C1.66602 17.0681 1.66602 16.6022 1.81826 16.2346C2.02124 15.7446 2.41059 15.3552 2.90065 15.1522C3.26819 15 3.73413 15 4.66602 15H11.666V19C11.666 19.9319 11.666 20.3978 11.8183 20.7654C11.8518 20.8465 11.8905 20.9248 11.934 21Z" fill="#638272"></path> </g> <g opacity="0.5"> <path d="M17.666 9H18.666C19.5979 9 20.0638 9 20.4314 9.15224C20.9214 9.35523 21.3108 9.74458 21.5138 10.2346C21.666 10.6022 21.666 11.0681 21.666 12C21.666 12.9319 21.666 13.3978 21.5138 13.7654C21.3108 14.2554 20.9214 14.6448 20.4314 14.8478C20.0638 15 19.5979 15 18.666 15H17.666V9Z" fill="#638272"></path> <path d="M11.666 9V15H4.66602C3.73413 15 3.26819 15 2.90065 14.8478C2.41059 14.6448 2.02124 14.2554 1.81826 13.7654C1.66602 13.3978 1.66602 12.9319 1.66602 12C1.66602 11.0681 1.66602 10.6022 1.81826 10.2346C2.02124 9.74458 2.41059 9.35523 2.90065 9.15224C3.26819 9 3.73413 9 4.66602 9H11.666Z" fill="#638272"></path> </g> <path fill-rule="evenodd" clip-rule="evenodd" d="M17.5138 3.23463C17.666 3.60218 17.666 4.06812 17.666 5L17.666 19C17.666 19.9319 17.666 20.3978 17.5138 20.7654C17.4802 20.8465 17.4415 20.9248 17.3981 21C17.1792 21.3792 16.8403 21.6784 16.4314 21.8478C16.0638 22 15.5979 22 14.666 22C13.7341 22 13.2682 22 12.9006 21.8478C12.4917 21.6784 12.1529 21.3792 11.934 21C11.8905 20.9248 11.8518 20.8465 11.8183 20.7654C11.666 20.3978 11.666 19.9319 11.666 19V5C11.666 4.06812 11.666 3.60218 11.8183 3.23463C11.8518 3.15353 11.8905 3.07519 11.934 3C12.1529 2.62082 12.4917 2.32164 12.9006 2.15224C13.2682 2 13.7341 2 14.666 2C15.5979 2 16.0638 2 16.4314 2.15224C16.8403 2.32164 17.1792 2.62082 17.3981 3C17.4415 3.07519 17.4802 3.15353 17.5138 3.23463ZM15.416 11C15.416 10.5858 15.0802 10.25 14.666 10.25C14.2518 10.25 13.916 10.5858 13.916 11L13.916 13C13.916 13.4142 14.2518 13.75 14.666 13.75C15.0802 13.75 15.416 13.4142 15.416 13L15.416 11Z" fill="#638272"></path> </g></svg>
                `;
                break;

            default:
                return `
                <svg width="160px" height="160px" viewBox="-9.6 -9.6 35.20 35.20" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0" transform="translate(8,8), scale(0)"><rect x="-9.6" y="-9.6" width="35.20" height="35.20" rx="0" fill="#ffffff" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M7.493 0.015 C 7.442 0.021,7.268 0.039,7.107 0.055 C 5.234 0.242,3.347 1.208,2.071 2.634 C 0.660 4.211,-0.057 6.168,0.009 8.253 C 0.124 11.854,2.599 14.903,6.110 15.771 C 8.169 16.280,10.433 15.917,12.227 14.791 C 14.017 13.666,15.270 11.933,15.771 9.887 C 15.943 9.186,15.983 8.829,15.983 8.000 C 15.983 7.171,15.943 6.814,15.771 6.113 C 14.979 2.878,12.315 0.498,9.000 0.064 C 8.716 0.027,7.683 -0.006,7.493 0.015 M8.853 1.563 C 9.967 1.707,11.010 2.136,11.944 2.834 C 12.273 3.080,12.920 3.727,13.166 4.056 C 13.727 4.807,14.142 5.690,14.330 6.535 C 14.544 7.500,14.544 8.500,14.330 9.465 C 13.916 11.326,12.605 12.978,10.867 13.828 C 10.239 14.135,9.591 14.336,8.880 14.444 C 8.456 14.509,7.544 14.509,7.120 14.444 C 5.172 14.148,3.528 13.085,2.493 11.451 C 2.279 11.114,1.999 10.526,1.859 10.119 C 1.618 9.422,1.514 8.781,1.514 8.000 C 1.514 6.961,1.715 6.075,2.160 5.160 C 2.500 4.462,2.846 3.980,3.413 3.413 C 3.980 2.846,4.462 2.500,5.160 2.160 C 6.313 1.599,7.567 1.397,8.853 1.563 M7.706 4.290 C 7.482 4.363,7.355 4.491,7.293 4.705 C 7.257 4.827,7.253 5.106,7.259 6.816 C 7.267 8.786,7.267 8.787,7.325 8.896 C 7.398 9.033,7.538 9.157,7.671 9.204 C 7.803 9.250,8.197 9.250,8.329 9.204 C 8.462 9.157,8.602 9.033,8.675 8.896 C 8.733 8.787,8.733 8.786,8.741 6.816 C 8.749 4.664,8.749 4.662,8.596 4.481 C 8.472 4.333,8.339 4.284,8.040 4.276 C 7.893 4.272,7.743 4.278,7.706 4.290 M7.786 10.530 C 7.597 10.592,7.410 10.753,7.319 10.932 C 7.249 11.072,7.237 11.325,7.294 11.495 C 7.388 11.780,7.697 12.000,8.000 12.000 C 8.303 12.000,8.612 11.780,8.706 11.495 C 8.763 11.325,8.751 11.072,8.681 10.932 C 8.616 10.804,8.460 10.646,8.333 10.580 C 8.217 10.520,7.904 10.491,7.786 10.530 " stroke="none" fill-rule="evenodd" fill="#638272"></path></g></svg>
                `;
        }
    }

    getFileView(file, key) {
        let li = document.createElement('li');
        li.dataset.key = key;
        li.dataset.file = JSON.stringify(file);

        li.innerHTML = `
            ${this.getFileIconView(file)}
            <div class="name text-center">${file.name}</div>
        `;

        this.initEventsLi(li);

        return li;
    }

    readFiles() {
        this.lastFolder = this.currentFolder.join('/');

        this.getFirebaseRef().on('value', (snapshot) => {
            this.listFilesEl.innerHTML = '';

            snapshot.forEach((snapshotItem) => {
                let key = snapshotItem.key;
                let data = snapshotItem.val();

                if (data.type) {
                    this.listFilesEl.appendChild(this.getFileView(data, key));
                }
            });
        });
    }

    openFolder() {
        if (this.lastFolder) this.getFirebaseRef(this.lastFolder).off('value');

        this.renderNav();
        this.readFiles();
    }

    renderNav() {
        let nav = document.createElement('nav');
        let path = [];

        for (let i = 0; i < this.currentFolder.length; i++) {
            let folderName = this.currentFolder[i];
            let span = document.createElement('span');

            path.push(folderName);

            if (i === 0) {
                span.style.cssText = 'color: #1B2733; font-weight: 700;';
                folderName = folderName.toUpperCase();
            } else {
                folderName = folderName.charAt(0).toUpperCase() + folderName.slice(1).toLowerCase();
            }

            if (i + 1 === this.currentFolder.length) {
                span.innerHTML = folderName;
            } else {
                span.className = 'breadcrumb-segment__wrapper';
                span.innerHTML = `
                    <span class="ue-effect-container uee-BreadCrumbSegment-link-0">
                        <a href="#" data-path="${path.join('/')}" class="breadcrumb-segment">${folderName}</a>
                    </span>
                    <svg width="24" height="24" viewBox="0 0 24 24" class="mc-icon-template-stateless" style="top: -1px; position: relative">
                        <title>arrow-right</title>
                        <path d="M10.414 7.05l4.95 4.95-4.95 4.95L9 15.534 12.536 12 9 8.464z" fill="#638272" fill-rule="evenodd"></path>
                    </svg>
                `;
            }

            nav.appendChild(span);
        }

        this.navEl.innerHTML = nav.innerHTML;

        this.navEl.querySelectorAll('a').forEach((a) => {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                this.currentFolder = a.dataset.path.split('/');
                this.openFolder();
            });
        });
    }

    initEventsLi(li) {
        li.addEventListener('dblclick', (e) => {
            let file = JSON.parse(li.dataset.file);

            switch (file.type) {
                case 'folder':
                    this.currentFolder.push(file.name);
                    this.openFolder();
                    break;

                default:
                    window.open('/file?path=' + file.path);
            }
        });

        li.addEventListener('click', (e) => {
            if (e.shiftKey) {
                let firstLi = this.listFilesEl.querySelector('.selected');

                if (firstLi) {
                    let indexStart;
                    let indexEnd;
                    let lis = li.parentElement.childNodes;
                    lis.forEach((el, index) => {
                        if (firstLi === el) indexStart = index;
                        if (li === el) indexEnd = index;
                    });

                    let index = [indexStart, indexEnd].sort();
                    lis.forEach((el, i) => {
                        if (i >= index[0] && i <= index[1]) {
                            el.classList.add('selected');
                        }
                    });

                    this.listFilesEl.dispatchEvent(this.onselectionchange);
                    return true;
                }
            }

            if (!e.ctrlKey) {
                this.listFilesEl.querySelectorAll('li.selected').forEach((el) => {
                    el.classList.remove('selected');
                });
            }

            li.classList.toggle('selected');
            this.listFilesEl.dispatchEvent(this.onselectionchange);
        });
    }
}
