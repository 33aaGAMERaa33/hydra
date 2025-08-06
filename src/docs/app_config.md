# AppConfig

Aqui aprenderemos mais sobre as configurações da aplicação por meio do decorador `AppConfig`.

> 🔗 [Veja o arquivo AppConfig completo](../decorators/app_config.decorator.ts)

---

## ✨ Assinatura

```ts
export function AppConfig<T>(data: {
  port: (instance: T) => number;
  routeManager?: RouteManager;
  controllers?: ClassConstructor[];
  injectables?: ClassConstructor[];
  middlewares?: ClassConstructor<MiddlewareImpl>[];
}) {
  ...
}
```

### 🧠 Para que serve?
### port

Esse parâmetro recebe uma função cujo argumento é a instância da classe principal da aplicação. Essa função é executada durante a inicialização e define a porta em que o servidor irá rodar.

### routeManager
- Esse parâmetro recebe uma instância de RouteManager, responsável por:

- Gerenciar a execução dos handlers das rotas;

- Controlar a ordem e execução dos middlewares;

- Capturar exceções de handlers e middlewares;

- Preparar e enviar a resposta final da rota.

### controllers, injectables e middlewares
Esses três parâmetros são listas de classes usadas para registrar os elementos principais da aplicação:

- controllers: classes decoradas com @Controller, responsáveis pelas rotas.

- injectables: classes que podem ser injetadas em outras via o sistema de DI.

- middlewares: classes que implementam lógica a ser executada antes/depois das rotas.

Esses registros são fundamentais para que o Hydra saiba como montar e estruturar a aplicação corretamente.