# TODO

-   [x] Instale o MySQL.
-   [x] Verifique se o MySQL está funcionando corretamente usando o comando `mysql -u root -p` e digitando sua senha ao ser solicitado.
-   [x] Crie usuário com permissões de administrador de banco de dados (`DB Admin`) para os servidores `@%`, `@127.0.0.1` e `@localhost`.[^1]
-   [x] Crie um banco de dados chamado `saboroso` e após selecione-o.
-   [x] Execute o código do arquivo `mysql.sql` para criar as tabelas necessárias no banco de dados `saboroso`.
-   [x] Se você encontrar problemas de conexão com o driver do Node.js para MySQL, execute o comando fornecido para cada usuário e servidor.[^2]

```
ALTER USER 'user'@'server' IDENTIFIED WITH mysql_native_password BY 'password';
```

[^1]: Certifique-se de substituir `user` pela sua escolha de nome de usuário e `password` pela sua senha segura.
[^2]: Este comando altera a autenticação para mysql_native_password, o que pode resolver problemas de compatibilidade.
