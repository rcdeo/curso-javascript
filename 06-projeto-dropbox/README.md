![ArquiteturaDropBoxCloneFirebaseStorage](https://github.com/rcdeo/curso-javascript/assets/16638651/c0b50885-12b8-4ef8-89c2-fb21af4793c8)

### Dropbox-Clone

Para iniciar o **app**, entre na pasta `app` e digite o seguinte comando:

```
npm start
```

> [!NOTE]
> No arquivo `public/src/controller/DropboxController.js`, localize na classe `DropboxController` o método `connectFirebase` e preencha as credenciais de conexão com o seu banco de dados **Firebase**.

```
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
```

> [!WARNING]
> Lembre-se de instalar as depências antes de iniciar.

#### Instalando as dependências do Dropbox-Clone

Na pasta `app`, inicie instalando as dependências do arquivo _package.json_

```
node install
```

Em seguida, entre na `public`, e instale as dependências do arquivo _bower.json_

```
bower install
```
