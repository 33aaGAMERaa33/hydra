# Hydra

**Hydra** é um mini framework TypeScript minimalista inspirado no NestJS. Seu foco é ser **leve**, **simples** e **moderno**, utilizando **decoradores** para configuração de rotas, controladores, injeção de dependências e middlewares.

> ⚡ Ideal para projetos rápidos e estruturados com o mínimo de configuração.

---

## ✨ Recursos

- 🎯 **Controladores**: definição clara de endpoints usando decoradores.
- 🧭 **Métodos**: configuração de rotas por método HTTP.
- 💉 **Injetáveis**: suporte à injeção de dependência simples e direta.
- 🛡️ **Middlewares**: execução antes e depois dos handlers das rotas.
- 🔍 **Baseado em decorators**: com `reflect-metadata`.

---

## 🚀 Começo Rápido

### 📦 Instalação

```bash
pnpm install reflect-metadata git+https://github.com/33aaGAMERaa33
```
ou
```bash
npm install reflect-metadata git+https://github.com/33aaGAMERaa33
```
- ⚠️ Apenas o pacote reflect-metadata é necessário. Hydra não possui outras dependências externas.

### ⚙️ Configuração do TypeScript
No seu tsconfig.json, ative as opções necessárias para uso de decorators:
```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### 🔧 Estrutura Inicial
1. Importe o reflect-metadata no ponto de entrada:

```ts
// src/index.ts
import "reflect-metadata"; // <- deve ser a PRIMEIRA linha
```

2. Crie a classe principal com a configuração da aplicação:
```ts
@AppConfig<App>({
  port: (instance) => instance.port, // Porta onde a aplicação irá rodar
})
export class App {
  readonly port: number = 3000;
}
```

3. Inicialize o servidor:
```ts
async function bootstrap() {
  const app = new App();
  const hydra = Hydra.create(app);

  await hydra.startServer();
  // A aplicação agora está rodando
}

bootstrap();
```

4. Crie um controlador com um endpoint:
```ts
@Controller()
export class HelloWorldController {
  @Method(HttpMethod.get)
  async helloWorld() {
    return "Hello, World!";
  }
}
```
> Sem um caminho explícito, o endpoint padrão será a raiz /.

5. Registre o controlador na configuração da aplicação:

```ts
@AppConfig<App>({
  port: (instance) => instance.port,
  controllers: [
    HelloWorldController, // <- registro aqui
  ],
})
export class App {
  readonly port: number = 3000;
}
````

### ✅ Testando
Com tudo configurado, você pode iniciar a aplicação e acessar:
```arduino
http://localhost:3000/
```

Você verá a mensagem:
```
Hello, World!
```

### 📌 Observações
- reflect-metadata deve ser importado antes de qualquer outra coisa no seu projeto.

- Os controladores e injetáveis devem estar registrados na configuração inicial da aplicação.

- O Hydra segue convenções simples, mantendo flexibilidade e leveza.

### 📄 Docs
> Em criação...
- [AppConfig](src/docs/app_config.md)

### 📄 [LICENSE](./LICENSE)
